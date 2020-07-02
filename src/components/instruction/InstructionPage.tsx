import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./InstructionPage.scss";

import { getInstructions } from "../../api/studentApi";
import { toast } from "react-toastify";

const InstructionPage = () => {
  const [exam, setExam] = useState({
    noAssessment: true,
    timeAllowed: 0,
    instruction: "",
    course: "",
    courseTitle: "",
    inProgress: false,
  });
  const history = useHistory();
  useEffect(() => {
    (async () => {
      try {
        const req = await getInstructions();
        if (!(req.status >= 400)) {
          setExam({
            noAssessment: false,
            ...req.data,
            courseTitle: req.data.title,
            instruction: req.data.instructions,
            timeAllowed: req.data.displayTime,
          });
          return;
        }
        if (req.status === 404) return;
        throw new Error("An unexpected error has occurred");
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    })();
  }, []);

  // useEffect(()=>{
  //   if(exam.noAssessment === true) {
  //     setTimeout(() => {
  //       delete localStorage["jwt"];
  //       delete localStorage["route"];
  //       window.location.reload();
  //     }, 5000);
  //   }
  // }, []);

  return (
    <section className="m-auto instruction">
      <h3 className={`mt-5 ${exam.noAssessment ? "d-none" : ""}`}>
        Course -{" "}
        <span>
          {exam.courseTitle} ({exam.course})
        </span>{" "}
        <span className={`text-danger h6 ${exam.inProgress ? "" : "d-none"}`}>
          Already started
        </span>
      </h3>

      <div className="d-flex flex-column mb-5 instruction">
        <div
          className={`justify-content-between ${
            exam.noAssessment ? "d-none" : "d-flex"
          }`}
        >
          <h4>Instruction</h4>
          <div className="timer align-items-end">
            <h4>
              Time: <span>{exam.timeAllowed} Minutes</span>
            </h4>
          </div>
        </div>

        {exam.noAssessment ? (
          <div
            style={{
              display: "flex",
              height: 400,
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
            }}
          >
            You have no active exams, please exit the hall.
          </div>
        ) : (
          <>
            <p>{exam.instruction}</p>

            <span>
              Course:
              <span>{exam.course}</span>
            </span>

            <span>
              Course Title:
              <span>{exam.courseTitle}</span>
            </span>
            <span>
              Exam Duration:
              <span>{exam.timeAllowed} minutes</span>
            </span>

            <div className="text-right">
              <button
                className="btn"
                onClick={() => {
                  history.push(`/exam`);
                }}
              >
                {exam.inProgress ? "Resume assessment" : "Start"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default InstructionPage;
