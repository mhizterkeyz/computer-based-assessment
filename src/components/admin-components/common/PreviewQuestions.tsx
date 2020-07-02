import React, { useState } from "react";

interface ConfirmSubmitProps {
  handleModalClose: () => void;
}

const PreviewQuestions = ({ setPreview, examQuestions, ...props }: any) => {
  const [questionNo, setQuestionNo] = useState("question-1");

  examQuestions = examQuestions.reduce(
    (acc: any, cur: any, i: any) => ({
      ...acc,
      [`question-${i + 1}`]: { ...cur, question_no: `question-${i + 1}` },
    }),
    {}
  );
  const { question, prev, next }: any = Object.values(examQuestions).reduce(
    (acc: any, cur: any, ind: any, arr: any) => {
      const prev =
        ind - 1 < 0 ? arr[0].question_no || "" : arr[ind - 1].question_no || "";
      const next =
        ind + 1 >= arr.length
          ? arr[arr.length - 1].question_no || ""
          : arr[ind + 1].question_no || "";
      if (cur.question_no === questionNo) return { question: cur, prev, next };
      return acc;
    },
    {
      question: examQuestions["question-1"],
      prev: "",
      next: "question-2",
    }
  );
  return (
    <>
      <main>
        <section className="question preview">
          <div className="question-body">
            <h4
              className="text-center mb-4"
              style={{ textTransform: "capitalize" }}
            >
              {(question &&
                question.question_no &&
                question.question_no.replace("-", " ")) ||
                ""}
            </h4>
            <p>{(question && question.question) || ""}</p>

            <form className="d-flex flex-column">
              {question &&
                question.options &&
                Object.keys(question.options).map((opt) => {
                  return (
                    <div key={`${question._id}_opt_${opt}`}>
                      <label>
                        {opt.toUpperCase()}.
                        <input
                          type="radio"
                          checked={question.correct && question.correct === opt}
                          name="answer"
                          value={opt}
                          className="ml-3 mr-2"
                          readOnly={true}
                        />
                        {question.options[opt]}
                      </label>
                    </div>
                  );
                })}
            </form>

            <div className="d-flex justify-content-between ctrl-btn">
              <div className="">
                <span
                  className="btn mr-4 prev btn-primary"
                  onClick={() => setQuestionNo(prev)}
                >
                  Previous
                </span>
                <span
                  className="btn next btn-primary"
                  onClick={() => setQuestionNo(next)}
                >
                  Next
                </span>
              </div>
              <div className="text-right">
                <button className="btn" onClick={() => setPreview(false)}>
                  Back to Assessment view
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 mb-5 question-btn">
            {Object.values(examQuestions).map((elem: any, key) => {
              return (
                <span
                  className={`btn answered ${
                    elem.question_no === question.question_no ? "focus" : ""
                  }`}
                  onClick={() => setQuestionNo(elem.question_no)}
                  key={key}
                >
                  <span>{key + 1}</span>
                </span>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
};

export default PreviewQuestions;
