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
import AnalyticsPage from './components/pages/analyticsPage';
import UserProfile from './components/pages/userProfile';
import Pending from './components/pages/pending';
import UserLogs from './components/pages/userLogs';
import ForgotPassword from './components/pages/forgotPassword';
import ResetPassword from './components/pages/resetPassword';

function App() {
  return (
    <>
      <Route exact path="/" component={Login}></Route>
      <Route exact path="/signup" component={Signup}></Route>
      <Route exact path="/forgot-password" component={ForgotPassword}></Route>
      <Route exact path="/reset-password" component={ResetPassword}></Route>
      <PrivateRoute
        exact
        path="/pending"
        roles={['disabled']}
        component={Pending}
      ></PrivateRoute>
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
        path="/analytics"
        roles={['user', 'admin']}
        component={AnalyticsPage}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path="/admin"
        roles={['admin']}
        component={AdminPanel}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path="/user-profile"
        roles={['user', 'admin']}
        component={UserProfile}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path="/user-logs"
        roles={['user', 'admin']}
        component={UserLogs}
      ></PrivateRoute>
    </>
  );
}

export default App;
