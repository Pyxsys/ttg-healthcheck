import React from 'react';
import {useAuth} from '../context/authContext';

const Dashboard = () => {
  const {user} = useAuth();
  return (
    <div>
      dashboard, user: {user.name}, role: {user.role}
    </div>
  );
};

export default Dashboard;
