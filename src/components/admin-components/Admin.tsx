import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from './login/Login';

const Admin = () => {
  // const history = useHistory();
  return (
    <Router>
      <Switch>
        <Route path="admin/login" component={Login} />
      </Switch>
    </Router>
  );
};

export default Admin;