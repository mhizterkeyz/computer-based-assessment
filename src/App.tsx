import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { verify_login } from "./api/calls";

import Header from "./components/Header";
// import Footer from './components/Footer';
import LoginPage from "./components/login/LoginPage";
import InstructionPage from "./components/instruction/InstructionPage";
import QuestionPage from "./components/question/QuestionPage";
import CredentialsPage from "./components/credentials/CredentialsPage";

function App() {
  const [user, setUser] = useState({
    matric: "",
    name: "",
    faculty: "",
    department: "",
  });

  useEffect(() => {
    (async (setUser) => {
      try {
        const user = await verify_login();
        setUser(user);
      } catch (e) {
        //TODO: do a better job of error handling.
        console.log(e);
      }
    })(setUser);
  }, []);

  const handleUser = (userData: any) => setUser({ ...user, ...userData });

  if (!user.matric) return <LoginPage handleLogin={handleUser} />;
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/exam/instruction" component={InstructionPage} />
        <Route path={`/exam/question-${1}`} component={QuestionPage} />
        <Route
          render={(routeProps) => (
            <CredentialsPage
              {...routeProps}
              user={{
                matric: user.matric,
                name: user.name,
                faculty: user.faculty,
                department: user.department,
              }}
            />
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;
