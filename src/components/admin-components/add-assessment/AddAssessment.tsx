import React from "react";
import "./AddAssessment.scss";
import Header from "../Header";
import { useHistory, Switch, Route } from "react-router-dom";
import AddQuestion from "../question/AddQuestion";

const AddAssessment = () => {
  const history = useHistory();
  return (
    <>
      <Header />
      <Switch>
        <Route to="add-assesment/Question" component={AddQuestion} />
        <Route render={() => {
          return (
            <section className="add-assessment">
              <h3>Add Assessment</h3>

              <form
                onSubmit={(e) => { e.preventDefault(); }}
              >
                <fieldset className="form-section">
                  <legend>Time</legend>

                  <div className="row time-fieldset">
                    <div className="align-items-center col-6 grid-group">
                      <label htmlFor="duration">Duration:</label>

                      <div>
                        <input type="number" placeholder="00" /><span>mins</span>
                        <input type="number" placeholder="00" className="scnd" /><span>secs</span>
                      </div>
                    </div>

                    <div className="align-items-center col-6 grid-group">
                      <label htmlFor="duration">Screen Duration:</label>

                      <div>
                        <input type="number" placeholder="00" /><span>mins</span>
                        <input type="number" placeholder="00" className="scnd" /><span>secs</span>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="form-section course-details">
                  <legend>Course details</legend>
                  <div className="row ">
                    <div className="col-6 data-col grid-group">
                      <label htmlFor="title">Course title :</label>
                      <input type="text" name="title" placeholder="Enter Course title" />
                    </div>

                    <div className="col-6 data-col grid-group">
                      <label htmlFor="code">Course code :</label>
                      <input type="text" name="code" placeholder="Enter Course code" />
                    </div>

                    <div className="col-6 data-col grid-group">
                      <label htmlFor="faculty">Faculty :</label>
                      <select name="faculty">
                        <option value="general">General</option>
                        <option value="natural science">Natural science</option>
                        <option value="social science">Social science</option>
                        <option value="law">Law</option>
                      </select>
                    </div>

                    <div className="col-6 data-col grid-group">
                      <label htmlFor="department">Department :</label>
                      <select name="department">
                        <option value="all">All</option>
                        <option value="microbiology">Microbiology</option>
                        <option value="computer science">Computer Science</option>
                        <option value="law">Law</option>
                      </select>
                    </div>

                    <div className="col-6 data-col grid-group">
                      <label htmlFor="semester">Semester :</label>
                      <select name="semester">
                        <option value="first semester">First semester</option>
                        <option value="second semester">Second semester</option>
                      </select>
                    </div>


                    <div className="col-6 data-col grid-group">
                      <label htmlFor="level">Level :</label>
                      <select name="level">
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                      </select>
                    </div>
                  </div>
                </fieldset>

                {/* TODO Revisit Style */}
                <fieldset className="form-section course-details">
                  <legend>Course details</legend>
                  <div className="row">
                    <div className="col-6 data-col grid-group-file">
                      <label htmlFor="title">Upload students data:</label>
                      <input type="file" name="data" />
                    </div>

                    <div className="col-6 data-col grid-group-file">
                      <label htmlFor="code">Upload students CA:</label>
                      <input type="file" name="CA" />
                    </div>

                    <div className="col-6 data-col grid-group-file">
                      <label htmlFor="code">Upload students Image: <br /><span>(image should be label with matric no)</span></label>
                      <input type="file" name="CA" />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="row form-section">
                  <legend>Assessment Instrustion</legend>

                  <label htmlFor="instruction">Instruction</label>
                  <textarea name="instruction" placeholder="Specify the exam Instruction here..."/>
                </fieldset>

                <div className="d-flex justify-content-center">
                  <input
                    type="submit"
                    value="Proceed"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push("add-assesment/Question")
                    }}
                  />
                </div>
              </form>
            </section>
          );
        }} />

      </Switch>
    </>
  );
};

export default AddAssessment;