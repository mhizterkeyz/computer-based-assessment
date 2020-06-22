import React, { useEffect, useState } from "react";
import "./Assessment.scss";
import display_img from "../../image/Rectangle-19.png";
import { Link } from "react-router-dom";
import { loadUpExams } from "../../redux/actions/AdministratorActions";
import { connect } from "react-redux";
import Preloader from "../Preloader";

const RunningAssessment = ({ exam }: { exam: any }) => {
  const [student, setStudent] = useState({ show: false, matric: "13MS1027" });

  let status = {
    class: "",
    name: "",
  };

  if (exam.status === 0) {
    status.class = "pending";
    status.name = "Pending";
  } else if (exam.status === 1) {
    status.class = "running";
    status.name = "Running";
  } else {
    status.class = "closed";
    status.name = "Closed";
  }

  return (
    <>
      <h2 className="text-center">
        <span style={{ textTransform: "uppercase" }}>{exam.course}</span> -{" "}
        <span style={{ textTransform: "capitalize" }}>{exam.title}</span> <br />{" "}
        <span className={status.class + " status"}>{status.name}</span>
      </h2>
      <section className="d-flex justify-content-center">
        <div className="d-flex dash-detail">
          <i className="icon-assessment">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-assessment">
            <h3>{exam.bioData.length}</h3>
            <h4>Students</h4>
          </div>
        </div>

        <div className="d-flex dash-detail">
          <i className="icon-pending">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-pending">
            <h3>420</h3>
            <h4>Students pending</h4>
          </div>
        </div>

        <div className="d-flex dash-detail">
          <i className="icon-closed">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-closed">
            <h3>50</h3>
            <h4>Students finished</h4>
          </div>
        </div>

        <div className="d-flex dash-detail">
          <i className="icon-running">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ml-3 total-running">
            <h3>70</h3>
            <h4>Students online</h4>
          </div>
        </div>
      </section>

      <div className="student-section">
        <section className="tbl">
          <div className="d-flex justify-content-between align-items-center ctrl-actions">
            <button className="btn btn-primary">Add Student</button>
            <form>
              <input
                type="search"
                placeholder="&#xe902; Search Student"
                style={{ fontFamily: "Poppins, icomoon" }}
              />
            </form>
            <div>
              <button
                className="mr-3 btn btn-primary"
                disabled={exam.status !== 0}
              >
                Start Assesment
              </button>
              <button className="mr-3 btn btn-success">
                View Assesment Result
              </button>
              <button
                className="btn btn-danger"
                disabled={exam.status === 0 || exam.status === 3}
              >
                Close Assessment
              </button>
            </div>
          </div>

          <div className="dta-head ">
            <span className="">Student</span>
            <span className="">Matric. No</span>
            <span className="">Department</span>
            <span className="">Faculty</span>
            <span className="">Status</span>
          </div>

          <div
            className="dta-body"
            onClick={() => {
              // showStudent("16ME1023");
            }}
          >
            <span className="">Emannuel Meyanga</span>
            <span className="">16ME1027</span>
            <span className="">Mathematics Education</span>
            <span className="">Education</span>
            <span className=" status-running">Online</span>
          </div>

          <div
            className="dta-body"
            onClick={() => {
              // showStudent("16ME1023");
            }}
          >
            <span className="">Ojonugwa Alikali Justice</span>
            <span className="">16ME1023</span>
            <span className="">Computer Science</span>
            <span className="">Natural Science</span>
            <span className=" status-pending">Pending</span>
          </div>

          <div
            className="dta-body"
            onClick={() => {
              // showStudent("16ME1023");
            }}
          >
            <span className="">Babaniyi Power</span>
            <span className="">16ME1032</span>
            <span className="">Mathematics Science</span>
            <span className="">Natural Science</span>
            <span className=" status-closed">Finished</span>
          </div>

          <div className="pagination">
            <Link to="/admin/asssesment" className="btn link prev-next">
              Prev
            </Link>
            <Link to="/admin/asssesment" className="btn link">
              1
            </Link>
            <Link to="/admin/asssesment" className="btn link">
              2
            </Link>
            <Link to="/admin/asssesment" className="btn link active">
              3
            </Link>
            <Link to="/admin/asssesment" className="btn link">
              4
            </Link>
            <Link to="/admin/asssesment" className="btn link">
              5
            </Link>
            <Link to="/admin/asssesment" className="btn link prev-next">
              Next
            </Link>
          </div>
        </section>

        <section className="student-info">
          <span className="status-running">Online</span>

          <div className="d-flex flex-column align-items-center">
            <span className="image-cropper">
              <img src={display_img} alt="student" />
            </span>

            <h3 className="text-center">Ojonugwa Alikali</h3>
          </div>
          <hr />
          <div className="details">
            <div>
              <h3>Matric.No</h3>
              <h4>16MS1023</h4>
            </div>

            <div>
              <h3>Level</h3>
              <h4>200</h4>
            </div>

            <div>
              <h3>Department</h3>
              <h4>Mass Communication</h4>
            </div>

            <div>
              <h3>Faculty</h3>
              <h4>Social Science</h4>
            </div>
          </div>

          <hr />

          <div className="d-flex justify-content-between">
            <button className="btn btn-primary">Extend time</button>
            <button className="btn btn-primary">Retake</button>
            <button className="btn btn-primary">View Score</button>
          </div>

          <hr />
        </section>
      </div>
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    exams: state.exams,
    loading: state.apiCallsInProgress > 0,
  };
}

const mapDispatchToProps = {
  loadUpExams,
};

export default connect(mapStateToProps, mapDispatchToProps)(RunningAssessment);
