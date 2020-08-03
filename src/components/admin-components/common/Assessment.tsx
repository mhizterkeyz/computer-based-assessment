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
import AddStudentModalWindow, {
  AddMassScoreModal,
} from "./AssessmentModalWindow";
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
  getResults,
} from "../../../api/AdministratorCalls";
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
    administrator,
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
  const [triedLoading, setTriedLoading] = useState({
    criticalFail: false,
  });
  const [resultUrl, setResultUrl] = useState({
    pdf: "",
    xlsx: "",
    loadingPdf: true,
    loadingXlsx: true,
    refreshingPdf: false,
    refreshingXlsx: false,
  });

  const [editScore, setEditScore] = useState(false);
  const { criticalFail: critical } = triedLoading;

  useEffect(() => {
    let exams = props.exams[id] || {};
    if (!exams.loaded && !critical) {
      (async () => {
        try {
          await loadSingleExam(id);
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: "top-center",
          });
          setTriedLoading((i) => ({ ...i, criticalFail: true }));
        }
      })();
    }
    setExam((i) => ({ ...i, ...exams }));
  }, [props.exams, id, loadSingleExam, critical]);

  useEffect(() => {
    let bioData = props.biodatas[id];
    if (!bioData && !critical) {
      (async () => {
        try {
          await loadSingleBiodata(id);
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: "top-center",
          });
          setTriedLoading((i) => ({ ...i, criticalFail: true }));
        }
      })();
      return () => {};
    }
    if (bioData || search.search) {
      setExam(
        search.search
          ? (i) => ({ ...i, bioData: search.searchResult })
          : (i) => ({ ...i, bioData: bioData })
      );
    }
  }, [
    id,
    critical,
    loadSingleBiodata,
    props.biodatas,
    search.search,
    search.searchResult,
  ]);

  useEffect(() => {
    if (exam.status === 2) {
      (async () => {
        try {
          setResultUrl((i) => ({ ...i, loadingPdf: true }));
          const pdf = `http://localhost:8000/api/static/${await getResults(
            exam._id
          )}`;
          setResultUrl((i) => ({ ...i, pdf, loadingPdf: false }));
        } catch (error) {
          setResultUrl((i) => ({ ...i, pdf: "", loadingPdf: true }));
        }
      })();
      (async () => {
        try {
          setResultUrl((i) => ({ ...i, loadingXlsx: true }));
          const xlsx = `http://localhost:8000/api/static/${await getResults(
            exam._id,
            "?xlsx=1"
          )}`;
          setResultUrl((i) => ({ ...i, xlsx, loadingXlsx: false }));
        } catch (error) {
          setResultUrl((i) => ({ ...i, xlsx: "", loadingXlsx: true }));
        }
      })();
    }
  }, [exam.status, exam._id]);

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
    if (!faculty.loaded) {
      (async () => {
        try {
          await getFaculty();
        } catch (error) {
          toast.error(error.message, { autoClose: false });
        }
      })();
    }
  }, [faculty, getFaculty]);

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
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 40
      ) {
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
    if (!triedLoading[query.page] && !critical) {
      (async () => {
        setTriedLoading((i) => ({ ...i, [query.page]: true }));
        try {
          await loadUpQuestions(id, query.page, true);
        } catch (error) {
          toast.error(`Error: ${error.message}`, {
            position: "top-center",
          });
          setTriedLoading((i) => ({
            ...i,
            [query.page]: false,
            criticalFail: true,
          }));
        }
      })();
    }
  }, [
    critical,
    triedLoading,
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

  //  Live update effect
  const [updatePageLength, setUPL] = useState(1);
  useEffect(() => {
    const length = Object.keys(exam.bioData).length;
    let t = length / 5;
    const a = parseInt(t.toString().split(".")[1]) > 0 ? 1 : 0;
    t = Math.floor(t) + a;
    if (t !== updatePageLength) {
      setUPL(t);
    }
  }, [exam.bioData, updatePageLength]);
  useEffect(() => {
    let updaterFunction = async (page: number) => {
      try {
        if (search.search) {
          const res = await getOneBioData(id, page, search.searchString);
          let searchResult: any = Object.values(res.biodatas)[0];
          const arr = (function categorize(arra, res = {}, page = 1): any {
            // @ts-ignore
            res[page] = arra.splice(0, 5).reduce((acc: any, cur: any) => {
              return { ...acc, [cur._id]: cur };
            }, {});
            if (arra.length <= 0) return res;
            return categorize(arra, res, ++page);
          })(Object.values(search.searchResult));
          arr[page] = searchResult;
          searchResult = Object.values(arr).reduce(
            (acc: any, cur: any) => ({ ...acc, ...cur }),
            {}
          );
          const newSearch = {
            ...search,
            searchResult,
            ...res,
            searchCount: res.count,
          };
          if (!_.isEqual(search, newSearch)) {
            // @ts-ignore
            setSearch(newSearch);
          }
        } else {
          await loadSingleBiodata(id, page, true);
        }
      } catch (error) {
        //  Live update failed. Do nothing.
      }
      const nextPage = page + 1 > updatePageLength ? 1 : page + 1;
      setTimeout(updaterFunction, 10000, nextPage);
    };
    if (
      props.location.pathname === `/admin/exams/${exam._id}/questions` ||
      props.location.pathname === "/admin/running-asssesment/questions"
    )
      return () => {
        updaterFunction = async () => {};
      };
    updaterFunction(1);
    return () => {
      updaterFunction = async () => {};
    };
  }, [
    search,
    updatePageLength,
    id,
    loadSingleBiodata,
    props.location.pathname,
    exam._id,
  ]);
  useEffect(() => {
    let questionUpdater = async () => {
      try {
        await loadUpQuestions(id, query.page, true);
      } catch (error) {
        //  question update failed. do nothing
      }
      setTimeout(questionUpdater, 10000);
    };
    if (
      props.location.pathname !== `/admin/exams/${exam._id}/questions` &&
      props.location.pathname !== "/admin/running-asssesment/questions"
    )
      return () => {
        questionUpdater = async () => {};
      };
    questionUpdater();
    return () => {
      questionUpdater = async () => {};
    };
  }, [id, query.page, loadUpQuestions, props.location.pathname, exam._id]);
  useEffect(() => {
    let facultyUpdater = async () => {
      try {
        await getFaculty();
      } catch (error) {
        //  Faculty update failed. do nothing
      }
      setTimeout(facultyUpdater, 10000);
    };
    if (
      props.location.pathname !== `/admin/exams/${exam._id}/questions` &&
      props.location.pathname !== "/admin/running-asssesment/questions"
    )
      return () => {
        facultyUpdater = async () => {};
      };
    facultyUpdater();
    return () => {
      facultyUpdater = async () => {};
    };
  }, [getFaculty, props.location.pathname, exam._id]);
  useEffect(() => {
    let updateExam = async () => {
      try {
        await loadSingleExam(id, true);
      } catch (error) {
        //  update failed. do nothing
      }
      setTimeout(updateExam, 10000);
    };
    if (
      props.location.pathname === `/admin/exams/${exam._id}/questions` ||
      props.location.pathname === "/admin/running-asssesment/questions"
    )
      return () => {
        updateExam = async () => {};
      };
    updateExam();
    return () => {
      updateExam = async () => {};
    };
  }, [loadSingleExam, id, props.location.pathname, exam._id]);

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

  const onClickShowAddMassScoreModal = () => {
    setModalData({
      show: true,
      display: <AddMassScoreModal handleModalClose={handleModalClose} />,
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

  const handleScoreModal = () => {
    setModalData({
      show: true,
      display: (
        <div className="text-center profile">
          <h3>Examination Score</h3>
          <div className="d-flex flex-column align-items-center">
            <div className="d-flex align-items-center mb-4">
              <h4 style={{ marginBottom: 0 }}>
                {
                  //  @ts-ignore
                  exam.bioData[student._id].exam
                }
              </h4>
            </div>
            {administrator.isRootAdmin ? (
              <TextField
                name="timeIncrease"
                placeholder={
                  //  @ts-ignore
                  exam.bioData[student._id].exam
                }
                type="number"
                // handleInputs={(ev: any) => setExtendTime(ev.target.value)}
              />
            ) : (
              <></>
            )}
          </div>

          <div className="">
            <button onClick={handleModalClose} className="btn btn-primary">
              Cancel
            </button>

            {administrator.isRootAdmin ? (
              <button
                // onClick={handleTimeExtend}
                type="submit"
                className="btn btn-primary ml-2"
              >
                Add
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      ),
    });
  };

  if (!exam.docStatus || props.loading) {
    // Return page loading or 404 page

    return props.loading ? <Preloader /> : <></>;
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
        <span className="d-flex flex-column justify-content-center align-items-center">
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

          <button
            className="btn mt-2"
            style={{
              color: "#007bff",
              cursor: "pointer",
            }}
          >
            Edit Assesment
            <i className="icon-edit ml-2"></i>
          </button>
        </span>
      </h2>
      {/* Quick Info Section */}

      <section className="d-flex justify-content-center">
        <div className="d-flex dash-detail">
          <i className="icon-total">
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
            <span className="path4" />
            <span className="path5" />
            <span className="path6" />
            <span className="path7" />
            <span className="path8" />
            <span className="path9" />
            <span className="path10" />
            <span className="path11" />
            <span className="path12" />
            <span className="path13" />
            <span className="path14" />
            <span className="path15" />
            <span className="path16" />
            <span className="path17" />
            <span className="path18" />
            <span className="path19" />
            <span className="path20" />
          </i>
          <div className="ml-3 total-assessment">
            <h3>
              {search.search
                ? search.searchCount
                : (props.count[props.match.params.id] &&
                    props.count[props.match.params.id].count) ||
                  0}
            </h3>
            <h4>Total Students</h4>
          </div>
        </div>
        <div className="d-flex dash-detail">
          <i className="icon-pending">
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
            <span className="path4" />
            <span className="path5" />
            <span className="path6" />
            <span className="path7" />
            <span className="path8" />
            <span className="path9" />
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
          <i className="icon-finished">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
            <span className="path6"></span>
            <span className="path7"></span>
            <span className="path8"></span>
            <span className="path9"></span>
            <span className="path10"></span>
            <span className="path11"></span>
            <span className="path12"></span>
            <span className="path13"></span>
            <span className="path14"></span>
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
            <span className="path1" />
            <span className="path2" />
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
            <span className="path6"></span>
            <span className="path7"></span>
            <span className="path8"></span>
            <span className="path9"></span>
            <span className="path10"></span>
            <span className="path11"></span>
            <span className="path12"></span>
            <span className="path13"></span>
            <span className="path14"></span>
            <span className="path15"></span>
            <span className="path16"></span>
            <span className="path17"></span>
            <span className="path18"></span>
            <span className="path19"></span>
            <span className="path20"></span>
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
              <div className="btn-group mr-2">
                <a
                  href={`${resultUrl.pdf}`}
                  className={`btn btn-success ${
                    resultUrl.loadingPdf ? "disabled" : ""
                  }`}
                >
                  Download Result <i className="icon-file-pdf-o ml-2"></i>
                </a>
                <button
                  onClick={async () => {
                    setResultUrl((i) => ({ ...i, refreshingPdf: true }));
                    try {
                      const pdf = `http://localhost:8000/api/static/${await getResults(
                        exam._id,
                        "?refresh=1"
                      )}`;
                      setResultUrl((i) => ({ ...i, pdf }));
                    } catch (error) {
                      toast.error(error.message, { position: "top-center" });
                    }
                    setResultUrl((i) => ({ ...i, refreshingPdf: false }));
                  }}
                  title="refresh pdf"
                  className="btn btn-success"
                  disabled={resultUrl.refreshingPdf}
                >
                  <span
                    className={`glyphicon ${
                      resultUrl.refreshingPdf ? "spin" : ""
                    }`}
                  >
                    &#128472;
                  </span>
                </button>
              </div>
              <div className="btn-group">
                <a
                  href={`${resultUrl.xlsx}`}
                  className={`btn btn-success ${
                    resultUrl.loadingXlsx ? "disabled" : ""
                  }`}
                >
                  Download Result <i className="icon-file_download ml-1"></i>
                </a>
                <button
                  onClick={async () => {
                    setResultUrl((i) => ({ ...i, refreshingXlsx: true }));
                    try {
                      const xlsx = `http://localhost:8000/api/static/${await getResults(
                        exam._id,
                        "?xlsx=1&&refresh=1"
                      )}`;
                      setResultUrl((i) => ({ ...i, xlsx }));
                    } catch (error) {
                      toast.error(error.message, { position: "top-center" });
                    }
                    setResultUrl((i) => ({ ...i, refreshingXlsx: false }));
                  }}
                  title="refresh spreadsheet"
                  className={`btn btn-success`}
                  disabled={resultUrl.refreshingXlsx}
                >
                  <span
                    className={`glyphicon ${
                      resultUrl.refreshingXlsx ? "spin" : ""
                    }`}
                  >
                    &#128472;
                  </span>
                </button>
              </div>
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
            {exam.status < 2 ? (
              <button
                className="btn btn-primary"
                onClick={onClickShowAddStudentModal}
              >
                Add Student
              </button>
            ) : null}

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
                placeholder="&#xe947; Search Student"
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

              {administrator.isRootAdmin ? (
                exam.status === 2 ? (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => onClickShowAddMassScoreModal()}
                  >
                    Add Mass Score
                  </button>
                ) : null
              ) : null}
              {exam.status < 2 ? (
                <button
                  className="mr-3 btn btn-primary"
                  disabled={exam.status !== 0}
                  onClick={() => handleAssessmentStatus()}
                >
                  Start Assesment
                </button>
              ) : null}

              {exam.status < 2 ? (
                <button
                  className="btn btn-danger"
                  disabled={exam.status === 0 || exam.status === 2}
                  onClick={onClickConfirmCloseAssessment}
                >
                  Close Assessment
                </button>
              ) : null}
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
          handleScoreModal={handleScoreModal}
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
          ? ((props.count[id] && props.count[id].count) || 0) === 0
            ? "No data to show"
            : "that's all"
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
    administrator: state.administrator,
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
