import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import "./Assessment.scss";
import {
  loadUpResults,
  updateExamStatus,
} from "../../redux/actions/AdministratorActions";
import { StudentList, StudentInfo } from "./AssessmentStudentList";
import { toast } from "react-toastify";

const Assessment = ({
  exam: examination,
  loadUpResults,
  updateExamStatus,
}: any) => {
  const [student, setStudent] = useState({
    show: false,
    user: "",
    department: "",
    faculty: "",
  });

  const [exam, setExam] = useState({
    status: 0,
    bioData: [],
    course: "",
    title: "",
    _id: "",
  });
  useEffect(() => {
    setExam({ ...exam, ...examination });
  }, []);

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

  const history = useHistory();
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

  console.log(exam);

  const handleViewResult = () => {
    if (exam.status === 0) {
      toast.configure();
      toast.warning("No available result yet, Start Assessment first");
      return;
    }

    if (exam.status === 1) {
      toast.configure();
      toast.warning("You have to close this Assessment first");
      return;
    }

    (async () => {
      try {
        await loadUpResults(exam._id);
        history.push("/admin/print-result");
      } catch (error) {
        toast.configure();
        toast.error(error.message);
      }
    })();
  };

  const handleStartAssessment = async () => {
    try {
      toast.configure();
      await updateExamStatus(exam._id, { status: 1 });
      setExam({ ...exam, status: 1 });
      toast.success("Assessment started");
    } catch (error) {
      toast.configure();
      toast.error(error.message);
    }
  };

  const handleCloseAssessment = async () => {
    try {
      toast.configure();
      await updateExamStatus(exam._id, { status: 2 });
      setExam({ ...exam, status: 2 });
      toast.success("Assessment Closed");
    } catch (error) {
      toast.configure();
      toast.error(error.message);
    }
  };

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
                onClick={handleStartAssessment}
              >
                Start Assesment
              </button>
              <button
                className="mr-3 btn btn-success"
                onClick={handleViewResult}

                // disabled={exam.status < 2}
              >
                View Assesment Result
              </button>
              <button
                className="btn btn-danger"
                disabled={exam.status === 0 || exam.status === 2}
                onClick={handleCloseAssessment}
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

const mapDispatchToProps = {
  loadUpResults,
  updateExamStatus,
};

export default connect(null, mapDispatchToProps)(Assessment);
