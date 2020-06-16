import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
// import Footer from './components/Footer';
import StudentLoginPage from "./components/student-login/StudentLoginPage";
import InstructionPage from "./components/instruction/InstructionPage";
import QuestionPage from "./components/question/QuestionPage";
import CredentialsPage from "./components/credentials/CredentialsPage";
import SubmitPage from "./components/submit/SubmitPage";
import Login from "./components/admin-components/login/Login";
import Assessment from "./components/admin-components/assessment/Assessment";
import AssessmentHistory from "./components/admin-components/assessment-history/AssessmentHistory";
import AddAssessment from "./components/admin-components/add-assessment/AddAssessment";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={StudentLoginPage} exact />
        <Route path="/student-login" component={StudentLoginPage} />
        <Route path="/exam/credentials" component={CredentialsPage} />
        <Route path="/exam/instruction" component={InstructionPage} />
        <Route path={`/exam/question-${1}`} component={QuestionPage} />
        <Route path={"/exam/submit"} component={SubmitPage} />
        <Route path={"/admin/login"} component={Login} />
        <Route path={"/admin/asssesment"} component={Assessment} />
        <Route
          path={"/admin/asssesment-history"}
          component={AssessmentHistory}
        />
        <Route path={"/admin/add-asssesment"} component={AddAssessment} />
      </Switch>
    </Router>
  );
}

export default App;
