import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import "./Assessment.scss";
import {
  loadUpResults,
  updateExamStatus,
} from "../../../redux/actions/AdministratorActions";
import { StudentList, StudentInfo } from "./AssessmentStudentList";
import { toast } from "react-toastify";
import Modal from "../../Modal";
import _ from "lodash";

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
  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

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

  const studentsPendingExam = exam.bioData.filter((dta: any) => {
    return dta.status === 0;
  });

  const studentsWritingExam = exam.bioData.filter((dta: any) => {
    return dta.status === 1;
  });

  const studentsFinishedExam = exam.bioData.filter((dta: any) => {
    return dta.status === 2;
  });

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
      setModalData({ ...modalData, show: false });
    } catch (error) {
      toast.configure();
      toast.error(error.message);
    }
  };

  const handleModalClose = () => setModalData({ ...modalData, show: false });

  const onClickConfirmCloseAssessment = () => {
    setModalData({
      show: true,
      display: (
        <div className="text-center confirm-modal">
          <h2>Do you want to Close Assessment?</h2>
          <p>
            Closing the Assessment will end all Examination <br />
            Continue by clicking on Close.
          </p>

          <div className="">
            <button className="btn" onClick={handleModalClose}>
              Don't Close
            </button>

            <button className="btn ml-2" onClick={handleCloseAssessment}>
              Close
            </button>
          </div>
        </div>
      ),
    });
  };
  let __data = exam.bioData;
  if (search.length > 0) {
    __data = __data.filter((elem: any) => {
      let { status } = elem;
      status = status === 0 ? "pending" : status === 1 ? "running" : "closed";
      return (
        elem.user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
        elem.user.matric.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
        elem.user.department.department
          .toLowerCase()
          .indexOf(search.toLowerCase()) !== -1 ||
        elem.user.faculty.faculty
          .toLowerCase()
          .indexOf(search.toLowerCase()) !== -1 ||
        status.toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    });
  }
  __data = _.orderBy(__data, "status");
  const biodata = (function biodatas(): any {
    let data: any = [];
    let count = page * 5 + 5 > __data.length ? __data.length : page * 5 + 5;
    for (let i = page * 5; i < count; i++) {
      data.push(__data[i]);
    }
    return data;
  })();
  const paginationArray = (() => {
    const arr = [];
    for (let i = 0; i <= Math.floor(__data.length / 5); i++) {
      arr.push(i);
    }
    return arr;
  })();
  const prev = page - 1 <= 0 ? 0 : page - 1;
  const next =
    page + 1 >= __data.length / 5 ? Math.floor(__data.length / 5) : page + 1;
  return (
    <>
      <Modal show={modalData.show} handleClose={handleModalClose}>
        {modalData.display}
      </Modal>

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
          <button className="btn btn-primary m-auto preview-btn">Preview Assesment Questions</button>
          <div className="d-flex justify-content-between align-items-center ctrl-actions">
            <button className="btn btn-primary">Add Student</button>
            <form>
              <input
                className="btn"
                type="search"
                value={search}
                onChange={(ev: any) => {
                  ev.preventDefault();
                  return setSearch(ev.target.value);
                }}
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
                onClick={onClickConfirmCloseAssessment}
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

          {biodata.map((dta: any, ind: number) => (
            <StudentList key={ind} {...dta} showStudent={showStudent} />
          ))}

          <div className="pagination">
            <span
              onClick={() => setPage(prev)}
              className={`btn link prev-next ${page <= 0 ? "disabled" : ""}`}
            >
              Prev
            </span>
            {paginationArray.map((elem: number, i: number) => {
              return (
                <span
                  onClick={() => setPage(elem)}
                  className={`btn link ${elem === page ? "active" : ""}`}
                  key={`pagination_link_${i}`}
                >
                  {elem + 1}
                </span>
              );
            })}
            <span
              onClick={() => setPage(next)}
              className={`btn link prev-next ${
                page >= Math.floor(__data.length / 10) ? "disabled" : ""
              }`}
            >
              Next
            </span>
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
