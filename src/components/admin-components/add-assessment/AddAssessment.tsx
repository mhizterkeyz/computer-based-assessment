import React, { useState } from "react";
import "./AddAssessment.scss";
// import Header from "../Header";
import { Switch, Route } from "react-router-dom";
import AddQuestion from "../question/AddQuestion";
import { toBase64 } from "./Functionality";
import { connect } from "react-redux";
import { createExam } from "../../../redux/actions/AdministratorActions";

import * as Fields from "./inputFields";
import BioData from "./BioData";
import Questions from "./Questions";

const AddAssessment = (props: any) => {
  const [inputs, setInputs] = useState({
    timeAllowed: 0,
    title: "",
    course: "",
    questionsPerStudent: 30,
    examType: true,
    bioData: [
      {
        matric: "",
        name: "",
        department: "",
        ca: 0,
      },
    ],
    questions: {
      "0": {
        images: [],
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
    instructions: "",
  });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [durations, setDurations] = useState({
    dur1: 45,
    dur2: 0,
  });

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInputs({ ...inputs, [name]: value });
  };
  const handleBioData = (row: number, name: string, value: string | number) => {
    const newData = { ...inputs.bioData[row], [name]: value };
    const arr = inputs.bioData;
    arr.splice(row, 1);
    setInputs({ ...inputs, bioData: [newData, ...arr] });
  };
  const addRow = (
    arr: [{ matric: string; name: string; department: string; ca: number }]
  ) => {
    if (!Array.isArray(arr)) {
      setInputs({
        ...inputs,
        bioData: [
          { matric: "", name: "", department: "", ca: 0 },
          ...inputs.bioData,
        ],
      });
      return;
    }
    setInputs({
      ...inputs,
      bioData: [...arr, ...inputs.bioData],
    });
  };
  const removeRow = (row: number) => {
    const arr = inputs.bioData;
    arr.splice(row, 1);
    setInputs({ ...inputs, bioData: arr });
  };
  const handleDuration = (ev: any) => {
    const { name, value } = ev.target;
    setDurations({ ...durations, [name]: value });
    const timeAllowed =
      parseInt(durations.dur1.toString()) +
      parseInt(durations.dur2.toString()) / 60;
    setInputs({ ...inputs, timeAllowed });
  };
  const handleSubmit = async (ev: any) => {
    ev.preventDefault();
    try {
      const toSend = { ...inputs, questions: Object.values(inputs.questions) };
      await props.createExam(toSend);
      setInputs({
        timeAllowed: 0,
        title: "",
        course: "",
        questionsPerStudent: 30,
        examType: true,
        bioData: [
          {
            matric: "",
            name: "",
            department: "",
            ca: 0,
          },
        ],
        questions: {
          "0": {
            images: [],
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
        instructions: "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Switch>
        <Route path="/admin/add-assesment/Question" component={AddQuestion} />
        <Route
          render={() => {
            return (
              <section className="add-assessment">
                <h6>Exams</h6>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Course</th>
                      <th>Title</th>
                      <th>status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(props.exams).map((exam: any, index) => {
                      return (
                        <tr key={exam._id}>
                          <td>{index + 1}.</td>
                          <td>{exam.course}</td>
                          <td>{exam.title}</td>
                          <td>{exam.status ? "Pending" : "Done"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <h3>Add Assessment</h3>

                <form onSubmit={handleSubmit}>
                  <fieldset className="form-section">
                    <legend>Time</legend>

                    <div className="row time-fieldset">
                      <Fields.durationField
                        onChange={handleDuration}
                        {...durations}
                      />
                    </div>
                  </fieldset>

                  <fieldset className="form-section course-details">
                    <legend>Exam details</legend>
                    <div className="row ">
                      <Fields.regularInput
                        className="data-col"
                        label="Course title :"
                        htmlFor="title"
                        input={{
                          name: "title",
                          placeholder: "Enter Course title",
                          value: inputs.title,
                          onChange: handleInputs,
                        }}
                      />
                      <Fields.regularInput
                        className="data-col"
                        label="Course code :"
                        htmlFor="course"
                        input={{
                          name: "course",
                          placeholder: "Enter Course code",
                          value: inputs.course,
                          onChange: handleInputs,
                        }}
                      />
                      <Fields.regularInput
                        className="data-col"
                        label="Question per student :"
                        htmlFor="questionsPerStudent"
                        input={{
                          type: "number",
                          name: "questionPerStudent",
                          value: inputs.questionsPerStudent,
                          onChange: handleInputs,
                        }}
                      />

                      <div className="align-items-center col-6 data-col grid-group">
                        <label htmlFor="examType">Exam Type:</label>
                        <select
                          name="examType"
                          onChange={() =>
                            setInputs({ ...inputs, examType: !inputs.examType })
                          }
                          defaultValue="School Exam"
                        >
                          <option>PUTME</option>
                          <option>School Exam</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  {/* TODO Revisit Style */}
                  <BioData
                    bioData={inputs.bioData}
                    addRow={addRow}
                    handleBioData={handleBioData}
                    removeRow={removeRow}
                    toBase64={toBase64}
                  />
                  <Questions
                    nextQuestion={() => {
                      let next = questionIndex + 1;
                      if (next >= Object.keys(inputs.questions).length)
                        next = 0;
                      setQuestionIndex(next);
                    }}
                    previousQuestion={() => {
                      let prev = questionIndex - 1;
                      if (prev < 0)
                        prev = Object.keys(inputs.questions).length - 1;
                      setQuestionIndex(prev);
                    }}
                    question={Object.values(inputs.questions)[questionIndex]}
                    toBase64={toBase64}
                    paginationText={`${questionIndex + 1}/${
                      Object.values(inputs.questions).length
                    }`}
                    handleImages={(img: string) => {
                      setInputs({
                        ...inputs,
                        questions: {
                          ...inputs.questions,
                          [questionIndex]: {
                            ...Object.values(inputs.questions)[questionIndex],
                            images: [
                              ...Object.values(inputs.questions)[questionIndex]
                                .images,
                              img,
                            ],
                          },
                        },
                      });
                    }}
                    handleInputs={(ev: any) => {
                      const { value, name } = ev.target;
                      setInputs({
                        ...inputs,
                        questions: {
                          ...inputs.questions,
                          [questionIndex]: {
                            ...Object.values(inputs.questions)[questionIndex],
                            [name]: value,
                          },
                        },
                      });
                    }}
                    handleOptions={(ev: any) => {
                      setInputs({
                        ...inputs,
                        questions: {
                          ...inputs.questions,
                          [questionIndex]: {
                            ...Object.values(inputs.questions)[questionIndex],
                            options: {
                              ...Object.values(inputs.questions)[questionIndex]
                                .options,
                              [ev.target.name]: ev.target.value,
                            },
                          },
                        },
                      });
                    }}
                    removeRow={() => {
                      let newI = 0;
                      const a = Object.values(inputs.questions).reduce(
                        (acc: any, cur: any, i: number) => {
                          if (questionIndex === i) return acc;
                          return { ...acc, [newI++]: cur };
                        },
                        {}
                      );
                      let next = questionIndex + 1;
                      if (next >= Object.keys(inputs.questions).length)
                        next = 0;
                      setInputs({ ...inputs, questions: a });
                      setQuestionIndex(next);
                    }}
                    addRow={(arr: any) => {
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
                        setQuestionIndex(
                          Object.values(inputs.questions).length
                        );
                        return;
                      }
                      arr.forEach((elem: any) => {
                        elem.images = [""];
                        if (
                          !elem.question ||
                          !elem.type ||
                          !elem.marks ||
                          !elem.correct ||
                          !elem.options
                        ) {
                          return;
                        }
                        if (!Array.isArray(elem.questionFor)) {
                          elem.questionFor = [];
                        } else {
                          const check = elem.questionFor.reduce(
                            (acc: any, cur: any) => {
                              if (typeof cur !== "object") return false;
                              if (
                                !cur.hasOwnProperty("faculty") ||
                                typeof cur.faculty !== "string" ||
                                !cur.hasOwnProperty("department") ||
                                typeof cur.department !== "string"
                              )
                                return false;
                              return acc;
                            },
                            true
                          );
                          if (!check) return;
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
                        setInputs({
                          ...inputs,
                          questions: {
                            ...inputs.questions,
                            [Object.values(inputs.questions).length]: elem,
                          },
                        });
                      });
                    }}
                    handleQuestionFor={(ev: any) => {
                      ev.persist();
                      if (ev.target.value.indexOf(",") !== -1) {
                        let { value } = ev.target;
                        value = value.replace(",", "");
                        value = value.split(":");
                        const [faculty, department] = value;
                        setInputs({
                          ...inputs,
                          questions: {
                            ...inputs.questions,
                            [questionIndex]: {
                              ...Object.values(inputs.questions)[questionIndex],
                              questionFor: [
                                ...Object.values(inputs.questions)[
                                  questionIndex
                                ].questionFor,
                                { faculty, department },
                              ],
                            },
                          },
                        });
                        ev.target.value = "";
                      }
                    }}
                    removeQuestionFor={(ind: number) => {
                      const questionFor = Object.values(inputs.questions)[
                        questionIndex
                      ].questionFor;
                      questionFor.splice(ind, 1);
                      setInputs({
                        ...inputs,
                        questions: {
                          ...inputs.questions,
                          [questionIndex]: {
                            ...Object.values(inputs.questions)[questionIndex],
                            questionFor,
                          },
                        },
                      });
                    }}
                  />
                  <fieldset className="row form-section">
                    <legend>Assessment Instrustion</legend>

                    <label htmlFor="instruction">Instruction</label>
                    <textarea
                      name="instructions"
                      value={inputs.instructions}
                      onChange={handleInputs}
                      placeholder="Specify the exam Instruction here..."
                    />
                  </fieldset>

                  <div className="d-flex justify-content-center">
                    <input
                      type="submit"
                      value="Proceed"
                      className="btn btn-primary"
                    />
                  </div>
                </form>
              </section>
            );
          }}
        />
      </Switch>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  exams: state.exams,
});

const mapDispatchToProps = {
  createExam,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAssessment);
