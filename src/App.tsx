import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/login/LoginPage';

function App() {
  return (
    <>
      <LoginPage />
    </>
  );
}

export default App;
