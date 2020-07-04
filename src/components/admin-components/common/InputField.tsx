import React from "react";

export const TextField = (props: any) => (
  <div className={props.class ? "mb-4 " + props.class : "mb-4"}>
    <label htmlFor="" className="profile__label">
      {props.label}
    </label>
    <input
      type={props.type || "text"}
      value={props.value}
      name={props.name}
      className="profile__input"
      placeholder={props.placeholder}
      onChange={props.handleInputs}
    />
  </div>
);

export const NumberField = (props: any) => (
  <div className={props.class ? "mb-4 " + props.class : "mb-4"}>
    <label htmlFor={props.name} className="profile__label">
      {props.label}
    </label>
    <input
      type="number"
      className="profile__input"
      name={props.name}
      onChange={props.handleInputs}
    />
  </div>
);

export const EmailField = (props: any) => (
  <div className={props.class ? "mb-4 " + props.class : "mb-4"}>
    <label htmlFor="" className="profile__label">
      {props.label}
    </label>
    <input
      type="email"
      value={props.value}
      className="profile__input"
      name={props.name}
      placeholder={props.placeholder}
      onChange={props.handleInputs}
    />
  </div>
);

export const SelectField = (props: any) => (
  <div className={props.class ? "mb-4 " + props.class : "mb-4"}>
    <label htmlFor="" className="profile__label">
      {props.label}
    </label>
    <select
      className="profile__select profile__select--placeholder "
      disabled={props.isDisabled ? true : false}
      name={props.name}
      onChange={props.handleInputs}
      value={props.value}
    >
      <option>Select {props.name}</option>
      {props.options.length > 0 ? (
        props.options.map((val: string, index: number) => (
          <option key={index}>{val}</option>
        ))
      ) : (
        <>
          <option>No assigned Department</option>
        </>
      )}
    </select>
  </div>
);

export const PasswordField = (props: any) => (
  <div className={props.class ? "mb-4 " + props.class : "mb-4"}>
    <label htmlFor="" className="profile__label">
      {props.label}
    </label>
    <input
      type="password"
      placeholder={props.placeholder}
      name={props.name}
      className="profile__input"
      onChange={props.handleInputs}
    />
  </div>
);
