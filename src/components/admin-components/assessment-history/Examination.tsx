import React from "react";
import "./AssessmentHistory.scss";

const Examination = ({
  exam,
  onClickShowExamination,
}: {
  exam: any;
  onClickShowExamination: (show: boolean, exam: any) => void;
}) => {
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
    <div
      className="dta-body"
      onClick={() => {
        return onClickShowExamination(true, exam);
      }}
    >
      <span className="">
        {exam.course} - {exam.title}
      </span>
      {/* TODO Format Date properly */}
      <span className="">{decDate}</span>
      {/* <span className="">7th June 2020</span> */}
      <span className={status.class}>{status.name}</span>
    </div>
  );
};

export default Examination;
