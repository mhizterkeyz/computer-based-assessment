import React from "react";
import { getBioData } from "../../../api/AdministratorCalls";
import { toast } from "react-toastify";

import { toBase64 } from "./Functionality";

const BioData = (props: any) => {
  const { setInputs, inputs } = props;
  const handleFileUpload = async (ev: any) => {
    const { files } = ev.target;
    try {
      const file = await toBase64(files[0]);
      const obj = await getBioData(file);
      addRow(obj);
    } catch (error) {
      toast.error(`Error: ${error.message}`,{
        position: "top-center"
      });
    }
  };
  const addRow = (
    arr?: [
      {
        matric: string;
        name: string;
        department: string;
        level: number;
        ca: number;
      }
    ]
  ) => {
    if (!Array.isArray(arr)) {
      setInputs({
        ...inputs,
        bioData: [
          { matric: "", name: "", department: "", level: 100, ca: 0 },
          ...inputs.bioData,
        ],
      });
      return;
    }
    setInputs({
      ...inputs,
      bioData: [...arr, ...inputs.bioData],
    });
  };
  const handleBioData = (row: number, name: string, value: string | number) => {
    const newData = { ...inputs.bioData[row], [name]: value };
    const arr = inputs.bioData;
    arr.splice(row, 1);
    setInputs({ ...inputs, bioData: [newData, ...arr] });
  };

  return (
    <fieldset className="new-assessment__fieldset">
      <legend className="new-assessment__legend">Students information</legend>

      <div className="d-flex flex-column mb-5">
        <label style={{ lineHeight: "1" }}>
          Upload Students data: <br />
          <span className="new-assessment__label-hint">
            upload bulk data using excel spreadsheet (.xlsx)
          </span>
        </label>
        <input type="file" onChange={handleFileUpload} name="studentData" />
      </div>

      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <label style={{ lineHeight: "1" }}>
            Upload Students data: <br />
            <span className="new-assessment__label-hint">
              upload single data individually
            </span>
          </label>

          <div>
            Add Data
            <button
              className="ml-2 new-assessment__add-data"
              onClick={(e) => {
                e.preventDefault();
                addRow();
              }}
            >
              +
            </button>
          </div>
        </div>

        <fieldset className="new-assessment__fieldset">
          {inputs.bioData.map((elem: any, index: number) => {
            return (
              <div className="row" key={`biodata_row_${index}`}>
                <div className="col-2 d-flex flex-column new-assessment__student-data">
                  <label>Matric No:</label>
                  <input
                    type="text"
                    value={inputs.bioData[index].matric}
                    name="matric"
                    onChange={(ev) =>
                      handleBioData(index, ev.target.name, ev.target.value)
                    }
                    className="new-assessment__course-input"
                  />
                </div>
                <div className="col-3 d-flex flex-column new-assessment__student-data">
                  <label>Name:</label>
                  <input
                    value={inputs.bioData[index].name}
                    type="text"
                    name="name"
                    onChange={(ev) =>
                      handleBioData(index, ev.target.name, ev.target.value)
                    }
                    className="new-assessment__course-input"
                  />
                </div>
                <div className="col-3 d-flex flex-column new-assessment__student-data">
                  <label>Department:</label>
                  <input
                    type="text"
                    value={inputs.bioData[index].department}
                    name="department"
                    onChange={(ev) =>
                      handleBioData(index, ev.target.name, ev.target.value)
                    }
                    className="new-assessment__course-input"
                  />
                </div>

                <div className="col-2 d-flex flex-column new-assessment__student-data">
                  <label>Level:</label>
                  <select
                    name="level"
                    onChange={(ev) =>
                      handleBioData(index, ev.target.name, ev.target.value)
                    }
                    value={inputs.bioData[index].level}
                    className="new-assessment__course-input"
                  >
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                  </select>
                </div>

                <div className="col-1 d-flex flex-column new-assessment__student-data">
                  <label>CA:</label>
                  <input
                    type="number"
                    onChange={(ev) =>
                      handleBioData(index, ev.target.name, ev.target.value)
                    }
                    style={{ paddingRight: "0px", paddingLeft: "7px" }}
                    value={inputs.bioData[index].ca}
                    name="ca"
                    className="new-assessment__course-input"
                  />
                </div>
                <div className="col-1 d-flex" style={{ alignItems: "center" }}>
                  <p
                    className="btn btn-danger"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "none",
                      justifyContent: "center",
                    }}
                    onClick={() => {
                      const arr = inputs.bioData;
                      arr.splice(index, 1);
                      setInputs({ ...inputs, bioData: arr });
                    }}
                  >
                    &minus;
                  </p>
                </div>
              </div>
            );
          })}
        </fieldset>
      </div>
    </fieldset>
  );
};

export default BioData;
