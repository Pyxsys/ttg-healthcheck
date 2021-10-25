/* eslint-disable require-jsdoc */
import React from 'react';
import './App.scss';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from './routes/privateRoute';
import Login from './components/login';
import AdminPanel from './components/adminPanel';

function App() {
  return (
    <Router>
      <Route path="/" component={Login}></Route>
      <PrivateRoute
        path="/admin"
        roles={['user', 'admin']}
        component={AdminPanel}
      ></PrivateRoute>
    </Router>
  );
}

export default App;
