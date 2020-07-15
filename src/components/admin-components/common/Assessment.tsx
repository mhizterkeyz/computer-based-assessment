/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// @ts-ignore
import Workbook from "react-excel-workbook";

import "./Assessment.scss";
import {
  loadUpResults,
  updateExamStatus,
} from "../../../redux/actions/AdministratorActions";
import { StudentList, StudentInfo } from "./AssessmentStudentList";
import { toast } from "react-toastify";
import Modal from "../../Modal";
import _ from "lodash";
import PreviewQuestions from "./PreviewQuestions";
import { AddStudentModalWindow } from "./AssessmentModalWindow";
import {
  facultyAlphabeticalSortFn,
  departmentAlphabeticalSortFn,
  matricDescendingSortFn,
} from "./sortHelperFn";
import {
  getFaculty,
  updateBiodata,
} from "../../../redux/actions/AdministratorActions";
import { TextField } from "./InputField";
import { extendStudentTime } from "../../../api/AdministratorCalls";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFResultView } from "./PDFResultView";

const Assessment = ({
  exam: examination,
  loadUpResults,
  updateExamStatus,
  faculty,
  loading,
  getFaculty,
  match,
  results,
  exams,
  ...props
}: any) => {
  const [student, setStudent] = useState({
    show: false,
    user: "",
    department: "",
    faculty: "",
    status: 0,
    _id: "",
    studentId: "",
  });
  const [exam, setExam] = useState({
    status: 0,
    bioData: [],
    course: "",
    title: "",
    _id: "",
    questions: [],
  });
  const [extendTime, setExtendTime] = useState(0);
  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setExam((exam) => ({ ...exam, ...exams[examination._id] }));
  }, [examination, exams]);

  useEffect(() => {
    if (Object.values(results).length < 1 && exam.status === 2) {
      (async () => {
        try {
          await loadUpResults(exam._id);
        } catch (error) {
          toast.error(error.message, { position: "top-center" });
        }
      })();
    }
  }, [exam]);

  useEffect(() => {
    if (student.show) {
      document.querySelector(".student-section")?.classList.add("show-student");
    } else {
      document
        .querySelector(".student-section")
        ?.classList.remove("show-student");
    }
  }, [student]);

  const showStudent = (
    user: any,
    department: string,
    faculty: string,
    status: number,
    _id: string,
    studentId: string
  ) => {
    setStudent({
      show: true,
      user,
      department,
      faculty,
      status,
      _id,
      studentId,
    });
  };

  const studentsPendingExam = exam.bioData.filter((dta: any) => {
    return dta.status === 0;
  });

  const studentsWritingExam = exam.bioData.filter((dta: any) => {
    return dta.status === 1;
  });

  const studentsFinishedExam = exam.bioData.filter((dta: any) => {
    return dta.status === 2;
  });

  const startCloseAssessmentCheck = () => {
    if (exam.status === 0) {
      toast.warning("No available result yet, Start Assessment first", {
        position: "top-center",
      });
      return;
    }

    if (exam.status === 1) {
      toast.warning("You have to close this Assessment first", {
        position: "top-center",
      });
      return;
    }
  };

  // const handleDownloadPDF = () => {
  //   startCloseAssessmentCheck();
  // };

  const handleUpload = () => {
    startCloseAssessmentCheck();
  };

  const setRunningAssessment = async () => {
    await updateExamStatus(exam._id, { status: 1 });
    setExam({ ...exam, status: 1 });
  };

  const handleStartAssessment = async () => {
    try {
      setRunningAssessment();
      toast.success("Assessment started", {
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  const handleCloseAssessment = async () => {
    try {
      await updateExamStatus(exam._id, { status: 2 });
      await loadUpResults(exam._id);
      setExam({ ...exam, status: 2 });
      toast.success("Assessment Closed", {
        position: "top-center",
      });
      setModalData({ ...modalData, show: false });
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  const handleReopenAssessment = async () => {
    try {
      setRunningAssessment();
      toast.success("Assessment Reopened!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
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
    __data = __data.reduce((acc: any, elem: any) => {
      let { status } = elem;
      status = status === 0 ? "pending" : status === 1 ? "running" : "closed";
      if (
        elem.user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
        elem.user.matric.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
        elem.user.department.department
          .toLowerCase()
          .indexOf(search.toLowerCase()) !== -1 ||
        elem.user.faculty.faculty
          .toLowerCase()
          .indexOf(search.toLowerCase()) !== -1 ||
        status.toLowerCase().indexOf(search.toLowerCase()) !== -1
      )
        return [...acc, elem];
      return acc;
    }, []);
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
    page + 1 >= __data.length / 20 ? Math.floor(__data.length / 20) : page + 1;

  useEffect(() => {
    if (Object.keys(faculty).length < 1) {
      (async () => {
        try {
          await getFaculty();
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [getFaculty, faculty]);

  const onClickShowAddStudentModal = () => {
    setModalData({
      show: true,
      display: (
        <AddStudentModalWindow
          handleModalClose={handleModalClose}
          faculty={faculty}
          examId={exam._id}
        />
      ),
    });
  };

  const handleTimeExtend = async () => {
    try {
      return (
        (await extendStudentTime({
          timeIncrease: extendTime,
          userId: student.studentId,
        })) &&
        toast.success("Operation successful", {
          position: "top-center",
        }) &&
        handleModalClose()
      );
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  console.log(results);

  const handleShowExtendModal = () => {
    setModalData({
      show: true,
      display: (
        <div className="text-center profile">
          <h3>Extend Time</h3>
          <TextField
            name="timeIncrease"
            label="Time Increment (in minutes)"
            placeholder="0"
            type="number"
            handleInputs={(ev: any) => setExtendTime(ev.target.value)}
          />
          <div className="">
            <button onClick={handleModalClose} className="btn btn-primary">
              Cancel
            </button>

            <button
              onClick={handleTimeExtend}
              type="submit"
              className="btn btn-primary ml-2"
            >
              Extend
            </button>
          </div>
        </div>
      ),
    });
  };

  return (
    <>
      <Modal show={modalData.show} handleClose={handleModalClose}>
        {modalData.display}
      </Modal>

      <h2 className="text-center">
        <span style={{ textTransform: "uppercase" }}>{exam.course}</span> -{" "}
        <span style={{ textTransform: "capitalize" }}>{exam.title}</span> <br />{" "}
        <span
          className={
            exam.status === 0
              ? "pending status"
              : exam.status === 1
              ? "running status"
              : "closed status"
          }
        >
          {exam.status === 0
            ? "Pending"
            : exam.status === 1
            ? "Running"
            : "Closed"}
        </span>
      </h2>
      {preview ? (
        <PreviewQuestions
          setPreview={setPreview}
          examId={exam._id}
          examQuestions={exam.questions}
          match={match}
        />
      ) : (
        <>
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

          <div className="d-flex align-items-center justify-content-between mb-5 mt-5 assessment-actions">
            <button
              className="btn btn-primary"
              onClick={() => setPreview(true)}
            >
              Preview Questions
            </button>
            {exam.status === 2 ? (
              <>
                <button
                  className="btn btn-success"
                  onClick={handleUpload}
                  disabled={exam.status < 2 ? true : false}
                >
                  Upload Result
                </button>

                <div>
                  <PDFDownloadLink
                    document={
                      <PDFResultView
                        results={Object.values(results)
                          // .sort(matricDescendingSortFn)
                          .sort(facultyAlphabeticalSortFn)
                          .sort(departmentAlphabeticalSortFn)}
                        examTitle={`${exam.course} - ${exam.title}`}
                      />
                    }
                    fileName={`${exam.course}-${exam.title}.pdf`}
                    className="btn btn-success"
                    style={{ color: "#fff" }}
                    // disabled={exam.status < 2 ? true : false}
                  >
                    {({ blob, url, loading, error }) =>
                      loading
                        ? "Loading PDF Result..."
                        : "Download Result (PDF)"
                    }
                  </PDFDownloadLink>
                  {/* <button
                className="btn btn-success"
                onClick={handleDownloadPDF}
                disabled={exam.status < 2 ? true : false}
              >
                Download Result (PDF)
              </button> */}

                  <Workbook
                    filename={`${exam.course}-${exam.title}.xlsx`}
                    element={
                      <button
                        className="btn btn-success ml-3"
                        disabled={exam.status < 2 ? true : false}
                      >
                        Download Result (Spreadsheet)
                      </button>
                    }
                  >
                    <Workbook.Sheet
                      data={Object.values(results)
                        .sort(matricDescendingSortFn)
                        .sort(facultyAlphabeticalSortFn)
                        .sort(departmentAlphabeticalSortFn)}
                      name="Sheet A"
                    >
                      <Workbook.Column label="Name" value="name" />
                      <Workbook.Column label="Matric No." value="matric" />
                      <Workbook.Column label="Level" value="level" />
                      <Workbook.Column label="Department" value="department" />
                      <Workbook.Column label="Faculty" value="faculty" />
                      <Workbook.Column label="CA. Score" value="ca" />
                      <Workbook.Column label="Examination" value="exam" />
                      <Workbook.Column label="Total" value="total" />
                      <Workbook.Column label="Grade" value="grade" />
                    </Workbook.Sheet>
                  </Workbook>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div className="student-section">
            <section className="tbl">
              <div className="d-flex justify-content-between align-items-center ctrl-actions">
                <button
                  className="btn btn-primary"
                  onClick={onClickShowAddStudentModal}
                >
                  Add Student
                </button>
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
                <div className="d-flex justify-content-between">
                  {exam.status === 2 ? (
                    <button
                      className="mr-3 btn btn-primary"
                      // disabled={exam.status !== 0}
                      onClick={handleReopenAssessment}
                    >
                      Reopen Assesment
                    </button>
                  ) : null}

                  <button
                    className="mr-3 btn btn-primary"
                    disabled={exam.status !== 0}
                    onClick={handleStartAssessment}
                  >
                    Start Assesment
                  </button>
                  {/* <button
                    className="mr-3 btn btn-success"
                    onClick={handleViewResult}

                    // disabled={exam.status < 2}
                  >
                    View Assesment Result
                  </button> */}
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
                <span className="">Status </span>
              </div>

              {biodata.map((dta: any, ind: number) => (
                <StudentList key={ind} {...dta} showStudent={showStudent} />
              ))}

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
                    page >= Math.floor(__data.length / 10) ? "disabled" : ""
                  }`}
                >
                  Next
                </span>
              </div>
            </section>

            <StudentInfo
              student={student}
              setStudent={setStudent}
              updateBiodata={props.updateBiodata}
              examId={exam._id}
              handleShowExtendModal={handleShowExtendModal}
            />
          </div>
        </>
      )}
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    results: state.results,
    faculty: state.faculty,
    exams: state.exams,
    loading: state.apiCallsInProgress > 0,
  };
}

const mapDispatchToProps = {
  loadUpResults,
  updateExamStatus,
  getFaculty,
  updateBiodata,
};

export default connect(mapStateToProps, mapDispatchToProps)(Assessment);
