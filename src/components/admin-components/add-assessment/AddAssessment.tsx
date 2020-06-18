import React, { useState} from "react";
import "./AddAssessment.scss";
import Header from "../Header";
import { Switch, Route } from "react-router-dom";
import AddQuestion from "../question/AddQuestion";
import { toBase64 } from "./Functionality";
import { connect } from "react-redux";
import { createExam } from "../../../redux/actions/AdministratorActions";

import * as Fields from "./inputFields";

const AddAssessment = (props: any) => {
  const [inputs, setInputs] = useState({
    timeAllowed: 0,
    scheduledFor: Date.now(),
    title: "",
    course: "",
    questionsPerStudent: 30,
    markPerQuestion: 2,
    examType: true,
    bioData: "",
    questions: "",
    instructions: "",
  });
  const [durations, setDurations] = useState({
    dur1: 45,
    dur2: 0,
  });

  const handleBase64Convertion = async (ev: any) => {
    try {
      const { name, files } = ev.target;
      const file = await toBase64(files[0]);
      setInputs({ ...inputs, [name]: file });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInputs({ ...inputs, [name]: value });
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
      await props.createExam(inputs);
      setInputs({
        timeAllowed: 0,
        scheduledFor: Date.now(),
        title: "",
        course: "",
        questionsPerStudent: 30,
        markPerQuestion: 2,
        examType: true,
        bioData: "",
        questions: "",
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

                      <Fields.regularInput
                        label="scheduled for"
                        htmlFor="scheduledFor"
                        input={{
                          type: "date",
                          onChange: (ev: any) => {
                            setInputs({
                              ...inputs,
                              scheduledFor: Date.parse(ev.target.value),
                            });
                          },
                          name: "scheduledFor",
                        }}
                      />
                    </div>
                  </fieldset>

                  <fieldset className="form-section course-details">
                    <legend>Course details</legend>
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
                      <Fields.regularInput
                        className="data-col"
                        label="Mark Per Question"
                        htmlFor="markPerQuestion"
                        input={{
                          type: "number",
                          name: "markPerQuestion",
                          value: inputs.markPerQuestion,
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
                  <fieldset className="form-section course-details">
                    <legend>Course details</legend>
                    <div className="row">
                      <Fields.regularInput
                        htmlFor="bioData"
                        label={
                          <>
                            Upload students data:
                            <br /> <span>(spread sheet file (.xlsx))</span>
                          </>
                        }
                        className="grid-group-file data-col"
                        input={{
                          type: "file",
                          name: "bioData",
                          onChange: handleBase64Convertion,
                        }}
                      />
                      <Fields.regularInput
                        htmlFor="questions"
                        label={
                          <>
                            Upload questions:
                            <br /> <span>(spread sheet file (.xlsx))</span>
                          </>
                        }
                        className="grid-group-file data-col"
                        input={{
                          type: "file",
                          name: "questions",
                          onChange: handleBase64Convertion,
                        }}
                      />
                    </div>
                  </fieldset>

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
