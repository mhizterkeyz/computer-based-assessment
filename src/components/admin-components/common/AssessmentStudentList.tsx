import React from "react";

import display_img from "../../image/Rectangle-19.png";

export const StudentList = ({ user, status, showStudent }: any) => {
  let examStatus = {
    class: "",
    name: "",
  };

  if (status === 0) {
    examStatus.class = "status-pending";
    examStatus.name = "Pending";
  } else if (status === 1) {
    examStatus.class = "status-running";
    examStatus.name = "Running";
  } else {
    examStatus.class = "status-closed";
    examStatus.name = "Finished";
  }

  return (
    <div
      className="dta-body"
      onClick={() => {
        showStudent(user, user.department.department, user.faculty.faculty);
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
      <span className={examStatus.class}>{examStatus.name}</span>
    </div>
  );
};

export const StudentInfo = ({ user, faculty, department }: any) => {
  return (
    <section className="student-info">
      <span className="status-running">Online</span>

      <div className="d-flex flex-column align-items-center">
        <span className="image-cropper">
          <img src={display_img} alt="student" />
        </span>

        <h3 className="text-center">{user.name}</h3>
      </div>
      <hr />
      <div className="details">
        <div>
          <h3>Matric.No</h3>
          <h4>{user.matric}</h4>
        </div>

        <div>
          <h3>Level</h3>
          <h4>200</h4>
        </div>

        <div>
          <h3>Department</h3>
          <h4>{department}</h4>
        </div>

        <div>
          <h3>Faculty</h3>
          <h4>{faculty}</h4>
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
  );
};
