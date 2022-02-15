/* eslint-disable require-jsdoc */
import React from 'react';
import './App.scss';
import {Route} from 'react-router-dom';
import PrivateRoute from './routes/privateRoute';
import Login from './components/login';
import Dashboard from './components/dashboardPage';
import AdminPanel from './components/adminPanel';
import Signup from './components/signup';
import DevicePage from './components/devicePage';
import deviceDetailPage from './components/deviceDetailPage';

function App() {
  return (
    <>
      <Route exact path="/" component={Login}></Route>
      <Route exact path="/signup" component={Signup}></Route>
      <PrivateRoute
        exact
        path="/dashboard"
        roles={['user', 'admin']}
        component={Dashboard}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path="/devices"
        roles={['user', 'admin']}
        component={DevicePage}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path="/device"
        roles={['user', 'admin']}
        component={deviceDetailPage}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path="/adminpanel"
        roles={['admin']}
        component={AdminPanel}
      ></PrivateRoute>
    </>
  );
}

export default App;
