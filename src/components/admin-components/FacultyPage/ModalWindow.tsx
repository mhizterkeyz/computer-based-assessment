import React, { useState } from "react";
import { TextField } from "../InputField";

export const AddFacultyWindow = ({
  handleModalClose,
}: any) => {
  const [input, setInput] = useState({ faculty: "" });

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInput({ ...input, [name]: value });
  };
  return (
    <div className="text-center profile">
      <h3>Add a new Faculty</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <TextField
          name="faculty"
          handleInputs={handleInputs}
          placeholder="Enter Faculty name here"
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

export const AddDepartmentWindow = ({
  handleModalClose,
}: any) => {
  const [input, setInput] = useState({ faculty: "" });

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInput({ ...input, [name]: value });
  };
  return (
    <div className="text-center profile">
      <h3>Add a new Department</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <TextField
          name="department"
          placeholder="Enter Department name here"
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