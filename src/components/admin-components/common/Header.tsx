import React from "react";
import logo from "../../../svg/logo.svg";
import "./Admin.scss";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    name: `New\xa0Assessment`,
    url: "/admin/new-assessment",
  },
  {
    name: "Assessment\xa0List",
    url: "/admin/exams",
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
    name: "check-in",
    url: "/admin/settings",
  },
  {
    name: "Settings",
    url: "/admin/settings",
  },
];

const Navigation = (props: {
  name: string;
  url: string;
  exact?: boolean | undefined;
}) => {
  return (
    <li>
      <NavLink exact={props.exact} to={props.url} activeClassName={"active"}>
        {props.name}
      </NavLink>
    </li>
  );
};

const Header = (props: any) => {
  return (
    <>
      <header className="d-flex justify-content-between align-items-center">
        <img src={logo} alt="site logo" />

        <nav>
          <ul className="d-flex d-print-none align-items-center">
            {navItems.map((item, index) => (
              <Navigation
                {...item}
                {...props}
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
        style={{
          fontWeight: 500,
          fontSize: 14,
          borderRadius: 15
        }}
      >
        <i className="icon-logout mr-2"/>Logout
      </button>
    </>
  );
};

export default Header;
