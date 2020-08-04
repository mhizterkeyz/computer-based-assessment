import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { TextField, SelectField, NumberField } from "./InputField";
import {
  facultyAlphabeticalSortFn,
  departmentAlphabeticalSortFn,
} from "./sortHelperFn";
import { connect } from "react-redux";
import { addBiodata } from "../../../redux/actions/AdministratorActions";
import { addMassScore } from "../../../api/AdministratorCalls";

export const AddMassScoreModal = ({ handleModalClose, examId }: any) => {
  const [input, setInput] = useState({
    score: 0,
    busy: false,
  });

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = async (ev: any) => {
    ev.preventDefault();
    setInput({ ...input, busy: true });
    try {
      toast.success("score is being added, will notify you when done.", {
        position: "top-center",
      });
      handleModalClose();
      await addMassScore(examId, input.score);
      toast.success("score adding operation has completed successfully.", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("score adding operation failed.", { position: "top-center" });
    }
    setInput({ ...input, busy: false });
  };

  return (
    <div className="text-center profile">
      <h3>Add Mass Sore</h3>
      <form onSubmit={handleSubmit}>
        <NumberField
          name="score"
          max="10"
          min="0"
          value={input.score}
          label="Score (maximum of 10 marks)"
          handleInputs={handleInputs}
        />

        <div className="">
          <div
            className={`btn btn-primary ${input.busy ? "disabled" : ""}`}
            onClick={handleModalClose}
          >
            Cancel
          </div>

          <button
            className={`btn btn-primary ml-2 ${input.busy ? "disabled" : ""}`}
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

const AddStudentModalWindow = ({
  handleModalClose,
  faculty: stateFac,
  ...props
}: any) => {
  const faculty = Object.values(stateFac).filter(
    (elem: any) => typeof elem === "object"
  );
  const [input, setInput] = useState({
    faculty: null,
    department: "",
    name: "",
    level: "100",
    matric: "",
    ca: 0,
  });
  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInput({ ...input, [name]: value });
  };
  const handleSubmit = async (ev: any) => {
    ev.preventDefault();
    try {
      const toSubmit = input;
      delete toSubmit.faculty;
      return (
        (await props.addBiodata({
          toSend: toSubmit,
          examId: props.examId,
          ...props.counts,
        })) &&
        toast.success("Student added successfully", {
          position: "top-center",
        }) &&
        handleModalClose()
      );
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  const fac = faculty
    .sort(facultyAlphabeticalSortFn)
    .map((faculty: any) => faculty.faculty);

  let department = [];
  if (input.faculty !== null) {
    department = faculty.filter(
      (faculty: any) => faculty.faculty === input.faculty
    );

    department =
      (department[0] &&
        //  @ts-ignore
        Object.values(department[0].departments)
          .sort(departmentAlphabeticalSortFn)
          .map((dept: any) => dept.department)) ||
      department;
  }
  useEffect(() => {
    const check = faculty.find((elem: any) => {
      return (
        elem.faculty === input.faculty &&
        Object.values(elem.departments).find(
          (dept: any) => dept.department === input.department
        )
      );
    });
    if (input.department.length && !check)
      setInput((i) => ({ ...i, department: "" }));
  }, [input, faculty]);

  return (
    <div className="text-center profile">
      <h3>Add Student</h3>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          placeholder="Enter Student's Name"
          value={input.name}
          handleInputs={handleInputs}
        />

        <div className="row">
          <TextField
            name="matric"
            class="col-12"
            label="Matric No."
            placeholder="Enter Matric No."
            value={input.matric}
            handleInputs={handleInputs}
          />
          <TextField
            name="ca"
            class="col-6"
            label="CA."
            type="number"
            placeholder="Enter CA."
            value={input.ca}
            handleInputs={handleInputs}
          />
          <SelectField
            class="col-6"
            label="Level"
            name="level"
            value={input.level}
            options={["100", "200", "300", "400", "500"]}
            handleInputs={handleInputs}
          />
        </div>

        <SelectField
          label="Faculty"
          name="faculty"
          value={input.faculty || ""}
          options={fac}
          handleInputs={handleInputs}
        />

        <SelectField
          label="Department"
          name="department"
          isDisabled={input.faculty === null}
          value={input.department}
          options={department}
          handleInputs={handleInputs}
        />

        <div className="">
          <div className="btn btn-primary" onClick={handleModalClose}>
            Cancel
          </div>

          <button className="btn btn-primary ml-2">Add</button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, { addBiodata })(AddStudentModalWindow);
