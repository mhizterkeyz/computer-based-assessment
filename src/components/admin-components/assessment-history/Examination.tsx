import React from "react";
import { Link } from "react-router-dom";
import "./AssessmentHistory.scss";

const Examination = ({ exam }: { exam: any }) => {
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
  let decDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

  return (
    <Link
      to={`admin/history/${exam._id}`}
      className="dta-body"
      style={{ textDecoration: "none" }}
    >
      <span className="">
        {exam.course} - {exam.title}
      </span>
      {/* TODO Format Date properly */}
      <span className="">{decDate}</span>
      {/* <span className="">7th June 2020</span> */}
      <span className={status.class}>{status.name}</span>
    </Link>
  );
};

export default Examination;
