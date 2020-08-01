import React, { useState, useEffect } from "react";
import * as Fields from "./inputFields";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import BioData from "./NewBioData";
import Questions from "./NewQuestions";
import { createExam } from "../../../redux/actions/AdministratorActions";
import "./AddAssessment.scss";

const NewAssessment = (props: any) => {
  const [inputs, setInputs] = useState({
    timeAllowed: 0,
    displayTime: 0,
    title: "",
    course: "",
    questionsPerStudent: 35,
    examType: true,
    bioData: [
      {
        matric: "",
        name: "",
        department: "",
        level: 100,
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
  const [durations, setDurations] = useState({
    duration: {
      dur1: 0,
      dur2: 0,
    },
    screenDuration: {
      dur1: 0,
      dur2: 0,
    },
  });
  const [busy, setBusy] = useState(false);

  //  Input handlers
  //  Duration handler
  useEffect(() => {
    const timeAllowed =
      durations.duration.dur1 +
      parseFloat((durations.duration.dur2 / 100).toFixed(2));
    const displayTime =
      durations.screenDuration.dur1 +
      parseFloat((durations.screenDuration.dur2 / 100).toFixed(2));
    setInputs((i) => ({ ...i, timeAllowed, displayTime }));
  }, [durations]);
  const handleDurations = (ev: any) => {
    const { name, value } = ev.target;
    const [group, prop]: [string, string] = name.split("_");
    let dur =
      group === "duration"
        ? durations["duration"]
        : durations["screenDuration"];
    setDurations({
      ...durations,
      [group]: { ...dur, [prop]: parseInt(value) || 0 },
    });
  };
  //  Regular inputs handler
  const handleRegularInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInputs({ ...inputs, [name]: value });
  };
  //  Submit
  const handleSubmit = async (ev: any) => {
    ev.preventDefault();
    setBusy(true);
    try {
      const toSend = {
        ...inputs,
        questions: Object.values(inputs.questions),
        questionsPerStudent:
          typeof inputs.questionsPerStudent === "string"
            ? parseInt(inputs.questionsPerStudent)
            : inputs.questionsPerStudent,
      };
      await props.createExam(toSend);
      setInputs({
        timeAllowed: 0,
        displayTime: 0,
        title: "",
        course: "",
        questionsPerStudent: 35,
        examType: true,
        bioData: [
          {
            matric: "",
            name: "",
            department: "",
            level: 100,
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
      toast.success("Exam added successfully!", {
        position: "top-center",
      });
      props.history.push("/admin/exams");
    } catch (error) {
      toast.error(`Try that again: ${error.message}`, {
        position: "top-center",
      });
    }
    setBusy(false);
  };

  return (
    <>
      <h2 className="text-center mt-3 mb-3 new-assessment__title">
        Add New Assessment
      </h2>
      <section className="new-assessment">
        <form onSubmit={handleSubmit}>
          <fieldset className="new-assessment__fieldset">
            <legend className="new-assessment__legend">Time</legend>
            <div className="row">
              <Fields.durationField
                label="Duration"
                class="new-assessment__time-input"
                col="col-7"
                name="duration"
                onChange={handleDurations}
                {...durations.duration}
              />
              <Fields.durationField
                label="Screen Duration"
                class="new-assessment__time-input"
                col="col-5"
                name="screenDuration"
                onChange={handleDurations}
                {...durations.screenDuration}
              />
            </div>
          </fieldset>

          <fieldset className="new-assessment__fieldset">
            <legend className="new-assessment__legend">Course details</legend>
            <div className="row">
              <Fields.regularInput
                className="data-col col-6"
                label="Course code :"
                htmlFor="course"
                input={{
                  name: "course",
                  placeholder: "Enter Course code",
                  value: inputs.course,
                  onChange: handleRegularInputs,
                }}
              />
              <Fields.regularInput
                className="data-col col-6"
                label="Course Title :"
                htmlFor="course_title"
                input={{
                  name: "title",
                  placeholder: "Enter Course Title",
                  value: inputs.title,
                  onChange: handleRegularInputs,
                }}
              />

              <div className="col-6 d-flex flex-column">
                <label htmlFor="examType">Assessment Type:</label>
                <select
                  name="examType"
                  onChange={() =>
                    setInputs({ ...inputs, examType: !inputs.examType })
                  }
                  className="new-assessment__course-input"
                  value={inputs.examType ? "School Exam" : "PUTME"}
                >
                  <option>PUTME</option>
                  <option>School Exam</option>
                </select>
              </div>

              <Fields.regularInput
                className="data-col col-6"
                label="Number of questions per Students :"
                htmlFor="questionsPerStudent"
                input={{
                  type: "number",
                  name: "questionsPerStudent",
                  placeholder: "Enter Course Title",
                  value: inputs.questionsPerStudent,
                  onChange: handleRegularInputs,
                }}
              />
            </div>
          </fieldset>

          <BioData {...{ inputs, setInputs }} />

          <Questions {...{ inputs, setInputs }} />

          <fieldset className="new-assessment__fieldset">
            <legend className="new-assessment__legend">
              Assessment Instructions
            </legend>

            <div>
              <textarea
                name="instructions"
                value={inputs.instructions}
                onChange={handleRegularInputs}
                className="form-control"
                style={{ backgroundColor: "#ecf2fc" }}
                placeholder="Specify the exam Instruction here..."
              />
            </div>
          </fieldset>

          <div className="d-flex justify-content-center">
            <input type="submit" value="Proceed" className="btn btn-primary" />
          </div>
          <div className={`loading-overlay ${busy ? "" : "d-none"}`}>
            <div className="spinner"></div>
          </div>
        </form>
      </section>
    </>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  createExam,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewAssessment);
