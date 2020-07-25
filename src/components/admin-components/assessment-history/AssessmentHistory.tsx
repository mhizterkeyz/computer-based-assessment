import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";

import "./AssessmentHistory.scss";
import { loadUpExams } from "../../../redux/actions/AdministratorActions";
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
  let { exams: stateExams, loadUpExams } = props;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    stateExams = Object.values(stateExams)
      .sort((a: any, b: any) => {
        const d1: any = new Date(a.createdAt);
        const d2: any = new Date(b.createdAt);
        return d1 - d2;
      })
      .reduce((acc: any, cur: any) => ({ ...acc, [cur._id]: cur }), {});
    if (!preReq.calledLoadUp) {
      (async () => {
        try {
          await loadUpExams(false, 1);
          setPreReq((i) => ({ ...i, calledLoadUp: true }));
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: "top-center",
          });
        }
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
  useEffect(() => {
    let onScrollHandler = async function (ev: any) {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        const examLength = Object.keys(exams).filter(
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
    };
    window.addEventListener("scroll", onScrollHandler);
    return () => {
      window.removeEventListener("scroll", onScrollHandler);
    };
  }, [props.count, exams, loadUpExams, search]);
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

  return (
    <>
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
                  <Examination exam={exam} key={`examination_history_${i}`} />
                ))
            )}
            <div
              className="count-check text-center mt-5 pb-5"
              style={{
                opacity: 0.6,
                fontSize: 11,
              }}
            >
              {props.count ===
                Object.values(exams).filter(
                  (elem: any) => typeof elem === "object"
                ).length ||
              (search.search &&
                search.searchCount ===
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
};

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentHistory);
