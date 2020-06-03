import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from './components/Header';
// import Footer from './components/Footer';
import LoginPage from './components/login/LoginPage';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" component={LoginPage} exact />
        <Route path="/student-login" component={LoginPage} exact />
      </Switch>
    </Router>
  );
}

export default App;
