import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { TextField, SelectField } from "./InputField";
import { facultyAlphabeticalSortFn, departmentAlphabeticalSortFn } from "./sortHelperFn";
import { connect } from "react-redux";
import { addBiodata } from "../../../redux/actions/AdministratorActions";

export const AddStudentModalWindow = ({
  handleModalClose,
  faculty,
  ...props
}: any) => {
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
  const handleSubmit = async () => {
    try {
      const toSubmit = input;
      delete toSubmit.faculty;
      return (
        (await props.addBiodata({ toSend: toSubmit, examId: props.examId })) &&
        toast.success("Student added successfully",{
          position: "top-center"
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
        department[0].departments
          .sort(departmentAlphabeticalSortFn)
          .map((dept: any) => dept.department)) ||
      department;
  }
  useEffect(() => {
    const check = faculty.find((elem: any) => {
      return (
        elem.faculty === input.faculty &&
        elem.departments.find(
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

        {/**
         * TODO: fix bug partaining to sudden change of faculty
         */}

        <SelectField
          label="Department"
          name="department"
          isDisabled={input.faculty === null}
          value={input.department}
          options={department}
          handleInputs={handleInputs}
        />

        <div className="">
          <button className="btn btn-primary" onClick={handleModalClose}>
            Cancel
          </button>

          <button type="submit" className="btn btn-primary ml-2">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default connect((state, ownProps) => ({ ...ownProps }), { addBiodata })(
  AddStudentModalWindow
);
