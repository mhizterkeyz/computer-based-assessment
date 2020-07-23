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
import Preloader from "../../Preloader";
import Assessment from "./Assessment";
// import LiveUpdater from "./LiveUpdater";

const Index = ({ administrator, VerifyAdministrator, ...props }: any) => {
  useEffect(() => {
    if (administrator.loggeIn) {
      props.history.push("/admin/exams");
      return () => {};
    }
    if (!administrator.loaded) {
      VerifyAdministrator();
    }
  }, [VerifyAdministrator, administrator, props.history]);
  if (!administrator.loaded) {
    return <Preloader />;
  }
  if (!administrator.loggedIn) {
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
        <Route path={"/admin/settings"} component={SettingsPage} />
        <Route path={"/admin/faculty-depts"} component={FacultyPage} />
        <Route path={"/admin/print-pin"} component={PrintPin} />
        <Route path={"/admin/print-result"} component={PrintResult} />
        <Route path={"/admin/new-assessment"} component={NewAssessment} />
        <Route path={"/admin/exams/:id"} component={Assessment}></Route>
        <Route path={"/admin/exams"} component={AssessmentHistory} />
        <Route component={AssessmentHistory} />
      </Switch>
      {/* <LiveUpdater></LiveUpdater> */}
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
