import React, { useEffect } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";

import Login from "../login/Login";
import RunningAssessment from "../running-assessment/RunningAssessment";
import AssessmentHistory from "../assessment-history/AssessmentHistory";
// import AddAssessment from "../add-assessment/AddAssessment";
import { VerifyAdministrator } from "../../../redux/actions/AdministratorActions";
import Header from "./Header";
import SettingsPage from "../settingsPage/SettingsPage";
import PrintPin from "./PrintPinPage";
import PrintResult from "./PrintResultPage";
import FacultyPage from "../FacultyPage/FacultyPage";
import NewAssessment from "../add-assessment/NewAssessment";

const Index = ({ administrator, VerifyAdministrator }: any) => {
  useEffect(() => {
    if (Object.keys(administrator).length < 1) {
      VerifyAdministrator();
    }
  }, [VerifyAdministrator, administrator]);

  if (Object.keys(administrator).length < 1) {
    /**
     * This is just some make shift
     * loading screen so that the
     * app doesn't flicker between
     * login screen and where you
     * want to go anytime you're logged in
     * and reload the page
     */
    return (
      <Route
        render={() => {
          return <></>;
        }}
      />
    );
  }
  if (
    !administrator.hasOwnProperty("username") ||
    administrator.username === ""
  ) {
    return (
      <>
        <Route component={Login} />
        <ToastContainer autoClose={3000} hideProgressBar={true} />
      </>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        <Route
          path={"/admin/running-asssesment"}
          component={RunningAssessment}
        />
        <Route path={"/admin/add-assessment"} component={NewAssessment} />
        <Route path={"/admin/settings"} component={SettingsPage} />
        <Route path={"/admin/faculty-depts"} component={FacultyPage} />
        <Route path={"/admin/print-pin"} component={PrintPin} />
        <Route path={"/admin/print-result"} component={PrintResult} />
        <Route path={"/admin/new-assessment"} component={NewAssessment} />
        <Route component={AssessmentHistory} />
      </Switch>
      <ToastContainer autoClose={3000} hideProgressBar={true} />
    </Router>
  );
};

const mapStateToProps = (state: any) => ({
  administrator: state.administrator,
  busy: state.apiCallsInProgress > 0,
});

const mapDispatchToProps = {
  VerifyAdministrator,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
