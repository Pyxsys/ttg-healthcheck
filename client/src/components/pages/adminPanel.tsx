// 3rd Party
import React from 'react';

// Custom
import {useAuth} from '../../context/authContext';

const AdminPanel = () => {
  const {user} = useAuth();
  return (
    <div>
      admin panel, user: {user.name}, role: {user.role}
    </div>
  );
};

export default AdminPanel;
