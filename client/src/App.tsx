/* eslint-disable require-jsdoc */
import React from 'react';

import {Route} from 'react-router-dom';
import PrivateRoute from './routes/privateRoute';
import Signup from './components/pages/signup';
import Login from './components/pages/login';
import Dashboard from './components/pages/dashboard';
import AdminPanel from './components/pages/adminPanel';
import DevicesTable from './components/pages/devicesTable';
import deviceDetail from './components/pages/deviceDetail';

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
        component={DevicesTable}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path="/device"
        roles={['user', 'admin']}
        component={deviceDetail}
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
