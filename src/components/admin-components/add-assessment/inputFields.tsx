import React from "react";

export const durationField = (props: any) => (
  <div className="align-items-center col-6 grid-group">
    <label htmlFor="duration">Duration:</label>

    <div>
      <input
        type="number"
        name="dur1"
        onChange={props.onChange}
        value={props.dur1}
        placeholder="00"
      />
      <span>mins</span>
      <input
        type="number"
        name="dur2"
        placeholder="00"
        onChange={props.onChange}
        value={props.dur2}
        className="scnd"
      />
      <span>secs</span>
    </div>
  </div>
);

export const regularInput = (props: any) => (
  <div
    className={
      `align-items-center col-6 ${
        props.className && props.className.indexOf("grid-group") !== -1
          ? ""
          : "grid-group"
      } ` + props.className
    }
  >
    <label htmlFor={props.htmlFor}>{props.label}</label>

    <div>
      <input style={{ width: "100%" }} {...props.input} />
    </div>
  </div>
);
