import React from "react";
import logo from "../../../svg/logo.svg";
import "./Admin.scss";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    name: `Add\xa0Assessment`,
    url: "/admin/add-assessment",
  },
  {
    name: "Assessment\xa0List",
    url: "/admin",
  },
  {
    name: "Running\xa0Assessment",
    url: "/admin/running-asssesment",
  },

  {
    name: "Faculties\xa0&\xa0Departments",
    url: "/admin/faculty-depts",
  },
  {
    name: "Settings",
    url: "/admin/settings",
  },
];

const Navigation = (props: { name: string; url: string }) => {
  return (
    <li>
      <NavLink to={props.url} activeClassName={"active"}>
        {props.name}
      </NavLink>
    </li>
  );
};

const Header = () => {
  return (
    <>
      <header className="d-flex justify-content-between align-items-center">
        <img src={logo} alt="site logo" />

        <nav>
          <ul className="d-flex d-print-none">
            {navItems.map((item, index) => (
              <Navigation
                {...item}
                key={`head_${Math.floor(Math.random() * 1000000) * index}`}
              />
            ))}
          </ul>
        </nav>
      </header>

      <button
        className="d-flex align-items-center btn btn-primary text-right mt-3 d-print-none logout"
        onClick={() => {
          delete localStorage["jwt"];
          delete localStorage["route"];
          window.location.reload();
        }}
      >
        <i className="icon-settings_power_24px_outlined" /> Logout
      </button>
    </>
  );
};

export default Header;
