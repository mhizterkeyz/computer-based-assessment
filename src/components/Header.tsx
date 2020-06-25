import React from 'react';
import ksu_logo from '../image/ksu-logo.png';

const Header = () => (
  <header className="d-flex justify-content-center">
    <div className="d-flex align-items-center">
      <img src={ksu_logo} alt="logo"  className="mr-3"/>

      <div>
        <h1>Prince Abubakar Audu university, Anyigba</h1>
        <h2>Computer based assessment</h2>
      </div>
    </div>
  </header>
);

export default Header;