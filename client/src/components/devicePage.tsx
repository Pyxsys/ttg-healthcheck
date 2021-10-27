import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/authContext';

const DevicePage = () => {
  interface Device {
    _id: string
    location: string
    CPU: number
    memory: number
    disk: number
    uptime: number
  }

  const [deviceData, setDeviceData] = useState([]);

  const {user} = useAuth();
  return (
    <div>
      dashboard, user: {user.name}, role: {user.role}
    </div>
  );
};

export default DevicePage;
