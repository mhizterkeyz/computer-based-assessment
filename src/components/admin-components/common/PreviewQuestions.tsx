import React from "react";
import { Link } from "react-router-dom";

interface ConfirmSubmitProps {
  handleModalClose: () => void;
}

const PreviewQuestions = ({ setPreview, examQuestions, ...props }: any) => {
  examQuestions = Object.keys(examQuestions)
    .sort((a: any, b: any) => {
      const d1: any = new Date(examQuestions[a].createdAt);
      const d2: any = new Date(examQuestions[b].createdAt);
      return d1 - d2;
    })
    .reduce(
      (acc: any, cur: any, i: any) => ({
        ...acc,
        [cur]: { ...examQuestions[cur], question_no: `question-${cur}` },
      }),
      {}
    );
  let page = parseInt(props.page) || 1;
  const question: any = examQuestions[page] || examQuestions[1];
  const prev = page - 1 < 1 ? 1 : page - 1;
  const next = page + 1 > props.questionCount ? props.questionCount : page + 1;

  const paginationArray = (function spawnArr(n = 0, a: any = []): any {
    for (let i = 0; i < n; i++) {
      a.push(i);
    }
    return a;
  })(props.questionCount);
  return (
    <>
      <main>
        <section className="question preview">
          <div className="question-body">
            <div className="d-flex justify-content-between align-items-center">
              <span></span>
              <h4
                className=""
                style={{ textTransform: "capitalize" }}
              >
                {`Question ${page}`}
              </h4>
              {/* <button
                className="btn"
                style={{
                  color: "#007bff",
                  cursor: "pointer"
                }}
              >
                Edit Question
                <i className="icon-edit ml-2"></i>
              </button> */}
            </div>
            <div className="d-flex justify-content-center">
              {question &&
                question.images &&
                question.images.map((elem: string, i: number) => {
                  if (elem && elem.includes(".png"))
                    return (
                      <img
                        src={`http://${window.location.hostname}:8000/api/static/${elem}`}
                        alt="Question's figure"
                        key={"image_" + i}
                        style={{ maxWidth: "100%" }}
                      />
                    );
                  return "";
                })}
            </div>
            <p style={{marginBlockEnd: 30}}>{(question && question.question) || ""}</p>

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
                <Link
                  className="btn mr-4 prev btn-primary"
                  to={`${props.location.pathname}?page=${prev}`}
                >
                  Previous
                </Link>
                <Link
                  className="btn next btn-primary"
                  to={`${props.location.pathname}?page=${next}`}
                >
                  Next
                </Link>
              </div>
              <div className="text-right">
                <Link
                  className="btn"
                  to={props.location.pathname.replace("/questions", "")}
                >
                  Back to Assessment view
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-3 mb-5 question-btn">
            {paginationArray.map((elem: any, key: any) => {
              return (
                <Link
                  className={`btn answered ${page === key + 1 ? "focus" : ""}`}
                  to={`/admin/exams/${props.examId}/questions?page=${key + 1}`}
                  key={key}
                >
                  <span>{key + 1}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
};

export default PreviewQuestions;
