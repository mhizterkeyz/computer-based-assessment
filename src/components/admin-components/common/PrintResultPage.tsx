import React from "react";
import { connect } from "react-redux";

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
