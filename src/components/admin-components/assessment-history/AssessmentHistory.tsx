import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, Switch, BrowserRouter as Router, Route } from "react-router-dom";

import "./AssessmentHistory.scss";
import { loadUpExams } from "../../../redux/actions/AdministratorActions";
import Preloader from "../../Preloader";

const Examination = ({ exam }: { exam: any }) => {
  let status = {
    class: "",
    name: "",
  };

  if (exam.status === 0) {
    status.class = "status-pending";
    status.name = "pending";
  } else if (exam.status === 1) {
    status.class = "status-running";
    status.name = "running";
  } else {
    status.class = "status-closed";
    status.name = "closed";
  }

  return (
    <div
      className="dta-body"
      onClick={() => {
        // showStudent("16ME1023");
      }}
    >
      <span className="">
        {exam.course} - {exam.title}
      </span>
      {/* TODO Format Date properly */}
      <span className="">{exam.createdAt}</span>
      {/* <span className="">7th June 2020</span> */}
      <span className={status.class}>{status.name}</span>
    </div>
  );
};

const AssessmentHistory = (props: {
  exams: any;
  loading: boolean;
  loadUpExams: () => Promise<any>;
}) => {
  useEffect(() => {
    if (Object.keys(props.exams).length < 1) {
      (async () => {
        try {
          await props.loadUpExams();
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [props.exams]);

  console.log(props.exams);

  return (
    <>
      {props.loading ? (
        <Preloader />
      ) : (
        <>
          <section className="mt-5 assessment-history">
            <form className="text-right">
              <input
                type="search"
                placeholder="Search Examination"
                className=""
              />
            </form>
            <div className="dta-head">
              <span className="">Examination</span>
              <span className="">Date Added</span>
              <span className="text-center">Status</span>
            </div>
            {Object.values(props.exams).map((exam: any) => (
              <Examination exam={exam} />
            ))}

            {/* <Examination class="status-running" title={""} status="running" />

      <Examination class="status-pending" title={""} status="pending" />

      <Examination class="status-closed" title={""} status="closed" /> */}

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
