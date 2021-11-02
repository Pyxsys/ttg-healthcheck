/* eslint-disable require-jsdoc */
import React from 'react';
import './App.scss';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from './routes/privateRoute';
import Login from './components/login';
import Dashboard from './components/dashboard';
import AdminPanel from './components/adminPanel';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Login}></Route>
      <PrivateRoute
        exact
        path="/dashboard"
        roles={['user', 'admin']}
        component={Dashboard}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path="/adminpanel"
        roles={['admin']}
        component={AdminPanel}
      ></PrivateRoute>
    </Router>
  );
}

export default App;
