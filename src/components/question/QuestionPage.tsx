import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import "./QuestionPage.scss";
import display_img from "../../image/Rectangle-19.png";
import timer_icon from "../../svg/access_alarms_24px_outlined.svg";
import Modal from "../Modal";
import { answerExam, submitExam, getExams } from "../../api/studentApi";
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
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState({
    minutes: 0,
    seconds: 0,
    interval: 1000,
  });
  const [exam, setExam] = useState({
    done: false,
    title: "",
    course: "",
    timeLeft: 0,
    displayTime: 0,
    timeAllowed: 0,
    examNotFound: false,
    examLoaded: false,
    questions: {},
    answered: {},
  });
  const [data, setData] = useState({
    question: {},
    prev: "",
    next: "",
  });
  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });

  useEffect(() => {
    if (exam.done) {
      props.history.push("/exam/submit");
      return () => {};
    }
  }, [exam.done, props.history]);
  useEffect(() => {
    if (exam.examNotFound) {
      delete localStorage["route"];
      props.history.push("/");
      return () => {};
    }
    if (!exam.examLoaded) {
      (async () => {
        setLoading(true);
        try {
          const examination = await getExams();
          if (examination.examNotFound)
            return setExam((i) => ({ ...i, examNotFound: true }));
          const questions = examination.questions.reduce(
            (acc: any, cur: any, i: number) => ({
              ...acc,
              [`question-${i + 1}`]: {
                ...cur,
                questionId: cur._id,
                question_no: `question-${i + 1}`,
              },
            }),
            {}
          );
          const answered = examination.answered.reduce(
            (acc: any, cur: any) => ({ ...acc, [cur.questionId]: cur }),
            {}
          );
          delete examination.questions;
          delete examination.answered;
          setExam((i) => ({
            ...i,
            questions,
            answered,
            examLoaded: true,
            ...examination,
          }));
        } catch (error) {
          toast.error("Error: " + error.message, { position: "top-center" });
        }
        setLoading(false);
      })();
    }
  }, [exam.examLoaded, exam.examNotFound, props.history]);
  useEffect(() => {
    if (exam.examLoaded) {
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
      const { timeAllowed, displayTime, timeLeft } = exam;

      let p = timeLeft / timeAllowed;
      let dp = (p * displayTime - 1).toFixed(2);
      let [min = 0, sec = 0] = dp.split(".");
      let minutes = parseInt(min + "");
      let seconds = Math.floor((parseInt(sec + "") / 99) * 60);
      setCounter((i) => ({
        ...i,
        minutes,
        seconds,
        interval: (1000 * timeAllowed) / displayTime,
      }));
    }
  }, [exam]);
  useEffect(() => {
    if (!exam.examLoaded) return () => {};
    const { seconds, minutes, interval } = counter;
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
          setExam((i) => ({ ...i, done: true }));
          clearInterval(myInterval);
        } else {
          setCounter({
            ...counter,
            minutes: minutes - 1,
            seconds: 59,
          });
        }
      }
    }, interval);

    return () => clearInterval(myInterval);
  }, [counter, props.history, exam.examLoaded]);
  useEffect(() => {
    const { questions } = exam;
    const question =
      //  @ts-ignore
      questions[props.match.params.question] || questions["question-1"];
    const ind = props.match.params.question
      ? parseInt(props.match.params.question.split("-")[1]) || 1
      : 1;
    const prev = ind - 1 < 1 ? `question-1` : `question-${ind - 1}`;
    const next =
      ind + 1 > Object.keys(questions).length
        ? `question-${Object.keys(questions).length}`
        : `question-${ind + 1}`;
    setData({ question, prev, next });
  }, [exam, props.match.params.question]);

  const handleModalClose = () => setModalData({ ...modalData, show: false });
  const handleChoose = async (ev: any) => {
    const { value } = ev.target;
    const answered = {
      ...exam.answered,
      // @ts-ignore
      [question.questionId]: {
        answer: value,
        // @ts-ignore
        questionId: question.questionId,
      },
    };
    setExam({
      ...exam,
      answered,
    });
    try {
      const req = await answerExam(answered);
      if (req.status === 200) {
        return setExam((i) => ({ ...i, timeLeft: req.data.timeLeft }));
      }
      if (req.status === 404) {
        return setExam((i) => ({ ...i, done: true }));
      }
      throw new Error("an unexpected error has occurred");
    } catch (error) {
      toast.error(`Error: ${error.message}`, { position: "top-center" });
    }
  };
  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const { question, prev, next } = data;
  const { minutes, seconds } = counter;
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
            loading,
            timer_icon,
            seconds,
          }}
          {...props.student}
        />
        <section className="col-8 question">
          {loading ? (
            <h3>Loading Questions...</h3>
          ) : (
            <h2 className="text-center mb-2">
              <span style={{ textTransform: "uppercase" }}>{exam.course}</span>{" "}
              -{" "}
              <span style={{ textTransform: "capitalize" }}>{exam.title}</span>
            </h2>
          )}
          <div className="question-body">
            {loading ? (
              <Preloader />
            ) : (
              <>
                <h4 className="text-center mb-4">
                  {" "}
                  {question &&
                    //  @ts-ignore
                    question.question_no &&
                    //  @ts-ignore
                    question.question_no.toUpperCase().replace("-", " ")}
                </h4>
                <div className="d-flex justify-content-center">
                  {
                    //  @ts-ignore
                    question.images &&
                      //  @ts-ignore
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
                      })
                  }
                </div>
                <p>
                  {capitalizeFirstLetter(
                    //  @ts-ignore
                    question.question || ""
                  ) &&
                    capitalizeFirstLetter(
                      //  @ts-ignore
                      question.question || ""
                    )}
                </p>

                <form className="d-flex flex-column">
                  {
                    //  @ts-ignore
                    question.options &&
                      Object.keys(
                        //  @ts-ignore
                        question.options
                      ).map((opt) => {
                        return (
                          <div
                            key={`${
                              //  @ts-ignore
                              question._id
                            }_opt_${opt}`}
                          >
                            <label style={{ textTransform: "capitalize" }}>
                              {opt.toUpperCase()}.
                              <input
                                type="radio"
                                checked={
                                  //  @ts-ignore
                                  ((exam.answered[question.questionId] &&
                                    //  @ts-ignore
                                    exam.answered[question.questionId]
                                      .answer) ||
                                    "") === opt
                                }
                                name="answer"
                                defaultValue={opt}
                                className="ml-3 mr-2"
                                onChange={handleChoose}
                              />
                              {
                                //  @ts-ignore
                                question.options[opt]
                              }
                            </label>
                          </div>
                        );
                      })
                  }
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
          {loading ? (
            <></>
          ) : (
            <div className="mt-3 mb-5 question-btn">
              {Object.values(exam.questions).map((elem, key) => (
                <Link
                  className={`btn ${
                    //  @ts-ignore
                    exam.answered.hasOwnProperty(elem.questionId)
                      ? "answered"
                      : ""
                  } ${
                    //  @ts-ignore
                    elem.questionId === question.questionId ? "focus" : ""
                  }`}
                  to={`/exam/${
                    //  @ts-ignore
                    elem.question_no
                  }`}
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

const mapStateToProps = (state: any, ownProps: any) => ({
  ...ownProps,
  student: state.student,
});

export default connect(mapStateToProps)(QuestionPage);
