import React, { useEffect } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";

import Login from "./login/Login";
import Assessment from "./assessment/Assessment";
import AssessmentHistory from "./assessment-history/AssessmentHistory";
import AddAssessment from "./add-assessment/AddAssessment";
import { VerifyAdministrator } from "../../redux/actions/AdministratorActions";
import Header from "./Header";
import SettingsPage from "./settingsPage/SettingsPage";

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
    return <Route component={Login} />;
  }

  return (
    <Router>
      <Header />
      <Switch>
        <Route path={"/admin/asssesment"} component={Assessment} />
        <Route
          path={"/admin/history"}
          component={AssessmentHistory}
        />
        <Route
          path={"/admin/settings"}
          component={SettingsPage}
        />
        <Route component={AddAssessment} />
      </Switch>
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
