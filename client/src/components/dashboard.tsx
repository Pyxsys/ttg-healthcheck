import React from 'react';
import Navbar from './nav';

const Dashboard = () => {
  return (
    <div id="outer-container">
      <Navbar />
      <div id="page-wrap" className="h-100 overflow-auto container">
        dashboard
      </div>
    </div>
  );
};

export default Dashboard;
