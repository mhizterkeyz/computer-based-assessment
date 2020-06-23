import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./Assessment.scss";
import { loadUpExams } from "../../redux/actions/AdministratorActions";
import { StudentList, StudentInfo } from "./AssessmentStudentList";

const Assessment = ({ exam }: { exam: any }) => {
  const [student, setStudent] = useState({
    show: false,
    user: "",
    department: "",
    faculty: "",
  });

  useEffect(() => {
    if (student.show) {
      document.querySelector(".student-section")?.classList.add("show-student");
    } else {
      document
        .querySelector(".student-section")
        ?.classList.remove("show-student");
    }
  }, [student]);

  const showStudent = (user: any, department: string, faculty: string) => {
    setStudent({ show: true, user, department, faculty });
  };

  let status = {
    class: "",
    name: "",
  };

  if (exam.status === 0) {
    status.class = "pending";
    status.name = "Pending";
  } else if (exam.status === 1) {
    status.class = "running";
    status.name = "Running";
  } else {
    status.class = "closed";
    status.name = "Closed";
  }

  const studentsPendingExam = exam.bioData.filter((dta: any, ind: number) => {
    return dta.status === 0;
  });

  const studentsWritingExam = exam.bioData.filter((dta: any, ind: number) => {
    return dta.status === 1;
  });

  const studentsFinishedExam = exam.bioData.filter((dta: any, ind: number) => {
    return dta.status === 2;
  });

  console.log(exam.bioData);

  return (
    <>
      <h2 className="text-center">
        <span style={{ textTransform: "uppercase" }}>{exam.course}</span> -{" "}
        <span style={{ textTransform: "capitalize" }}>{exam.title}</span> <br />{" "}
        <span className={status.class + " status"}>{status.name}</span>
      </h2>
      <section className="d-flex justify-content-center">
        <div className="d-flex dash-detail">
          <i className="icon-assessment">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-assessment">
            <h3>{exam.bioData.length}</h3>
            <h4>Students</h4>
          </div>
        </div>

        <div className="d-flex dash-detail">
          <i className="icon-pending">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-pending">
            <h3>{studentsPendingExam.length}</h3>
            <h4>Students pending</h4>
          </div>
        </div>

        <div className="d-flex dash-detail">
          <i className="icon-closed">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-closed">
            <h3>{studentsFinishedExam.length}</h3>
            <h4>Students finished</h4>
          </div>
        </div>

        <div className="d-flex dash-detail">
          <i className="icon-running">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-running">
            <h3>{studentsWritingExam.length}</h3>
            <h4>Students online</h4>
          </div>
        </div>
      </section>

      <div className="student-section">
        <section className="tbl">
          <div className="d-flex justify-content-between align-items-center ctrl-actions">
            <button className="btn btn-primary">Add Student</button>
            <form>
              <input
                type="search"
                placeholder="&#xe902; Search Student"
                style={{ fontFamily: "Poppins, icomoon" }}
              />
            </form>
            <div>
              <button
                className="mr-3 btn btn-primary"
                disabled={exam.status !== 0}
              >
                Start Assesment
              </button>
              <button className="mr-3 btn btn-success">
                View Assesment Result
              </button>
              <button
                className="btn btn-danger"
                disabled={exam.status === 0 || exam.status === 3}
              >
                Close Assessment
              </button>
            </div>
          </div>

          <div className="dta-head ">
            <span className="">Student</span>
            <span className="">Matric. No</span>
            <span className="">Department</span>
            <span className="">Faculty</span>
            <span className="">Status</span>
          </div>

          {exam.bioData.map((dta: any, ind: number) => (
            <StudentList key={ind} {...dta} showStudent={showStudent} />
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

        <StudentInfo {...student} />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Assessment);
