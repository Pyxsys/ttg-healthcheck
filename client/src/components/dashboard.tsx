// 3rd Party
import React from 'react';

// Custom
import Navbar from './Navbar';

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
