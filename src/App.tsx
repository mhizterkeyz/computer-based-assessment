import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from './components/Header';
// import Footer from './components/Footer';
import LoginPage from './components/login/LoginPage';
import InstructionPage from './components/instruction/InstructionPage';
import QuestionPage from './components/question/QuestionPage';
import CredentialsPage from './components/credentials/CredentialsPage';
import SubmitPage from './components/submit/SubmitPage';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" component={LoginPage} exact />
        <Route path="/student-login" component={LoginPage} />
        <Route path="/exam/credentials" component={CredentialsPage} />
        <Route path="/exam/instruction" component={InstructionPage} />
        <Route path={`/exam/question-${1}`} component={QuestionPage} />
        <Route path={"/exam/submit"} component={SubmitPage} />
      </Switch>
    </Router>
  );
}

export default App;
