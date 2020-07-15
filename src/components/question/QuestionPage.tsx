import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import "./QuestionPage.scss";
import display_img from "../../image/Rectangle-19.png";
import timer_icon from "../../svg/access_alarms_24px_outlined.svg";
import Modal from "../Modal";
import { loadStudentExamination } from "../../redux/actions/examAction";
import { answerExam, submitExam } from "../../api/studentApi";
import { connect } from "react-redux";
import Preloader from "../Preloader";
import StudentCred from "./StudentCred";
import { toast } from "react-toastify";

interface ConfirmSubmitProps {
  handleModalClose: () => void;
}

const ConfirmSubmit = ({ handleModalClose }: ConfirmSubmitProps) => {
  const history = useHistory();
  return (
    <div className="text-center confirm-modal">
      <h2>Do you want to submit?</h2>
      <p>
        Submitting will automatically end your Examination <br />
        Continue by clicking on Submit if you're done.
      </p>

      <div className="">
        <button className="btn" onClick={handleModalClose}>
          Don't Submit
        </button>

        <button
          className="btn ml-2"
          onClick={async () => {
            try {
              await submitExam();
            } catch (error) {
              /**
               * Failed to submit exam, but do nothing
               * as it will be submitted automatically
               * in a minutes after your time expires.
               */
            }
            history.push("/exam/submit");
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const QuestionPage = (props: any) => {
  const [counter, setCounter] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });
  const [examSet, setExamSet] = useState(false);
  const [exam, setExam] = useState({
    questions: {
      "question-1": {
        question_no: "question-1",
        questionId: "jsam",
        _id: "question-1",
        type: true, //true: multichoice, false: freeanswer
        question: "",
        options: {
          a: "",
          b: "",
          c: "",
          d: "",
        },
      },
    },
    answered: {},
  });
  const [live, setLive] = useState(true);
  const [timerInterval, setTimerInterval] = useState(1000);
  const { studentExamination, loadStudentExamination } = props;

  useEffect(() => {
    (async () => {
      try {
        await loadStudentExamination(true);
      } catch (error) {
        // Live updates failed, do nothing
      }
    })();
    const inte = setInterval(() => setLive(!live), 5000);
    return () => clearInterval(inte);
  }, [live, loadStudentExamination]);
  useEffect(() => {
    if (Object.keys(studentExamination).length < 1) {
      (async () => {
        try {
          await loadStudentExamination();
        } catch (error) {
          // toast.error(`Error: ${error.message}`, { position: "top-center" });
          console.log(error.message);
        }
      })();
    }
    if (Object.keys(studentExamination).length > 1 && !examSet) {
      const questions = studentExamination.questions.reduce(
        (acc: any, cur: any, i: any) => ({
          ...acc,
          [`question-${i + 1}`]: { ...cur, question_no: `question-${i + 1}` },
        }),
        {}
      );
      const answered = studentExamination.answered.reduce(
        (acc: any, cur: any) => ({
          ...acc,
          [cur.questionId]: {
            ...cur,
            value: cur.answer,
            _id: cur.questionId,
          },
        }),
        {}
      );
      setExam({ questions, answered });
      setExamSet(true);
    }
    if (Object.keys(studentExamination).length > 1) {
      //  Quick check to make sure you're supposed to be here...
      (async () => {
        try {
          const req = await answerExam(exam.answered);
          if (req.status === 200) {
            return;
          }
          if (req.status === 404) {
            delete localStorage["jwt"];
            delete localStorage["route"];
            return window.location.reload();
          }
        } catch (error) {
          toast.error("Error: " + error.message, { position: "top-center" });
        }
      })();

      let p = studentExamination.timeLeft / studentExamination.timeAllowed;
      let dp = (p * studentExamination.displayTime - 1).toFixed(2);
      let [min = 0, sec = 0] = dp.split(".");
      let minutes = parseInt(min + "");
      let seconds = Math.floor((parseInt(sec + "") / 99) * 60);
      setTimerInterval(
        (1000 * studentExamination.timeAllowed) / studentExamination.displayTime
      );
      setCounter((i) => ({
        ...i,
        minutes,
        seconds,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentExamination, loadStudentExamination, examSet]);

  if (studentExamination.hasOwnProperty("examNotFound")) {
    props.history.push("/exam/submit");
  }

  const { minutes, seconds } = counter;

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setCounter({
          ...counter,
          minutes: minutes,
          seconds: seconds - 1,
        });
      }

      if (seconds <= 0) {
        if (minutes <= 0) {
          props.history.push("/exam/submit");
          clearInterval(myInterval);
        } else {
          setCounter({
            ...counter,
            minutes: minutes - 1,
            seconds: 59,
          });
        }
      }
    }, timerInterval);

    return () => clearInterval(myInterval);
  }, [minutes, seconds, counter, props.history, timerInterval]);

  const { question, prev, next }: any = Object.values(exam.questions).reduce(
    (acc, cur, ind, arr) => {
      const prev =
        ind - 1 < 0
          ? arr[arr.length - 1].question_no || "/exam"
          : arr[ind - 1].question_no || "/exam";
      const next =
        ind + 1 >= arr.length
          ? arr[0].question_no || "/exam"
          : arr[ind + 1].question_no || "/exam";
      if (cur.question_no === props.match.params.question)
        return { question: cur, prev, next };
      return acc;
    },
    { question: exam.questions["question-1"], prev: "", next: "question-2" }
  );

  const handleModalClose = () => setModalData({ ...modalData, show: false });

  const handleChoose = async (ev: any) => {
    const { value } = ev.target;
    let answered = {
      ...exam.answered,
      [question.questionId]: {
        value,
        _id: question._id,
        answer: value,
        questionId: question.questionId,
      },
    };
    setExam({ ...exam, answered });
    try {
      const req = await answerExam(answered);
      if (req.status === 200) {
        return;
      }
      if (req.status === 404) {
        return props.history.push("/exam/submit");
      }
      throw new Error("an unexpected error has occurred");
    } catch (error) {
      toast.error(`Error: ${error.message}`, { position: "top-center" });
    }
  };

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <>
      <Modal show={modalData.show} handleClose={handleModalClose}>
        {modalData.display}
      </Modal>
      <main>
        <StudentCred
          {...{
            Preloader,
            minutes,
            display_img,
            loading: props.loading,
            timer_icon,
            seconds,
          }}
          {...props.student}
        />

        <section className="col-8 question">
          {props.loading ? (
            <h3>Loading Questions...</h3>
          ) : (
            // <h3>
            //   Course - <span>Nigeria People and culture (GST 103)</span>
            // </h3>
            <h2 className="text-center mb-2">
              <span style={{ textTransform: "uppercase" }}>GST 103</span> -{" "}
              <span style={{ textTransform: "capitalize" }}>
                Nigeria People and culture
              </span>
            </h2>
          )}

          <div className="question-body">
            {props.loading ? (
              <Preloader />
            ) : (
              <>
                <h4 className="text-center mb-4">
                  {" "}
                  {question.question_no &&
                    question.question_no.toUpperCase().replace("-", " ")}
                </h4>
                <div className="d-flex justify-content-center">
                  {question.images &&
                    question.images.map((elem: string, i: number) => {
                      if (elem && elem.includes(".png"))
                        return (
                          <img
                            src={
                              `http://${window.location.hostname}:8000/api/static/` +
                              elem
                            }
                            alt="Question's figure"
                            key={"image_" + i}
                            style={{ maxWidth: "100%" }}
                          />
                        );
                      return "";
                    })}
                </div>
                <p>
                  {capitalizeFirstLetter(question.question) &&
                    capitalizeFirstLetter(question.question)}
                </p>

                <form className="d-flex flex-column">
                  {question.options &&
                    Object.keys(question.options).map((opt) => {
                      const val: any = Object.values(exam.answered).find(
                        (elem: any) => elem.questionId === question.questionId
                      );
                      return (
                        <div key={`${question._id}_opt_${opt}`}>
                          <label style={{ textTransform: "capitalize" }}>
                            {opt.toUpperCase()}.
                            <input
                              type="radio"
                              checked={val && val.value === opt}
                              name="answer"
                              defaultValue={opt}
                              className="ml-3 mr-2"
                              onChange={handleChoose}
                            />
                            {question.options[opt]}
                          </label>
                        </div>
                      );
                    })}
                </form>

                <div className="d-flex justify-content-between ctrl-btn">
                  <div className="">
                    <Link className="btn mr-4 prev" to={`/exam/${prev}`}>
                      Previous
                    </Link>
                    <Link className="btn" to={`/exam/${next}`}>
                      Next
                    </Link>
                  </div>

                  <div className="text-right">
                    <button
                      className="btn"
                      onClick={() => {
                        setModalData({
                          show: true,
                          display: (
                            <ConfirmSubmit
                              handleModalClose={handleModalClose}
                            />
                          ),
                        });
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {props.loading ? (
            <></>
          ) : (
            <div className="mt-3 mb-5 question-btn">
              {Object.values(exam.questions).map((elem, key) => (
                <Link
                  className={`btn ${
                    exam.answered.hasOwnProperty(elem.questionId)
                      ? "answered"
                      : ""
                  } ${elem.questionId === question.questionId ? "focus" : ""}`}
                  to={`/exam/${elem.question_no}`}
                  key={key}
                >
                  <span>{key + 1}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    studentExamination: state.studentExamination,
    student: state.student,
    loading: state.apiCallsInProgress > 0,
  };
}

const mapDispatchToProps = {
  loadStudentExamination,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage);
