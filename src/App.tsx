import React from "react";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import StudentLoginPage from "./components/student-login/StudentLoginPage";
import InstructionPage from "./components/instruction/InstructionPage";
import QuestionPage from "./components/question/QuestionPage";
import CredentialsPage from "./components/credentials/CredentialsPage";
import SubmitPage from "./components/submit/SubmitPage";
import Login from "./components/admin-components/login/Login";
import Assessment from "./components/admin-components/assessment/Assessment";
import AssessmentHistory from "./components/admin-components/assessment-history/AssessmentHistory";
import AddAssessment from "./components/admin-components/add-assessment/AddAssessment";

import Header from "./components/Header";
import { student as studentInterface } from "./components/model/student";

function App({ student }: { student: studentInterface }) {
  if (!student.matric)
    return (
      <Router>
        <Switch>
          <Route to="/student-login" render={() => <StudentLoginPage />} />
        </Switch>
      </Router>
    );

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/exam/instruction" component={InstructionPage} />
        <Route path={`/exam/question-${1}`} component={QuestionPage} />
        <Route path={"/exam/submit"} component={SubmitPage} />
        <Route
          render={() => (
            <CredentialsPage
              name={student.name}
              matric_no={student.matric}
              department={student.department}
              faculty={student.faculty}
            />
          )}
        />
        {/* <Route path={"/admin/login"} component={Login} />
        <Route path={"/admin/asssesment"} component={Assessment} />
        <Route path={"/admin/asssesment-history"} component={AssessmentHistory} />
        <Route path={"/admin/add-asssesment"} component={AddAssessment} /> */}
      </Switch>
    </Router>
  );
}

function mapStateToProps(state: any) {
  return {
    student: state.student,
    // loading: state.apiCallsInProgress > 0,
  };
}

export default connect(mapStateToProps)(App);
