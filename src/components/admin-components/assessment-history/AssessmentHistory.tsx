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
  let { exams, loadUpExams } = props;

  // if (window.location.pathname !== "/admin/history") {
  //   props.history.push("/admin/history");
  // }

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
  }, [exams, loadUpExams]);

  const onClickShowExamination = (show: boolean, exam: any) => {
    setAssessment({ ...assessment, show: show, exam: exam });
  };

  exams = _.orderBy(Object.values(props.exams), "status");
  if (search.length > 0) {
    exams = Object.values(exams).filter((elem: any) => {
      let { status, createdAt } = elem;
      let date = new Date(elem.createdAt);
      createdAt = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
      status = status === 0 ? "pending" : status === 1 ? "running" : "closed";
      return (
        elem.title.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
        createdAt.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
        status.toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    });
  }

  const paginationArray = (() => {
    const arr = [];
    for (let i = 0; i <= Math.floor(Object.keys(exams).length / 10); i++) {
      arr.push(i);
    }
    return arr;
  })();

  const prev = page - 1 <= 0 ? 0 : page - 1;
  const next =
    page + 1 >= Object.keys(exams).length / 10
      ? Math.floor(Object.keys(exams).length / 10)
      : page + 1;
  const orderedExams = (function biodatas(): any {
    let data: any = [];
    let count =
      page * 10 + 10 > Object.keys(exams).length
        ? Object.keys(exams).length
        : page * 10 + 10;
    for (let i = page * 10; i < count; i++) {
      data.push(exams[i]);
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
                    return <>&hellip;</>;
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
