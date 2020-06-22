import React from "react";
import { getBioData } from "../../../api/AdministratorCalls";

const BioData = (props: any) => {
  const { handleBioData, bioData, addRow, removeRow, toBase64 } = props;
  const handleFileUpload = async (ev: any) => {
    const { files } = ev.target;
    try {
      const file = await toBase64(files[0]);
      const obj = await getBioData(file);
      addRow(obj);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <fieldset className="form-section course-details">
      <legend>Biodata</legend>
      <div className="row">
        <div className="col-6">
          <label htmlFor="input_file">data from spreadsheet (xlsx):</label>
          <input
            type="file"
            name="bioDataFile"
            onChange={handleFileUpload}
            id="input_file"
          />
        </div>
        <p
          className="btn btn-primary col-2 offset-4"
          style={{ alignSelf: "center" }}
          onClick={addRow}
        >
          + Add row
        </p>
        <div className="col-12 questions mt-5">
          {bioData.map((elem: any, i: any) => {
            return (
              <div className="row my-3" key={`biodataRow_${i}`}>
                <div className="col-2">
                  <input
                    type="text"
                    name="matric"
                    onChange={(ev: any) => {
                      handleBioData(i, ev.target.name, ev.target.value);
                    }}
                    value={elem.matric}
                    placeholder="Matric"
                  />
                </div>
                <div className="col-3">
                  <input
                    type="text"
                    name="name"
                    value={elem.name}
                    onChange={(ev: any) => {
                      handleBioData(i, ev.target.name, ev.target.value);
                    }}
                    placeholder="Name"
                  />
                </div>
                <div className="col-3">
                  <input
                    type="text"
                    name="department"
                    onChange={(ev: any) => {
                      handleBioData(i, ev.target.name, ev.target.value);
                    }}
                    value={elem.department}
                    placeholder="Department"
                  />
                </div>
                <div className="col-2">
                  <input
                    type="number"
                    max="30"
                    min="0"
                    onChange={(ev: any) => {
                      handleBioData(i, ev.target.name, ev.target.value);
                    }}
                    value={elem.ca}
                    name="ca"
                    placeholder="Ca"
                  />
                </div>
                <div className="col-2">
                  <p className="btn btn-danger" onClick={() => removeRow(i)}>
                    -
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
};

export default BioData;
