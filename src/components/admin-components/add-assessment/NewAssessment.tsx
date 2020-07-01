import React from "react";
import * as Fields from "./inputFields";

const NewAssessment = () => {
  return (
    <>
      <h2 className="text-center mt-3 mb-3 new-assessment__title">Add New Assessment</h2>
      <section className="new-assessment">
        <form>
          <fieldset className="new-assessment__fieldset">
            <legend className="new-assessment__legend">Time</legend>
            <div className="row">
              <Fields.durationField
                label="Duration"
                class="new-assessment__time-input"
                col="col-7"
              />
              <Fields.durationField
                label="Screen Duration"
                class="new-assessment__time-input"
                col="col-5"
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
                }}
              />
              <Fields.regularInput
                className="data-col col-6"
                label="Course Title :"
                htmlFor="course_title"
                input={{
                  name: "course_title",
                  placeholder: "Enter Course Title",
                }}
              />

              <div className="col-6 d-flex flex-column">
                <label htmlFor="examType">Assessment Type:</label>
                <select
                  name="examType"
                  // onChange={() =>
                  //   setInputs({ ...inputs, examType: !inputs.examType })
                  // }
                  className="new-assessment__course-input"
                  defaultValue="School Exam"
                >
                  <option>PUTME</option>
                  <option>School Exam</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className="new-assessment__fieldset">
            <legend className="new-assessment__legend">
              Students information
            </legend>

            <div className="d-flex flex-column mb-5">
              <label style={{ lineHeight: "1" }}>
                Upload Students data: <br />
                <span className="new-assessment__label-hint">
                  upload bulk data using excel spreadsheet (.xlsx)
                </span>
              </label>
              <input type="file" name="studentData" />
            </div>

            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between">
                <label style={{ lineHeight: "1" }}>
                  Upload Students data: <br />
                  <span className="new-assessment__label-hint">
                    upload single data individually
                  </span>
                </label>

                <div>
                  Add Data
                  <button
                    className="ml-2 new-assessment__add-data"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <fieldset className="new-assessment__fieldset">
                <div className="row">
                  <div className="col-2 d-flex flex-column new-assessment__student-data">
                    <label>Matric No:</label>
                    <input
                      type="text"
                      name="matric"
                      className="new-assessment__course-input"
                    />
                  </div>

                  <div className="col-3 d-flex flex-column new-assessment__student-data">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      className="new-assessment__course-input"
                    />
                  </div>

                  <div className="col-3 d-flex flex-column new-assessment__student-data">
                    <label>Department:</label>
                    <input
                      type="text"
                      name="matric"
                      className="new-assessment__course-input"
                    />
                  </div>

                  <div className="col-2 d-flex flex-column new-assessment__student-data">
                    <label>Level:</label>
                    <select
                      name="level"
                      className="new-assessment__course-input"
                    >
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                    </select>
                  </div>

                  <div className="col-2 d-flex flex-column new-assessment__student-data">
                    <label>CA Score:</label>
                    <input
                      type="number"
                      name="matric"
                      className="new-assessment__course-input"
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </fieldset>

          <fieldset className="new-assessment__fieldset">
            <legend className="new-assessment__legend">Questions Data</legend>

            <div className="d-flex flex-column mb-5">
              <label style={{ lineHeight: "1" }}>
                Upload Questions: <br />
                <span className="new-assessment__label-hint">
                  upload bulk data using excel spreadsheet (.xlsx)
                </span>
              </label>
              <input type="file" name="studentData" />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <label style={{ lineHeight: "1" }}>
                Upload Questions: <br />
                <span className="new-assessment__label-hint">
                  upload single data individually
                </span>
              </label>

              <button className="btn btn-primary new-assessment__nav-ques">
                Add new
              </button>

              <div>
                <button className="btn btn-primary new-assessment__nav-ques">
                  prev
                </button>
                <span className="ml-2 mr-2">1 of 2</span>
                <button className="btn btn-primary new-assessment__nav-ques">
                  next
                </button>
              </div>
            </div>
            <fieldset className="new-assessment__fieldset">
              <div className="d-flex justify-content-between align-items-center">
                <h4>Question 1</h4>

                <div className="d-flex flex-column mb-3 align-items-center new-assessment__course-input--mark">
                  <label>Assign Mark</label>
                  <input
                    type="number"
                    className="new-assessment__course-input mb-0"
                  />
                </div>

                <button className="btn btn-outline-danger">Delete</button>
              </div>
              <div className="d-flex flex-column">
                <label>
                  Indicate Faculty specific to the questions{" "}
                  <span className="ml-2 new-assessment__label-hint">
                    (Optional)
                  </span>
                </label>
                <input
                  type="text"
                  name="faculty"
                  className="new-assessment__course-input"
                />
              </div>

              <div>
                <textarea
                  name="question"
                  className="new-assessment__course-input"
                  placeholder="Specify the exam Instruction here..."
                ></textarea>
              </div>

              <div>
                <label className="d-flex align-items-center mb-3">
                  A.
                  <input type="radio" className="ml-3" />
                  <input
                    type="text"
                    className="ml-3 new-assessment__course-input mb-0"
                  />
                </label>
              </div>

              <div>
                <label className="d-flex align-items-center mb-3">
                  B.
                  <input type="radio" className="ml-3" />
                  <input
                    type="text"
                    className="ml-3 new-assessment__course-input mb-0"
                  />
                </label>
              </div>

              <div>
                <label className="d-flex align-items-center mb-3">
                  C.
                  <input type="radio" className="ml-3" />
                  <input
                    type="text"
                    className="ml-3 new-assessment__course-input mb-0"
                  />
                </label>
              </div>

              <div>
                <label className="d-flex align-items-center mb-3">
                  D.
                  <input type="radio" className="ml-3" />
                  <input
                    type="text"
                    className="ml-3 new-assessment__course-input mb-0"
                  />
                </label>
              </div>

              <div className="d-flex flex-column mb-5 mt-5">
                <label style={{ lineHeight: "1" }}>
                  Upload Diagram:
                  <span className="ml-2 new-assessment__label-hint">
                    (Optional)
                  </span>
                </label>
                <input type="file" name="studentData" />
              </div>
            </fieldset>
          </fieldset>
        </form>
      </section>
    </>
  );
};

export default NewAssessment;
