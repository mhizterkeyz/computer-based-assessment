import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Modal from "../../Modal";
import _ from "lodash";

import "./AssessmentHistory.scss";
import {
  loadUpExams,
  deleteExam,
} from "../../../redux/actions/AdministratorActions";
import { getExams } from "../../../api/AdministratorCalls";
import Preloader from "../../Preloader";
import Examination from "./Examination";

const AssessmentHistory = (props: any) => {
  const [search, setSearch] = useState({
    searchString: "",
    searchResult: {},
    searchCount: 0,
    search: false,
  });
  const [exams, setexams] = useState({});
  const [preReq, setPreReq] = useState({
    calledLoadUp: false,
  });
  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });
  let { exams: stateExams, loadUpExams } = props;

  useEffect(() => {
    if (!preReq.calledLoadUp) {
      (async () => {
        try {
          await loadUpExams(false, 1);
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: "top-center",
          });
        }
        setPreReq((i) => ({ ...i, calledLoadUp: true }));
      })();
    }
    setexams(search.search ? search.searchResult : stateExams);
  }, [
    stateExams,
    loadUpExams,
    props.location.search,
    preReq.calledLoadUp,
    search.search,
    search.searchResult,
  ]);
  const onScrollHandler = useCallback(
    async function (ev: any) {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 40
      ) {
        const examLength = Object.values(exams).filter(
          (elem: any) => typeof elem === "object"
        ).length;
        if (examLength > 0 && props.count > examLength && !search.search) {
          let t = examLength / 5;
          const a = parseInt(t.toString().split(".")[1]) > 0 ? 1 : 0;
          t = Math.floor(t) + a + 1;
          try {
            await loadUpExams(true, t);
          } catch (error) {
            // Failed to work...
            // The user will have to scroll up and to get the rest
          }
        } else if (
          examLength > 0 &&
          search.search &&
          search.searchCount > examLength
        ) {
          try {
            let t = examLength / 5;
            const a = parseInt(t.toString().split(".")[1]) > 0 ? 1 : 0;
            t = Math.floor(t) + a + 1;
            const res = await getExams(t, search.searchString);
            const searchResult: any = Object.values(res.exams).reduce(
              (acc: any, cur: any) => ({ ...acc, [cur._id]: cur }),
              {}
            );
            setSearch((i) => ({
              ...i,
              searchResult: { ...search.searchResult, ...searchResult },
              searchCount: res.count,
            }));
          } catch (error) {
            //Do nothing. same as above
          }
        }
      }
    },
    [props.count, exams, loadUpExams, search]
  );
  useEffect(() => {
    window.addEventListener("scroll", onScrollHandler);
    return () => {
      window.removeEventListener("scroll", onScrollHandler);
    };
  }, [onScrollHandler]);
  const delayedSearch = useCallback(
    _.debounce(async () => {
      if (search.searchString.length > 0) {
        try {
          const res = await getExams(1, search.searchString);
          const searchResult: any = Object.values(res.exams).reduce(
            (acc: any, cur: any) => ({ ...acc, [cur._id]: cur }),
            {}
          );
          setSearch((i) => ({
            ...i,
            searchResult,
            search: true,
            searchCount: res.count,
          }));
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: "top-center",
          });
        }
      } else {
        setSearch((i) => ({ ...i, search: false }));
      }
    }, 3000),
    [search.searchString]
  );
  useEffect(() => {
    delayedSearch();

    return delayedSearch.cancel;
  }, [search.searchString, delayedSearch]);

  //  Live updates useEffect
  const [updatePageLength, setUPL] = useState(1);
  useEffect(() => {
    const examLength = Object.values(exams).filter(
      (elem: any) => typeof elem === "object"
    ).length;
    let t = examLength / 5;
    const a = parseInt(t.toString().split(".")[1]) > 0 ? 1 : 0;
    t = Math.floor(t) + a;
    if (t !== updatePageLength) {
      setUPL(t);
    }
  }, [exams, updatePageLength]);
  useEffect(() => {
    let updaterFunction = async (page: number) => {
      try {
        if (search.search) {
          const res = await getExams(page, search.searchString);
          let searchResult: any = Object.values(res.exams).reduce(
            (acc: any, cur: any) => ({ ...acc, [cur._id]: cur }),
            {}
          );
          const arr = (function categorize(arra, res = {}, page = 1): any {
            // @ts-ignore
            res[page] = arra.splice(0, 5).reduce((acc: any, cur: any) => {
              return { ...acc, [cur._id]: cur };
            }, {});
            if (arra.length <= 0) return res;
            return categorize(arra, res, ++page);
          })(Object.values(search.searchResult));
          arr[page] = searchResult;
          searchResult = Object.values(arr).reduce(
            (acc: any, cur: any) => ({ ...acc, ...cur }),
            {}
          );
          const newSearch = {
            ...search,
            searchResult,
            searchCount: res.count,
          };
          if (!_.isEqual(search, newSearch)) {
            setSearch(newSearch);
          }
        } else {
          await loadUpExams(true, page);
        }
      } catch (error) {
        //  Live update failed. Do nothing.
      }
      const nextPage = page + 1 > updatePageLength ? 1 : page + 1;
      setTimeout(updaterFunction, 10000, nextPage);
    };
    updaterFunction(1);
    return () => {
      updaterFunction = async () => {};
    };
  }, [search, loadUpExams, updatePageLength, search.searchResult]);

  //  Modal Handler
  const handleModalClose = () => setModalData({ ...modalData, show: false });
  const handleModalOpen = (display = <></>) =>
    setModalData({ display, show: true });
  const handleExamDelete = async (exam_id: string) => {
    try {
      await props.deleteExam(exam_id);
      toast.success("exam deleted", { position: "top-center" });
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <Modal show={modalData.show} handleClose={handleModalClose}>
        {modalData.display}
      </Modal>
      {props.loading ? (
        <Preloader />
      ) : (
        <>
          <section className="mt-5 assessment-history">
            <form className="text-right">
              <input
                className="btn"
                type="search"
                value={search.searchString}
                onChange={(ev: any) => {
                  ev.preventDefault();
                  return setSearch({
                    ...search,
                    searchString: ev.target.value,
                  });
                }}
                placeholder="&#xe947; Search Examination"
                style={{ fontFamily: "Poppins, icomoon" }}
              />
            </form>
            <div className="dta-head">
              <span>Examination</span>
              <span>Date Added</span>
              <span>Status</span>
            </div>
            {Object.values(exams).length === 0 ? (
              <div className="text-center mt-5 no-running-exam">
                There are no available assessments
              </div>
            ) : (
              Object.values(exams)
                .filter((elem: any) => typeof elem === "object")
                .map((exam: any, i: number) => (
                  <Examination
                    exam={exam}
                    confirmModal={handleModalOpen}
                    closeModal={handleModalClose}
                    deleteExam={handleExamDelete}
                    key={`examination_history_${i}`}
                  />
                ))
            )}
            <div
              className="count-check text-center mt-5 pb-5"
              style={{
                opacity: 0.6,
                fontSize: 11,
              }}
            >
              {props.count <=
                Object.values(exams).filter(
                  (elem: any) => typeof elem === "object"
                ).length ||
              (search.search &&
                search.searchCount <=
                  Object.values(exams).filter(
                    (elem: any) => typeof elem === "object"
                  ).length) ? (
                <></>
              ) : (
                "loading data ..."
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    exams: state.exams,
    count: state.counts.exams,
    loading: state.apiCallsInProgress > 0,
  };
}

const mapDispatchToProps = {
  loadUpExams,
  deleteExam,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentHistory);
