import React from "react";
import logo from "../../svg/logo.svg";
import power_icon from "../../svg/settings_power_24px_outlined.svg";
import "./Admin.scss";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    name: "Assessment History",
    url: "/admin/history",
  },
  {
    name: "Running Assessment",
    url: "/admin/running-asssesment",
  },
  {
    name: "Add Assessment",
    url: "/admin/add-asssesment",
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
          <ul className="d-flex">
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
        className="d-flex btn btn-primary text-right mt-3 logout"
        onClick={() => {
          delete localStorage["jwt"];
          delete localStorage["route"];
          window.location.reload();
        }}
      >
        <img src={power_icon} alt="power icon" /> Logout
      </button>
    </>
  );
};

export default Header;
