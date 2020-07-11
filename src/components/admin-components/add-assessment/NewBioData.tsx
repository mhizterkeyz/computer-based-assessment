import React, { useState, useEffect } from "react";
import { getBioData } from "../../../api/AdministratorCalls";
import { toast } from "react-toastify";

import { toBase64 } from "./Functionality";

const BioData = (props: any) => {
  const { setInputs, inputs } = props;
  const [bioData, setBiodata] = useState([
    {
      matric: "",
      name: "",
      department: "",
      level: "",
      ca: 0,
    },
  ]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const toSpread: any = inputs.bioData.reduce(
      (acc: any, cur: any, i: number) => {
        if (acc.length >= 5 || i < (page - 1) * 5) {
          return acc;
        }
        return [...acc, cur];
      },
      []
    );
    setBiodata(toSpread);
  }, [inputs, setBiodata, page]);

  const handleFileUpload = async (ev: any) => {
    const { files } = ev.target;
    try {
      const file = await toBase64(files[0]);
      const obj = await getBioData(file);
      addRow(obj);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
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
    const t = Array.isArray(arr)
      ? arr.reduce((acc: any, cur: any) => {
          if (
            typeof cur.matric !== "string" ||
            typeof cur.name !== "string" ||
            typeof cur.department !== "string" ||
            isNaN(parseInt(cur.level)) ||
            isNaN(parseInt(cur.ca))
          ) {
            return acc;
          }
          return [...acc, cur];
        }, [])
      : [];
    setInputs({
      ...inputs,
      bioData: [...t, ...inputs.bioData],
    });
  };
  const handleBioData = (row: number, name: string, value: string | number) => {
    const arr = inputs.bioData;
    arr[row][name] = value;
    setInputs({ ...inputs, bioData: arr });
  };
  let pages = Math.floor(inputs.bioData.length / 5);
  pages +=
    parseInt((inputs.bioData.length / 5).toFixed(2).split(".")[1] + "") > 0
      ? 1
      : 0;
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

          <div>
            <span
              className="btn btn-primary new-assessment__nav-ques"
              onClick={(ev) => {
                const prev = page - 1 < 1 ? 1 : page - 1;
                setPage(prev);
              }}
            >
              prev
            </span>
            <span className="ml-2 mr-2">{`${page}/${pages}`}</span>
            <span
              onClick={(ev) => {
                const next = page + 1 > pages ? pages : page + 1;
                setPage(next);
              }}
              className="btn btn-primary new-assessment__nav-ques"
            >
              next
            </span>
          </div>
        </div>

        <fieldset className="new-assessment__fieldset">
          {bioData.map((elem: any, index: number) => {
            return (
              <div
                className="row"
                style={{ position: "relative" }}
                key={`biodata_row_${index}`}
              >
                <span style={{ position: "absolute", left: "-10px" }}>
                  {(page - 1) * 5 + index}.
                </span>
                <div className="col-2 d-flex flex-column new-assessment__student-data">
                  <label>Matric No:</label>
                  <input
                    type="text"
                    value={bioData[index].matric}
                    name="matric"
                    onChange={(ev) =>
                      handleBioData(
                        (page - 1) * 5 + index,
                        ev.target.name,
                        ev.target.value
                      )
                    }
                    className="new-assessment__course-input"
                  />
                </div>
                <div className="col-3 d-flex flex-column new-assessment__student-data">
                  <label>Name:</label>
                  <input
                    value={bioData[index].name}
                    type="text"
                    name="name"
                    onChange={(ev) =>
                      handleBioData(
                        (page - 1) * 5 + index,
                        ev.target.name,
                        ev.target.value
                      )
                    }
                    className="new-assessment__course-input"
                  />
                </div>
                <div className="col-3 d-flex flex-column new-assessment__student-data">
                  <label>Department:</label>
                  <input
                    type="text"
                    value={bioData[index].department}
                    name="department"
                    onChange={(ev) =>
                      handleBioData(
                        (page - 1) * 5 + index,
                        ev.target.name,
                        ev.target.value
                      )
                    }
                    className="new-assessment__course-input"
                  />
                </div>

                <div className="col-2 d-flex flex-column new-assessment__student-data">
                  <label>Level:</label>
                  <select
                    name="level"
                    onChange={(ev) =>
                      handleBioData(
                        (page - 1) * 5 + index,
                        ev.target.name,
                        ev.target.value
                      )
                    }
                    value={bioData[index].level}
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
                      handleBioData(
                        (page - 1) * 5 + index,
                        ev.target.name,
                        ev.target.value
                      )
                    }
                    style={{ paddingRight: "0px", paddingLeft: "7px" }}
                    value={bioData[index].ca}
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
                      arr.splice((page - 1) * 5 + index, 1);
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
