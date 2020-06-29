import React from "react";

export const TextField = (props: any) => (
  <div className="mb-4">
    <label htmlFor="" className="profile__label">
      {props.label}
    </label>
    <input
      type="text"
      value={props.value}
      name={props.name}
      className="profile__input"
      placeholder={props.placeholder}
      onChange={props.handleInputs}
    />
  </div>
);

export const NumberField = (props: any) => (
  <div className="mb-4">
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
  <div className="mb-4">
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

export const PasswordField = (props: any) => (
  <div className={"mb-4 " + props.class}>
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
