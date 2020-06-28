import React, { useState } from "react";
import { TextField } from "../InputField";
import { toast } from "react-toastify";

export const AddFacultyWindow = ({
  handleModalClose,
  createFaculty,
  faculty,
}: any) => {
  const [input, setInput] = useState({ faculty: "" });

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInput({ ...input, [name]: value });
  };

  const handleCreateFaculty = async () => {
    if (
      faculty.filter(
        (a: any) =>
          a.faculty
            .toLowerCase()
            .indexOf(input.faculty.toLowerCase().split(" ")[0]) !== -1
      ).length > 0
    ) {
      toast.configure();
      toast.warning(`${input.faculty} Faculty Exists`);
      return;
    }

    try {
      await createFaculty(input.faculty);
      toast.configure();
      toast.success(`${input.faculty} Faculty was Successfully Added`);
      handleModalClose();
    } catch (error) {
      toast.configure();
      toast.error(error.message);
    }
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

          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={handleCreateFaculty}
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export const AddDepartmentWindow = ({ handleModalClose }: any) => {
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
