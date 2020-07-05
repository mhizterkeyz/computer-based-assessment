import React from "react";

import display_img from "../../../image/Rectangle-19.png";

export const StudentList = ({ user, status, showStudent }: any) => {
  return (
    <div
      className="dta-body"
      onClick={() => {
        showStudent(
          user,
          user.department.department,
          user.faculty.faculty,
          status
        );
      }}
    >
      <span>{user.name}</span>
      <span style={{ textTransform: "uppercase" }}>{user.matric}</span>
      <span style={{ textTransform: "capitalize" }}>
        {user.department.department}
      </span>
      <span style={{ textTransform: "capitalize" }}>
        {user.faculty.faculty}
      </span>
      <span
        className={
          status === 0
            ? "status-pending"
            : status === 1
            ? "status-running"
            : "status-closed"
        }
      >
        {status === 0 ? "Pending" : status === 1 ? "Online" : "Finished"}
      </span>
    </div>
  );
};

export const StudentInfo = ({ student, setStudent }: any) => {
  return (
    <section className="student-info">
      <span
        className={
          student.status === 0
            ? "status-pending"
            : student.status === 1
            ? "status-running"
            : "status-closed"
        }
      >
        {student.status === 0
          ? "Pending"
          : student.status === 1
          ? "Online"
          : "Finished"}
      </span>

      <div className="d-flex flex-column align-items-center">
        <span className="image-cropper">
          <object
            data={`http://${window.location.hostname}:8000/api/static/${student.user.matric}.png`}
            type="image/jpg"
            style={{ width: "100%" }}
          >
            <img
              src={`http://${window.location.hostname}:8000/api/static/default.png`}
              srcSet=""
              alt="student"
            />
          </object>
        </span>

        <h3 className="text-center">{student.user.name}</h3>
      </div>
      <hr />
      <div className="details">
        <div className="row mb-3">
          <div className="col-8">
            <h3>Matric.No</h3>
            <h4 style={{ textTransform: "uppercase" }}>
              {student.user.matric}
            </h4>
          </div>

          <div className="col-4">
            <h3>Level</h3>
            <h4>{student.user.level}</h4>
          </div>
        </div>

        <div className="mb-3">
          <h3>Department</h3>
          <h4 style={{ textTransform: "capitalize" }}>{student.department}</h4>
        </div>

        <div>
          <h3>Faculty</h3>
          <h4 style={{ textTransform: "capitalize" }}>{student.faculty}</h4>
        </div>
      </div>

      <hr />

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          disabled={student.status === 0 || student.status === 2 ? true : false}
        >
          Extend time
        </button>
        <button
          className="btn btn-primary"
          disabled={student.status === 0 || student.status === 1 ? true : false}
        >
          Retake
        </button>
      </div>

      <hr />

      <button
        className="cancel-btn"
        onClick={() => setStudent({ ...student, show: false })}
      >
        &times;
      </button>
    </section>
  );
};
