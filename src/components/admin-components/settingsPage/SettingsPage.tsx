import React from "react";
import delete_icon from "../../../svg/delete_sweep_24px_outlined.svg";

const Button = ({ name, class: cssClass }: any) => {
  return (
    <button className={"btn btn-primary settings-btn " + cssClass}>
      {name.key} <br />
      <span>{name.value}</span>
    </button>
  );
};

const Admin = () => {
  return (
    <div className="dta-body">
      <span className="">Ojonugwa Alikali</span>
      <span className="">admin</span>
      <span className="">admin@mail.com</span>
      <button>
        <img src={delete_icon} alt="delete icon" />
      </button>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <section className="settings">
      <Button class="button1" name={{ key: "PIN", value: "Generate pin" }} />
      <Button
        class="button2"
        name={{ key: "PASSWORD", value: "Change password" }}
      />

      <div className="admin-list">
        <h3>View Admin</h3>
        <div className="d-flex">
          <div className="dta-head ">
            <span className="">Name</span>
            <span className="">Username</span>
            <span className="">Email</span>
          </div>
          <button className="btn btn-primary ml-3 add-admin">Add Admin</button>
        </div>

        <Admin />
        <Admin />
        <Admin />
        <Admin />
      </div>
    </section>
  );
};

export default SettingsPage;
