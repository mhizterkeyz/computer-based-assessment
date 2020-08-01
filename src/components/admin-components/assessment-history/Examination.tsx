import React from "react";
import { Link } from "react-router-dom";

import "./AssessmentHistory.scss";

const Examination = ({ exam, ...props }: any) => {
  let status = {
    class: "",
    name: "",
  };

  if (exam.status === 0) {
    status.class = "status-pending";
    status.name = "pending";
  } else if (exam.status === 1) {
    status.class = "status-running";
    status.name = "running";
  } else {
    status.class = "status-closed";
    status.name = "closed";
  }
  let date = new Date(exam.createdAt);
  let decDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

  const titleCase = (str: string) =>
    str
      .split(" ")
      .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(" ");
  return (
    <Link
      className="dta-body"
      to={`/admin/exams/${exam._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <span className="" style={{}}>
        {exam.course.toUpperCase()} - {titleCase(exam.title)}
      </span>
      {/* TODO Format Date properly */}
      <span className="">{decDate}</span>
      {/* <span className="">7th June 2020</span> */}
      <span className={status.class}>{status.name}</span>
      <button
        onClick={(ev: any) => {
          ev.stopPropagation();
          ev.preventDefault();
          props.confirmModal(
            <div className="text-center confirm-modal">
              <h2>Are you sure you want to do this?</h2>
              <p>This operation is irreversible.</p>
              <div className="">
                <button className="btn" onClick={() => props.closeModal()}>
                  Cancel
                </button>
                <button
                  className="btn ml-2"
                  onClick={() => {
                    props.deleteExam(exam._id);
                    props.closeModal();
                  }}
                >
                  Yes I'm sure
                </button>
              </div>
            </div>
          );
        }}
        title="delete examination"
        className="flying-btn btn btn-light"
      >
        <i className="icon-delete_forever" />
      </button>
    </Link>
  );
};

export default Examination;
