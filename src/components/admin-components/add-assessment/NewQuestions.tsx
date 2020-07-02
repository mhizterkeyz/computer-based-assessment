import React, { useState } from "react";
import { uploadImage, getQuestions } from "../../../api/AdministratorCalls";
import { toast } from "react-toastify";
import { toBase64 } from "./Functionality";

const Questions = (props: any) => {
  const { inputs, setInputs } = props;
  const [questionNo, setQuestionNo] = useState(0);

  //  Input handlers
  //  Regular inputs
  const handleRegularInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInputs({
      ...inputs,
      questions: {
        ...inputs.questions,
        [questionNo]: {
          ...inputs.questions[questionNo],
          [name]: value,
        },
      },
    });
  };
  //  Options
  const handleOptions = (ev: any) =>
    setInputs({
      ...inputs,
      questions: {
        ...inputs.questions,
        [questionNo]: {
          ...inputs.questions[questionNo],
          options: {
            ...inputs.questions[questionNo].options,
            [ev.target.name]: ev.target.value,
          },
        },
      },
    });
  //  Question For
  const handleQuestionFor = (ev: any) => {
    ev.persist();
    if (ev.target.value.indexOf(",") !== -1) {
      let { value } = ev.target;
      setInputs({
        ...inputs,
        questions: {
          ...inputs.questions,
          [questionNo]: {
            ...inputs.questions[questionNo],
            questionFor: [
              ...inputs.questions[questionNo].questionFor,
              { faculty: value.replace(",", "").trim() },
            ],
          },
        },
      });
      ev.target.value = "";
    }
  };
  const removeQuestionFor = (ind: number) => {
    const questionFor = inputs.questions[questionNo].questionFor;
    questionFor.splice(ind, 1);
    setInputs({
      ...inputs,
      questions: {
        ...inputs.questions,
        [questionNo]: {
          ...inputs.questions[questionNo],
          questionFor,
        },
      },
    });
  };
  // Add row
  const addRow = (arr?: any) => {
    if (!Array.isArray(arr)) {
      setInputs({
        ...inputs,
        questions: {
          ...inputs.questions,
          [Object.values(inputs.questions).length]: {
            images: [""],
            question: "",
            questionFor: [],
            type: true,
            marks: 0,
            correct: "a",
            options: {
              a: "",
              b: "",
              c: "",
              d: "",
            },
          },
        },
      });
      setQuestionNo(Object.values(inputs.questions).length);
      return;
    }
    let final = inputs;
    arr.forEach((elem: any) => {
      elem.images = [];
      if (
        !elem.hasOwnProperty("question") ||
        !elem.hasOwnProperty("type") ||
        !elem.hasOwnProperty("marks") ||
        !elem.hasOwnProperty("correct") ||
        !elem.hasOwnProperty("options")
      ) {
        return;
      }
      if (!Array.isArray(elem.questionFor)) {
        elem.questionFor = [];
      } else {
        const check = elem.questionFor.reduce((acc: any, cur: any) => {
          if (typeof cur !== "object") return false;
          if (!cur.hasOwnProperty("faculty") || typeof cur.faculty !== "string")
            return false;
          return acc;
        }, true);
        if (!check) {
          return;
        }
      }
      if (
        typeof elem.options !== "object" ||
        !elem.options.hasOwnProperty("a") ||
        !elem.options.hasOwnProperty("b") ||
        !elem.options.hasOwnProperty("c") ||
        !elem.options.hasOwnProperty("d")
      ) {
        return;
      }
      final = {
        ...final,
        questions: {
          ...final.questions,
          [Object.values(final.questions).length]: elem,
        },
      };
    });
    setInputs(final);
  };
  //  Remove row
  const removeRow = () => {
    let newI = 0;
    const a = Object.values(inputs.questions).reduce(
      (acc: any, cur: any, i: number) => {
        if (questionNo === i) return acc;
        return { ...acc, [newI++]: cur };
      },
      {}
    );
    let next = questionNo - 1;
    if (next < 0) next = 0;
    setInputs({ ...inputs, questions: a });
    setQuestionNo(next);
  };
  //  Image upload
  const handleImageUpload = async (ev: any) => {
    ev.persist();
    const { files } = ev.target;
    try {
      const file = await toBase64(files[0]);
      const img = await uploadImage(file);
      setInputs({
        ...inputs,
        questions: {
          ...inputs.questions,
          [questionNo]: {
            ...inputs.questions[questionNo],
            images: [...inputs.questions[questionNo].images, img],
          },
        },
      });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
    ev.target.value = "";
  };
  //  remove image
  const removeImage = (ind: number) => {
    const images = inputs.questions[questionNo].images;
    images.splice(ind, 1);
    setInputs({
      ...inputs,
      questions: {
        ...inputs.questions,
        [questionNo]: {
          ...inputs.questions[questionNo],
          images,
        },
      },
    });
  };
  // Spreadsheet
  const handleFileUpload = async (ev: any) => {
    const { files } = ev.target;
    try {
      const file = await toBase64(files[0]);
      const img = await getQuestions(file);
      addRow(img);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <fieldset className="new-assessment__fieldset">
      <legend className="new-assessment__legend">Questions Data</legend>

      <div className="d-flex flex-column mb-5">
        <label style={{ lineHeight: "1" }}>
          Upload Questions: <br />
          <span className="new-assessment__label-hint">
            upload bulk data using excel spreadsheet (.xlsx)
          </span>
        </label>
        <input type="file" onChange={handleFileUpload} name="studentData" />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <label style={{ lineHeight: "1" }}>
          Upload Questions: <br />
          <span className="new-assessment__label-hint">
            upload single data individually
          </span>
        </label>

        <span
          onClick={addRow}
          className="btn btn-primary new-assessment__nav-ques"
        >
          Add new
        </span>

        <div>
          <span
            className="btn btn-primary new-assessment__nav-ques"
            onClick={(ev) => {
              const prev = questionNo - 1 < 0 ? 0 : questionNo - 1;
              setQuestionNo(prev);
            }}
          >
            prev
          </span>
          <span className="ml-2 mr-2">
            {Object.keys(inputs.questions).length ? questionNo + 1 : 0} of{" "}
            {Object.keys(inputs.questions).length}
          </span>
          <span
            onClick={(ev) => {
              const next =
                questionNo + 1 >= Object.keys(inputs.questions).length
                  ? Object.keys(inputs.questions).length - 1
                  : questionNo + 1;
              setQuestionNo(next);
            }}
            className="btn btn-primary new-assessment__nav-ques"
          >
            next
          </span>
        </div>
      </div>
      {(inputs.questions[questionNo] && (
        <fieldset className="new-assessment__fieldset">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Question {questionNo + 1}</h4>

            <div className="d-flex flex-column mb-3 align-items-center new-assessment__course-input--mark">
              <label>Assign Mark</label>
              <input
                type="number"
                name="marks"
                value={inputs.questions[questionNo].marks}
                onChange={(ev: any) => {
                  ev.persist();
                  if (
                    parseInt(ev.target.value) < 0 ||
                    isNaN(parseInt(ev.target.value))
                  )
                    ev.target.value = 0;
                  if (parseInt(ev.target.value) > 70) ev.target.value = 70;
                  handleRegularInputs(ev);
                }}
                className="new-assessment__course-input mb-0"
              />
            </div>

            <span onClick={removeRow} className="btn btn-outline-danger">
              Delete
            </span>
          </div>
          <div className="d-flex flex-column">
            <div>
              {inputs.questions[questionNo].questionFor.length < 1
                ? "For every body"
                : inputs.questions[questionNo].questionFor.map(
                    (elem: any, i: any) => {
                      return (
                        <p
                          className="btn btn-outline-primary mr-1"
                          key={`questionFor_${i}`}
                        >
                          {elem.faculty}
                          <span
                            className="badge badge-danger ml-1"
                            onClick={() => removeQuestionFor(i)}
                          >
                            &times;
                          </span>
                        </p>
                      );
                    }
                  )}
            </div>
            <label>
              Indicate Faculty specific to the questions{" "}
              <span className="ml-2 new-assessment__label-hint">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              onChange={handleQuestionFor}
              name="faculty"
              className="new-assessment__course-input"
            />
          </div>

          <div>
            <textarea
              name="question"
              onChange={handleRegularInputs}
              value={inputs.questions[questionNo].question}
              className="new-assessment__course-input"
              placeholder="Exam question"
            ></textarea>
          </div>
          {Object.keys(inputs.questions[questionNo].options).map(
            (elem: any, i: number) => {
              return (
                <div key={`options_question_${i}`}>
                  <label className="d-flex align-items-center mb-3">
                    {elem.toUpperCase()}.
                    <input
                      checked={inputs.questions[questionNo].correct === elem}
                      onChange={() =>
                        handleRegularInputs({
                          target: { value: elem, name: "correct" },
                        })
                      }
                      type="radio"
                      name="correct"
                      className="ml-3"
                    />
                    <input
                      type="text"
                      onChange={handleOptions}
                      value={inputs.questions[questionNo].options[elem]}
                      name={elem}
                      className="ml-3 new-assessment__course-input mb-0"
                    />
                  </label>
                </div>
              );
            }
          )}
          <div className="d-flex flex-column mb-5 mt-5">
            <label style={{ lineHeight: "1" }}>
              Upload Diagram:
              <span className="ml-2 new-assessment__label-hint">
                (Optional)
              </span>
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              name="studentData"
            />
            <div className="row col-12 my-3">
              {inputs.questions[questionNo].images.map(
                (elem: string, i: number) => {
                  if (!elem) return "";
                  return (
                    <div
                      className="col-3 my-1 question-image"
                      key={`question_image_${i}`}
                    >
                      <img
                        src={`http://${window.location.hostname}:8000/api/static/${elem}`}
                        style={{ width: "100%" }}
                        alt=""
                      />
                      <span
                        onClick={() => removeImage(i)}
                        className="btn btn-outline-danger"
                      >
                        Remove
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </fieldset>
      )) ||
        ""}
    </fieldset>
  );
};

export default Questions;
