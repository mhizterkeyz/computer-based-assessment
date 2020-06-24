import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./AssessmentHistory.scss";
import { loadUpExams } from "../../../redux/actions/AdministratorActions";
import Preloader from "../../Preloader";
import Examination from "./Examination";
import Assessment from "../Assessment";
import { toast } from "react-toastify";

const AssessmentHistory = (props: {
  exams: any;
  loading: boolean;
  loadUpExams: () => Promise<any>;
}) => {
  const [assessment, setAssessment] = useState({ show: false, exam: "" });
  const { exams, loadUpExams } = props;

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

  return (
    <>
      {props.loading ? (
        <Preloader />
      ) : (
        <>
          {assessment.show ? (
            <Assessment exam={assessment.exam} />
          ) : (
            <section className="mt-5 assessment-history">
              <form className="text-right">
                <input
                  type="search"
                  placeholder="&#xe902; Search Examination"
                  style={{ fontFamily: "Poppins, icomoon" }}
                />
              </form>
              <div className="dta-head">
                <span className="">Examination</span>
                <span className="">Date Added</span>
                <span className="text-center">Status</span>
              </div>
              {Object.values(props.exams).map((exam: any) => (
                <Examination
                  exam={exam}
                  onClickShowExamination={onClickShowExamination}
                />
              ))}

              <div className="pagination">
                <Link to="/admin/asssesment" className="btn link prev-next">
                  Prev
                </Link>
                <Link to="/admin/asssesment" className="btn link">
                  1
                </Link>
                <Link to="/admin/asssesment" className="btn link">
                  2
                </Link>
                <Link to="/admin/asssesment" className="btn link active">
                  3
                </Link>
                <Link to="/admin/asssesment" className="btn link">
                  4
                </Link>
                <Link to="/admin/asssesment" className="btn link">
                  5
                </Link>
                <Link to="/admin/asssesment" className="btn link prev-next">
                  Next
                </Link>
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
