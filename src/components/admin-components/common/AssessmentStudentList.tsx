import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StudentList = ({ user, status, showStudent, _id }: any) => {
  return (
    <div
      className="dta-body align-items-center"
      onClick={() => {
        showStudent(
          user,
          user.department.department,
          user.faculty.faculty,
          status,
          _id,
          user._id
        );
      }}
    >
      <span style={{ textTransform: "capitalize" }}>{user.name}</span>
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

export const StudentInfo = ({
  student: stud,
  setStudent: setStud,
  ...props
}: any) => {
  const [student, setStudent] = useState({
    status: 0,
    _id: "",
    user: {
      name: "",
      matric: "",
      level: "",
    },
    department: "",
    faculty: "",
  });

  useEffect(() => {
    setStudent((i) => ({ ...i, ...stud }));
  }, [stud]);

  const handleRetake = async () => {
    try {
      return (
        (await props.updateBiodata({
          data: { status: 0 },
          examId: props.examId,
          biodataId: student._id,
        })) &&
        toast.success(`${student.user.matric} can now retake the assessment`, {
          position: "top-center",
          delay: 10000,
        })
      );
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  const titleCase = (str: string) => {
    debugger;
    return str
      .split(" ")
      .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(" ");
  };

  return (
    <section className="student-info d-none">
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
          <img
            src={`http://${window.location.hostname}:8000/api/static/${student.user.matric}.png`}
            alt="student"
          />
        </span>

        <h3
          className="text-center"
          style={{
            textTransform: "capitalize",
            marginTop: 12,
            marginBottom: 20,
          }}
        >
          {student.user.name}
        </h3>
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
          onClick={props.handleShowExtendModal}
          disabled={student.status === 0 || student.status === 2}
        >
          Extend time
        </button>
        <button
          className="btn btn-primary"
          onClick={handleRetake}
          disabled={student.status === 0 || student.status === 1}
        >
          Retake
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (student.status === 0) {
              toast.error(
                `${student.user.name
                  .split(" ")
                  .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
                  .join(" ")} did not write this Exam`
              );
              return;
            }

            return props.handleScoreModal();
          }}
          // onClick={props.handleScoreModal}
          // disabled={student.status === 0 || student.status === 1}
        >
          View Score
        </button>
      </div>

      <hr />

      <button
        className="cancel-btn"
        onClick={() => setStud({ ...student, show: false })}
      >
        &times;
      </button>
    </section>
  );
};
