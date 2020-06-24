import React, { useEffect } from "react";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import StudentLoginPage from "./components/student-login/StudentLoginPage";
import InstructionPage from "./components/instruction/InstructionPage";
import QuestionPage from "./components/question/QuestionPage";
import CredentialsPage from "./components/credentials/CredentialsPage";
import SubmitPage from "./components/submit/SubmitPage";
import Administrator from "./components/admin-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import { student as studentInterface } from "./components/model/student";
import { verifyStudent } from "./redux/actions/studentAction";

function App({
  student,
  verifyStudent,
}: {
  student: studentInterface;
  verifyStudent: () => Promise<any>;
}) {
  useEffect(() => {
    if (Object.keys(student).length < 1) {
      verifyStudent();
    }
  }, [verifyStudent, student]);

  if (Object.keys(student).length < 1) {
    /**
     * This is just some make shift
     * loading screen so that the
     * app doesn't flicker between
     * login screen and where you
     * want to go anytime you're logged in
     * and reload the page
     */
    return (
      <Router>
        <Route
          render={() => {
            return <></>;
          }}
        />
      </Router>
    );
  }

  if (!student.hasOwnProperty("matric") || student.matric === "") {
    return (
      <Router>
        <Switch>
          <Route path="/admin" component={Administrator} />
          <Route to="/student-login" render={() => <StudentLoginPage />} />
        </Switch>
      </Router>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/admin" component={Administrator} />
        <Route path="/exam/instruction" component={InstructionPage} />
        <Route path={"/exam/submit"} component={SubmitPage} />
        <Route path="/exam/:question" component={QuestionPage} />
        <Route
          path="/exam"
          render={(routeProps) => <QuestionPage {...routeProps} />}
        />
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
      </Switch>
      <ToastContainer hideProgressBar={true} autoClose={3000} />
    </Router>
  );
}

function mapStateToProps(state: any) {
  return {
    student: state.student,
    // loading: state.apiCallsInProgress > 0,
  };
}

const mapDispatchToProps = {
  verifyStudent,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
