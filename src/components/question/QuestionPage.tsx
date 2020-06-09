import React, { useState, useEffect } from "react";
import "./QuestionPage.scss";
import display_img from "../../image/Rectangle-19.png";
import { useHistory, Link } from "react-router-dom";
import Modal from "../Modal";

const credentialsObj: CredentialsProps = {
  displayImg: display_img,
  name: "Alikali Ojonugwa Justice",
  matric_no: "13MS1023",
  department: "Computer Science",
  faculty: "Natural Science",
};

interface CredentialsProps {
  displayImg: string;
  name: string;
  matric_no: string;
  department: string;
  faculty: string;
}

const Credentials = (props: CredentialsProps) => {
  return (
    <>
      <div className="credetials-pane mr-3">
        <div className="mb-3">
          <img src={props.displayImg} alt="ojay" />
        </div>
        <div className="details">
          <div>
            <h4>Name:</h4>
            <h5>{props.name}</h5>
          </div>

          <div>
            <h4>Matric. no:</h4>
            <h5>{props.matric_no}</h5>
          </div>

          <div>
            <h4>Department:</h4>
            <h5>{props.department}</h5>
          </div>

          <div>
            <h4>Faculty:</h4>
            <h5>{props.faculty}</h5>
          </div>
        </div>
      </div>
    </>
  );
};

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

      <div className="text-right">
        <button className="btn" onClick={handleModalClose}>
          Don't Submit
        </button>

        <button
          className="btn ml-2"
          onClick={() => {
            delete localStorage["jwt"];
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
    minutes: 30,
    seconds: 0,
  });

  //I'm using state here for the Exam, but it'll most likely be passed down with props
  const [exam, setExam] = useState({
    questions: {
      "question-1": {
        question_no: "question-1",
        _id: "question-1",
        questionId: "question-1",
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
        questionId: "question-2",
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
        questionId: "question-3",
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

  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
  });

  const { minutes, seconds } = counter;

  const { question, prev, next }: any = Object.values(exam.questions).reduce(
    (acc, cur: any, ind, arr) => {
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
    { question: exam.questions["question-1"], prev: "", next: "" }
  );

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

  const handleChoose = (ev: any) => {
    const { value } = ev.target;
    setExam({
      ...exam,
      answered: {
        ...exam.answered,
        [question._id]: {
          answer: value,
          question: question._id,
          questionId: question.questionId,
        },
      },
    });
  };

  const handleModalClose = () => setModalData({ ...modalData, show: false });
  return (
    <>
      <Modal show={modalData.show} handleClose={handleModalClose}>
        {modalData.display}
      </Modal>
      <section className="m-auto d-flex question">
        {/* <Credentials {...credentialsObj} /> */}
        <div className="question">
          <div className="d-flex justify-content-between align-items-center">
            <h3>
              Course - <span>NIGERIAN PEOPLE and culture (GST 103)</span>
            </h3>

            {/* <h4>Time Left: <span>45:00</span></h4> */}
            <div className="timer align-items-end">
              <h4>Time Left:</h4>
              <span>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </div>
          </div>

          <div className="d-flex flex-column question-pane">
            <h4 className="text-center mb-4">
              {question.question_no &&
                question.question_no.toUpperCase().replace("-", " ")}
            </h4>
            <p>{question.question && question.question}</p>

            <form className="d-flex flex-column">
              {question.options &&
                Object.keys(question.options).map((opt) => {
                  const val: any = Object.values(exam.answered).find(
                    (elem: any) => elem.question === question._id
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

            <div className="row">
              <div className="col-6">
                <Link className="btn mr-4" to={`/exam/${prev}`}>
                  Previous
                </Link>
                <Link className="btn mr-4" to={`/exam/${next}`}>
                  Next
                </Link>
              </div>

              <div className="col-6 text-right">
                <button
                  className="btn"
                  onClick={() => {
                    setModalData({
                      show: true,
                      display: (
                        <ConfirmSubmit handleModalClose={handleModalClose} />
                      ),
                    });
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 mb-5 question-btn">
            {Object.keys(exam.questions).map((elem, key) => (
              <Link
                className={`btn ${
                  exam.answered.hasOwnProperty(elem) ? "answered" : ""
                }`}
                to={`/exam/${elem}`}
                key={key}
              >
                {key + 1}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default QuestionPage;
