import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import "./AssessmentHistory.scss";
import { loadUpExams } from "../../../redux/actions/AdministratorActions";
import Preloader from "../../Preloader";
import Examination from "./Examination";
import Assessment from "../common/Assessment";
import { toast } from "react-toastify";
import _ from "lodash";

const AssessmentHistory = (props: any) => {
  const [assessment, setAssessment] = useState({ show: false, exam: "" });
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [ahhh, setAhhh] = useState([]);
  let { exams, loadUpExams } = props;
  useEffect(() => {
    if (Object.keys(exams).length < 1) {
      (async () => {
        try {
          await loadUpExams();
        } catch (error) {
          toast.error(`Error: ${error.message}`);
        }
      })();
    }
    setAhhh(_.orderBy(Object.values(exams), "status"));
  }, [exams, loadUpExams]);
  useEffect(() => {
    if (search.length > 0) {
      const searchResult: any = Object.values(
        _.orderBy(Object.values(exams), "status")
      ).reduce((acc: any, cur: any) => {
        let { status, createdAt } = cur;
        let date = new Date(createdAt);
        createdAt = `${date.getDate()}-${date.getMonth()}-${date.getFullYear}`;
        status = status === 0 ? "pending" : status === 1 ? "running" : "closed";
        if (
          cur.title.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
          createdAt.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
          status.toLowerCase().indexOf(search.toLowerCase()) !== -1
        ) {
          return [...acc, cur];
        }
        return acc;
      }, []);
      setAhhh(searchResult);
    }
  }, [search, exams]);

  const onClickShowExamination = (show: boolean, exam: any) => {
    setAssessment({ ...assessment, show: show, exam: exam });
  };

  const paginationArray = (() => {
    const arr = [];
    for (let i = 0; i <= Math.floor(Object.keys(ahhh).length / 10); i++) {
      arr.push(i);
    }
    return arr;
  })();

  const prev = page - 1 <= 0 ? 0 : page - 1;
  const next =
    page + 1 >= Object.keys(ahhh).length / 10
      ? Math.floor(Object.keys(ahhh).length / 10)
      : page + 1;
  const orderedExams = (function biodatas(): any {
    let data: any = [];
    let count =
      page * 10 + 10 > Object.keys(ahhh).length
        ? Object.keys(ahhh).length
        : page * 10 + 10;
    for (let i = page * 10; i < count; i++) {
      data.push(
        Object.values(ahhh).reduce((acc: any, cur: any, index: number) => {
          if (index === i) return cur;
          return acc;
        }, {})
      );
    }
    return data;
  })();

  return (
    <>
      {props.loading ? (
        <Preloader />
      ) : (
        <>
          {assessment.show ? (
            <Assessment exam={assessment.exam} match={props.match} />
          ) : (
            <section className="mt-5 assessment-history">
              <form className="text-right">
                <input
                  className="btn"
                  type="search"
                  value={search}
                  onChange={(ev: any) => {
                    ev.preventDefault();
                    return setSearch(ev.target.value);
                  }}
                  placeholder="&#xe902; Search Examination"
                  style={{ fontFamily: "Poppins, icomoon" }}
                />
              </form>
              <div className="dta-head">
                <span className="">Examination</span>
                <span className="">Date Added</span>
                <span className="text-center">Status</span>
              </div>
              {Object.values(orderedExams).length === 0 ? (
                <div className="text-center mt-5 no-running-exam">
                  There are no available assessments
                </div>
              ) : (
                Object.values(orderedExams).map((exam: any, i: number) => (
                  <Examination
                    exam={exam}
                    onClickShowExamination={onClickShowExamination}
                    key={`examination_history_${i}`}
                  />
                ))
              )}

              <div className="pagination">
                <span
                  onClick={() => setPage(prev)}
                  className={`btn link prev-next ${
                    page <= 0 ? "disabled" : ""
                  }`}
                >
                  Prev
                </span>
                {paginationArray.map((i: number) => {
                  if (
                    i === 0 ||
                    i === page ||
                    i === paginationArray.length - 1 ||
                    i + 1 === page ||
                    i - 1 === page
                  ) {
                    return (
                      <span
                        onClick={() => setPage(i)}
                        className={`btn link ${i === page ? "active" : ""}`}
                        key={`pagination_link_${i}`}
                      >
                        {i + 1}
                      </span>
                    );
                  }
                  if (i === page - 2 || i === page + 2) {
                    return <span key={`pagination_link_${i}`}>&hellip;</span>;
                  }
                  return "";
                })}
                <span
                  onClick={() => setPage(next)}
                  className={`btn link prev-next ${
                    page >= Math.floor(Object.keys(exams).length / 10)
                      ? "disabled"
                      : ""
                  }`}
                >
                  Next
                </span>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    exams: state.exams,
    loading: state.apiCallsInProgress > 0,
  };
}

const mapDispatchToProps = {
  loadUpExams,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentHistory);
