import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/authContext';

const DeviceDetailPage = () => {
  // will define interfaces here for each type of data

  const [memoryData, setMemoryData] = useState([]);

  const [wifiData, setWifiData] = useState([]);

  const [cpuData, setCpuData] = useState([]);

  const [diskData, setDiskData] = useState([]);

  const {user} = useAuth();
  return (
    <div>
      dashboard, user: {user.name}, role: {user.role}
    </div>
  );
};

export default DeviceDetailPage;
