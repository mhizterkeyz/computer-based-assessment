import React from "react";
import { connect } from "react-redux";

const Pin = ({ pin }: any) => {
  return <span className="col-3 assessment-pin__value">{pin.pin}</span>;
};

const PrintPin = ({ pin }: any) => {
  return (
    <section className="assessment-pin">
      <div>
        <button
          className="btn btn-primary d-print-none"
          onClick={() => window.print()}
        >
          Print
        </button>
        <h2 className="text-center  assessment-pin__title">Assessment pin</h2>
      </div>
      <hr className="assessment-pin__horizontal-rule" />

      <div className="assessment-pin__pin-section">
        {Object.values(pin).map((pinObj, index) => {
          return <Pin pin={pinObj} key={index} />;
        })}
      </div>

      <hr className="assessment-pin__horizontal-rule" />
    </section>
  );
};

function mapStateToProps(state: any) {
  return {
    pin: state.pin,
  };
}

export default connect(mapStateToProps)(PrintPin);
