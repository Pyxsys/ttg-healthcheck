import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from './context/authContext';
import {ToastContainer} from 'react-toastify';

ReactDOM.render(
    <div className="app">
      <AuthProvider>
        <App />
      </AuthProvider>
      <ToastContainer bodyClassName="h-0" />
    </div>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
