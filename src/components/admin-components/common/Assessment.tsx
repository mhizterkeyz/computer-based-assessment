import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Link } from "react-router-dom";
// @ts-ignore
import Workbook from "react-excel-workbook";

import "./Assessment.scss";
import { StudentList, StudentInfo } from "./AssessmentStudentList";
import { toast } from "react-toastify";
import Modal from "../../Modal";
import PreviewQuestions from "./PreviewQuestions";
import AddStudentModalWindow from "./AssessmentModalWindow";
import {
  facultyAlphabeticalSortFn,
  departmentAlphabeticalSortFn,
  matricDescendingSortFn,
} from "./sortHelperFn";
import {
  getFaculty,
  updateBiodata,
  loadSingleExam,
  loadSingleBiodata,
  loadUpQuestions,
  loadUpResults,
  updateExam,
} from "../../../redux/actions/AdministratorActions";
import { TextField } from "./InputField";
import {
  extendStudentTime,
  getOneBioData,
} from "../../../api/AdministratorCalls";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFResultView } from "./PDFResultView";
import Preloader from "../../Preloader";

const queryParser = (data: string) => {
  data = data.replace("?", "");
  let arr = data.split("&&");
  return arr.reduce((acc: any, cur: any) => {
    let arr2 = cur.split("=");
    return {
      ...acc,
      [arr2[0]]: isNaN(parseInt(arr2[1])) ? arr2[1] : parseInt(arr2[1]),
    };
  }, {});
};

const Assessment = (props: any) => {
  const {
    results,
    faculty,
    match,
    loadSingleExam,
    loadSingleBiodata,
    loadUpQuestions,
    loadUpResults,
    getFaculty,
    updateExam,
  } = props;
  const { id } = match.params;
  const [exam, setExam] = useState({
    docStatus: false,
    status: 0,
    bioData: {},
    course: "",
    title: "",
    _id: "",
    questions: {
      "1": undefined,
    },
  });
  const [student, setStudent] = useState({
    show: false,
    user: "",
    department: "",
    faculty: "",
    status: 0,
    _id: "",
    studentId: "",
  });
  const [extendTime, setExtendTime] = useState(0);
  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });
  const [search, setSearch] = useState({
    searchString: "",
    searchResult: {},
    searchCount: 0,
    running: 0,
    pending: 0,
    done: 0,
    search: false,
  });
  const [query, setQuery] = useState({
    page: 1,
  });
  const [preReqs, setPreReqs] = useState({
    examLoaded: false,
    resultsLoaded: false,
    facultyLoaded: false,
  });

  useEffect(() => {
    let exams = props.exams[id] || {};
    if (!preReqs.examLoaded) {
      (async () => {
        try {
          await loadSingleExam(id);
          setPreReqs((i) => ({ ...i, examLoaded: true }));
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: "top-center",
          });
        }
      })();
    }
    setExam((i) => ({ ...i, ...exams }));
  }, [props.exams, id, loadSingleExam, preReqs.examLoaded]);
  useEffect(() => {
    let bioData = props.biodatas[id];
    if (!bioData) {
      (async () => {
        try {
          await loadSingleBiodata(id);
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: "top-center",
          });
        }
      })();
      return () => {};
    }
    setExam(
      search.search
        ? (i) => ({ ...i, bioData: search.searchResult })
        : (i) => ({ ...i, bioData: bioData })
    );
  }, [
    id,
    loadSingleBiodata,
    props.biodatas,
    search.search,
    search.searchResult,
  ]);
  useEffect(() => {
    if (!preReqs.resultsLoaded && exam.status === 2) {
      (async () => {
        try {
          await loadUpResults(exam._id);
          setPreReqs((i) => ({ ...i, resultsLoaded: true }));
        } catch (error) {
          toast.error(error.message, { position: "top-center" });
        }
      })();
    }
  }, [exam, results, loadUpResults, preReqs.resultsLoaded]);
  useEffect(() => {
    if (student.show) {
      document.querySelector(".student-section")?.classList.add("show-student");
    } else {
      document
        .querySelector(".student-section")
        ?.classList.remove("show-student");
    }
  }, [student]);
  useEffect(() => {
    if (!preReqs.facultyLoaded) {
      (async () => {
        try {
          await getFaculty();
          setPreReqs((i) => ({ ...i, facultyLoaded: true }));
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [faculty, getFaculty, preReqs.facultyLoaded]);
  const delayedSearch = useCallback(
    _.debounce(async () => {
      if (search.searchString.length > 0) {
        try {
          const res = await getOneBioData(id, 1, search.searchString);
          const searchResult: any = Object.values(res.biodatas)[0];
          setSearch((i) => ({
            ...i,
            searchResult,
            search: true,
            ...res,
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
  useEffect(() => {
    const dataCheck = async (ev: any) => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (
          ((Object.keys(exam.bioData).length > 0 &&
            props.count[id] &&
            props.count[id].count) ||
            0) > Object.keys(exam.bioData).length &&
          !search.search
        ) {
          let t = Object.keys(exam.bioData).length / 5;
          const a = parseInt(t.toString().split(".")[1]) > 0 ? 1 : 0;
          t = Math.floor(t) + a + 1;
          try {
            await loadSingleBiodata(id, t, true);
          } catch (error) {
            // Failed to work...
            // The user will have to scroll up and to get the rest
          }
        } else if (
          search.search &&
          search.searchCount > Object.keys(exam.bioData).length
        ) {
          try {
            let t = search.searchCount / 5;
            const a = parseInt(t.toString().split(".")[1]) > 0 ? 1 : 0;
            t = Math.floor(t) + a;
            const res = await getOneBioData(id, t, search.searchString);
            const searchResult: any = Object.values(res.biodatas)[0];
            setSearch((i) => ({
              ...i,
              searchResult: { ...i.searchResult, ...searchResult },
              search: true,
              ...res,
              searchCount: res.count,
            }));
          } catch (error) {
            //Do nothing. same as above
          }
        }
      }
    };
    window.addEventListener("scroll", dataCheck);
    return () => {
      window.removeEventListener("scroll", dataCheck);
    };
  }, [props.count, exam.bioData, search, id, loadSingleBiodata]);
  useEffect(() => {
    const count = props.questions[id] || 0;
    const query = queryParser(props.location.search);
    const page =
      !isNaN(parseInt(query.page)) &&
      parseInt(query.page) > 0 &&
      parseInt(query.page) <= count
        ? parseInt(query.page)
        : 1;
    setQuery((i) => ({ ...i, page }));
  }, [props.location.search, props.questions, id]);
  useEffect(() => {
    // @ts-ignore
    const question: any = exam.questions[query.page];
    if (!question) {
      (async () => {
        try {
          await loadUpQuestions(id, query.page, true);
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: "top-center",
          });
        }
      })();
    } else return () => {};
  }, [
    props.location.search,
    query.page,
    id,
    loadUpQuestions,
    exam.questions,
    props.questions,
  ]);
  useEffect(() => {
    const scrollCheck = () => {
      if (window.scrollY >= 521 && student.show) {
        document
          .querySelector(".student-section")
          ?.classList.add("lock-student");
      } else {
        document
          .querySelector(".student-section")
          ?.classList.remove("lock-student");
      }
    };
    window.addEventListener("scroll", scrollCheck);
    return () => {
      window.removeEventListener("scroll", scrollCheck);
    };
  }, [student.show]);

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
  const handleUpload = () => {
    startCloseAssessmentCheck();
  };
  const handleAssessmentStatus = async (
    status = 1,
    message = "Assessment started"
  ) => {
    try {
      await updateExam(id, { status });
      toast.success(`${message}`, {
        position: "top-center",
      });
      return true;
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-center",
      });
      return false;
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
            <button
              className="btn ml-2"
              onClick={() =>
                handleAssessmentStatus(2, "Assessment closed") &&
                handleModalClose()
              }
            >
              Close
            </button>
          </div>
        </div>
      ),
    });
  };
  const onClickShowAddStudentModal = () => {
    setModalData({
      show: true,
      display: (
        <AddStudentModalWindow
          handleModalClose={handleModalClose}
          faculty={faculty}
          examId={exam._id}
          counts={{
            count: (props.count[id] && props.count[id].count) || 0,
            pending: (props.count[id] && props.count[id].count) || 0,
          }}
        />
      ),
    });
  };
  const handleTimeExtend = async () => {
    try {
      return (
        (await extendStudentTime({
          timeIncrease: extendTime,
          userId: student._id,
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

  if (!exam.docStatus || props.loading) {
    // Return page loading or 404 page

    return props.loading ? <Preloader /> : <>No exam with that ID</>;
  }
  if (
    props.location.pathname === `/admin/exams/${exam._id}/questions` ||
    props.location.pathname === "/admin/running-asssesment/questions"
  ) {
    return (
      <PreviewQuestions
        examQuestions={exam.questions}
        examId={exam._id}
        questionCount={props.questions[id] || 0}
        page={query.page}
        location={props.location}
      />
    );
  }
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
      {/* Quick Info Section */}

      <section className="d-flex justify-content-center">
        <div className="d-flex dash-detail">
          <i className="icon-assessment">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-assessment">
            <h3>
              {search.search
                ? search.searchCount
                : (props.count[props.match.params.id] &&
                    props.count[props.match.params.id].count) ||
                  0}
            </h3>
            <h4>Students</h4>
          </div>
        </div>
        <div className="d-flex dash-detail">
          <i className="icon-pending">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-pending">
            <h3>
              {search.search
                ? search.pending
                : (props.count[props.match.params.id] &&
                    props.count[props.match.params.id].pending) ||
                  0}
            </h3>
            <h4>Students pending</h4>
          </div>
        </div>
        <div className="d-flex dash-detail">
          <i className="icon-closed">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-closed">
            <h3>
              {search.search
                ? search.done
                : (props.count[props.match.params.id] &&
                    props.count[props.match.params.id].done) ||
                  0}
            </h3>
            <h4>Students finished</h4>
          </div>
        </div>
        <div className="d-flex dash-detail">
          <i className="icon-running">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-running">
            <h3>
              {search.search
                ? search.running
                : (props.count[props.match.params.id] &&
                    props.count[props.match.params.id].running) ||
                  0}
            </h3>
            <h4>Students online</h4>
          </div>
        </div>
      </section>

      {/* End: Quick Info Section */}

      {/* Action Buttons Section */}

      <div className="d-flex align-items-center justify-content-between mb-5 mt-5 assessment-actions">
        <Link
          className="btn btn-primary"
          to={`${props.location.pathname}/questions`}
        >
          Preview Questions
        </Link>
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
                className={`btn btn-success ${
                  Object.keys(results).length <
                  ((props.count[id] && props.count[id].count) || 0)
                    ? "disabled"
                    : ""
                }`}
                style={{ color: "#fff" }}
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Loading PDF Result..." : "Download Result (PDF)"
                }
              </PDFDownloadLink>
              <Workbook
                filename={`${exam.course}-${exam.title}.xlsx`}
                element={
                  <button
                    className="btn btn-success ml-3"
                    disabled={
                      Object.keys(results).length <
                      ((props.count[id] && props.count[id].count) || 0)
                    }
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

      {/* End: Action Buttons Section */}

      <div className="student-section">
        {/* Action Buttons 2 */}

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
                value={search.searchString}
                onChange={(ev: any) => {
                  ev.preventDefault();
                  return setSearch({
                    ...search,
                    searchString: ev.target.value,
                  });
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
                  onClick={() =>
                    handleAssessmentStatus(1, "Assessment reopened!")
                  }
                >
                  Reopen Assesment
                </button>
              ) : null}
              <button
                className="mr-3 btn btn-primary"
                disabled={exam.status !== 0}
                onClick={() => handleAssessmentStatus()}
              >
                Start Assesment
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
            <span className="">Status </span>
          </div>
          {Object.values(exam.bioData).map((dta: any, ind: number) => (
            <StudentList key={ind} {...dta} showStudent={showStudent} />
          ))}
        </section>

        {/* End: Action Buttons 2 */}

        <StudentInfo
          student={student}
          setStudent={setStudent}
          updateBiodata={props.updateBiodata}
          examId={exam._id}
          handleShowExtendModal={handleShowExtendModal}
        />
      </div>
      <div
        className="count-check text-center mt-5 pb-5"
        style={{
          opacity: 0.6,
          fontSize: 11,
        }}
      >
        {((props.count[id] && props.count[id].count) || 0) ===
          Object.keys(exam.bioData).length ||
        (search.search &&
          search.searchCount === Object.keys(exam.bioData).length)
          ? "that's all"
          : "loading data ..."}
      </div>
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    results: state.results,
    faculty: state.faculty,
    exams: state.exams,
    biodatas: state.biodatas,
    count: state.counts.biodatas,
    questions: state.counts.questions,
    loading: state.apiCallsInProgress > 0,
  };
}

const mapDispatchToProps = {
  loadUpResults,
  updateExam,
  getFaculty,
  updateBiodata,
  loadSingleExam,
  loadSingleBiodata,
  loadUpQuestions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Assessment);
