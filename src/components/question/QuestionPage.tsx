import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import "./QuestionPage.scss";
import display_img from "../../image/Rectangle-19.png";
import timer_icon from "../../svg/access_alarms_24px_outlined.svg";
import Modal from "../Modal";
import { loadStudentExamination } from "../../redux/actions/examAction";
import { connect } from "react-redux";
import Preloader from "../Preloader";

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
          onClick={() => {
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
  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });

  useEffect(() => {
    if (Object.keys(props.studentExamination).length < 1) {
      (async () => {
        try {
          await props.loadStudentExamination();
        } catch (error) {
          console.log(error);
        }
      })();
    }

    if (Object.keys(props.studentExamination).length >= 1) {
      setCounter({ ...counter, minutes: props.studentExamination.timeLeft });
    }
  }, [props.studentExamination]);

  const [exam, setExam] = useState({
    questions: {
      "question-1": {
        question_no: "question-1",
        _id: "question-1",
        type: true, //true: multichoice, false: freeanswer
        question:
          "Since mongo park discovered the confluence, who discovered mongo park?",
        options: {
          a: "David Mark",
          b: "Johna Lukas",
          c: "Stephen Hawkins",
          d: "James Stew",
        },
      },
      "question-2": {
        question_no: "question-2",
        _id: "question-2",
        type: true, //true: multichoice, false: freeanswer
        question: "The rain will soon fall, ______________ ?",
        options: {
          a: "won't it",
          b: "isn't it",
          c: "willn't it",
          d: "NOTA",
        },
      },
      "question-3": {
        question_no: "question-3",
        _id: "question-3",
        type: true, //true: multichoice, false: freeanswer
        question: "If you talk to a lady in Wuhan, have you wooed her?",
        options: {
          a: "Yes",
          b: "No",
          c: "NOTA",
          d: "IDK",
        },
      },
    },
    answered: {},
  });

  const [counter, setCounter] = useState({
    minutes: 0,
    seconds: 0,
  });

  const { minutes, seconds } = counter;

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setCounter({
          minutes: minutes,
          seconds: seconds - 1,
        });
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setCounter({
            minutes: minutes - 1,
            seconds: 59,
          });
        }
      }
    }, 1000);

    return () => clearInterval(myInterval);
  }, [minutes, seconds]);

  const { question, prev, next }: any = Object.values(exam.questions).reduce(
    (acc, cur, ind, arr) => {
      const prev =
        ind - 1 < 0
          ? arr[arr.length - 1].question_no || "/exam"
          : arr[ind - 1]._id || "/exam";
      const next =
        ind + 1 >= arr.length
          ? arr[0]._id || "/exam"
          : arr[ind + 1].question_no || "/exam";
      if (cur.question_no === props.match.params.question)
        return { question: cur, prev, next };
      return acc;
    },
    { question: exam.questions["question-1"], prev: "", next: "question-2" }
  );

  const handleModalClose = () => setModalData({ ...modalData, show: false });

  const handleChoose = (ev: any) => {
    const { value } = ev.target;
    setExam({
      ...exam,
      answered: {
        ...exam.answered,
        [question._id]: { value, _id: question._id },
      },
    });
  };

  return (
    <>
      <Modal show={modalData.show} handleClose={handleModalClose}>
        {modalData.display}
      </Modal>
      <main>
        <section className="col-2 mr-3 student-credentials">
          {props.loading ? (
            <Preloader />
          ) : (
            <>
              <div className="text-center">
                <span className="image-cropper">
                  <img src={display_img} alt="student" />
                </span>
                <h2>Alikali Ojonugwa Justice</h2>
              </div>

              <hr />

              <div className="details">
                <div>
                  <h3>Matric. no:</h3>
                  <h4>13MS1023</h4>
                </div>

                <div>
                  <h3>Department</h3>
                  <h4>Computer Science</h4>
                </div>
                <div>
                  <h3>Faculty</h3>
                  <h4>Natural Science</h4>
                </div>
              </div>

              <div
                className="d-flex justify-content-center align-items-center mt-3"
                style={minutes <= 9 ? { color: "red" } : { color: "" }}
              >
                <img src={timer_icon} alt="timer icon" className="mr-2" />
                <h5>
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </h5>
              </div>
            </>
          )}
        </section>

        <section className="col-8 question">
          {props.loading ? (
            <h3>Loading Questions...</h3>
          ) : (
            <h3>
              Course - <span>Nigeria People and culture (GST 103)</span>
            </h3>
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
                <p>{question.question && question.question}</p>

                <form className="d-flex flex-column">
                  {question.options &&
                    Object.keys(question.options).map((opt) => {
                      const val: any = Object.values(exam.answered).find(
                        (elem: any) => elem._id === question._id
                      );
                      return (
                        <div key={`${question._id}_opt_${opt}`}>
                          <label>
                            {opt.toUpperCase()}.
                            <input
                              type="radio"
                              checked={val && val.value === opt}
                              name="answer"
                              value={opt}
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
              {Object.keys(exam.questions).map((elem, key) => (
                <Link
                  className={`btn ${
                    exam.answered.hasOwnProperty(elem) ? "answered" : ""
                  }`}
                  to={`/exam/${elem}`}
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
    loading: state.apiCallsInProgress > 0,
  };
};

const mapDispatchToProps = {
  loadStudentExamination,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage);
