import React from 'react';
import Navbar from './nav';
import {Col, Row} from 'react-bootstrap';
import {useAuth} from '../context/authContext';

const DeviceDetailPage = (props: any) => {
  // will define interfaces here for each type of data

  /*
  const [memoryData, setMemoryData] = useState([]);

  const [wifiData, setWifiData] = useState([]);

  const [cpuData, setCpuData] = useState([]);

  const [diskData, setDiskData] = useState([]);
  */

  const {user} = useAuth();

  return (
    <div>
      <Row className="h-100">
        <Navbar />
        <Col>
          <div className="">
            device detail page, user: {user.name}, role: {user.role}
            device id:{props.location.state.id}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DeviceDetailPage;
