import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, SelectField } from "./InputField";

export const AddStudentModalWindow = ({ handleModalClose, faculty }: any) => {
  const [input, setInput] = useState({ faculty: null, department: ""});

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInput({ ...input, [name]: value });
  };

  const facultyAlphabeticalSortFn = (a: any, b: any) =>
    a.faculty > b.faculty ? 1 : a.faculty < b.faculty ? -1 : 0;

  const departmentAlphabeticalSortFn = (a: any, b: any) =>
    a.department > b.department ? 1 : a.department < b.department ? -1 : 0;

  const fac = faculty
    .sort(facultyAlphabeticalSortFn)
    .map((faculty: any) => faculty.faculty);

  let department = [];
  if (input.faculty !== null) {
    department = faculty.filter(
      (faculty: any) => faculty.faculty === input.faculty
    );

    department = department[0].departments  
      .sort(departmentAlphabeticalSortFn)
      .map((dept: any) => dept.department);
  }

  useEffect(() => {
    setInput({...input, department: ""});
  }, [input.faculty])

  return (  
    <div className="text-center profile">
      <h3>Add Student</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <TextField
          name="name"
          label="Name"
          placeholder="Enter Student's Name"
          handleInputs={handleInputs}
        />

        <div className="row">
          <TextField
            class="col-6"
            name="matric"
            label="Matric No."
            placeholder="Enter Matric No."
            handleInputs={handleInputs}
          />

          <SelectField
            class="col-6"
            label="Level"
            name="level"
            value={["100", "200", "300", "400", "500"]}
            handleInputs={handleInputs}
          />
        </div>

        <SelectField
          label="Faculty"
          name="faculty"
          value={fac}
          handleInputs={handleInputs}
        />
        
        {/**
         * TODO: fix bug partaining to sudden change of faculty
         */}

        <SelectField
          label="Department"
          name="department"
          isDisabled={input.faculty === null ? true : false}
          value={department}
          handleInputs={handleInputs}
        />

        <div className="">
          <button className="btn btn-primary" onClick={handleModalClose}>
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={() => {
              // history.push("/exam/submit");
            }}
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};
