import React from "react";
import { connect } from "react-redux";
// @ts-ignore
import Workbook from "react-excel-workbook";
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// import ReactExport from "react-export-excel";

const Result = ({
  name,
  matric,
  level,
  department,
  faculty,
  ca,
  exam,
}: any) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{matric}</td>
      <td>{level}</td>
      <td>{department}</td>
      <td>{faculty}</td>
      <td>{ca}</td>
      <td>{exam}</td>
      <td>{ca + exam}</td>
    </tr>
  );
};

const PrintResult = ({ results }: any) => {
  console.log(results);
  const data1 = [
    {
      foo: "123",
      bar: "456",
      baz: "789",
    },
    {
      foo: "abc",
      bar: "dfg",
      baz: "hij",
    },
    {
      foo: "aaa",
      bar: "bbb",
      baz: "ccc",
    },
  ];

  return (
    <section className="assessment-result">
      <div>
        <button
          className="btn btn-primary d-print-none"
          onClick={() => window.print()}
        >
          Print
        </button>
        <h2 className="text-center  assessment-result__title">
          GST 101 - USE OF ENGLISH
        </h2>
      </div>
      <div className="row text-center" style={{ marginTop: "100px" }}>
        <Workbook
          filename={"Use of English.xlsx"}
          element={<button className="btn btn-lg btn-primary">Try me!</button>}
        >
          <Workbook.Sheet data={Object.values(results)} name="Sheet A">
            <Workbook.Column label="Name" value="name" />
            <Workbook.Column label="Matric No." value="matric" />
            <Workbook.Column label="Level" value="level" />
            <Workbook.Column label="Department" value="department" />
            <Workbook.Column label="Faculty" value="faculty" />
            <Workbook.Column label="CA Score" value="ca" />
            <Workbook.Column label="Examination" value="exam" />
          </Workbook.Sheet>
          {/* <Workbook.Sheet data={data2} name="Another sheet">
            <Workbook.Column label="Double aaa" value={(row) => row.aaa * 2} />
            <Workbook.Column
              label="Cubed ccc "
              value={(row) => Math.pow(row.ccc, 3)}
            />
          </Workbook.Sheet> */}
        </Workbook>
      </div>
      <hr className="mb-5 assessment-pin__horizontal-rule" />

      <table className="assessment-result__result-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>MATRIC.NO</th>
            <th>LEVEL</th>
            <th>DEPARTMENT</th>
            <th>FACULTY</th>
            <th>CA</th>
            <th>EXAMINATION</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(results).map((result: any, index: number) => (
            <Result {...result} key={index} />
          ))}
          {/* <tr>
            <td>Alikali Ojonugwa Justice</td>
            <td>13MS1023</td>
            <td>200</td>
            <td>Mathematical Sciences</td>
            <td>Natural Sciences</td>
            <td>27</td>
            <td>55</td>
            <td>82</td>
          </tr> */}
        </tbody>
      </table>
    </section>
  );
};

function mapStateToProps(state: any) {
  return {
    results: state.results,
  };
}

export default connect(mapStateToProps)(PrintResult);
