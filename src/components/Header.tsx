import React from 'react';
import ksu_logo from '../image/ksu-logo.png';

const Header = () => (
  <header className="d-flex justify-content-center">
    <img src={ksu_logo} alt="logo"/>

    <div>
      <h1>Prince Audu abubakar university, Anyigba</h1>
      <h2>Computer based assessment</h2>
    </div>
  </header>
);

export default Header;