import React, {useEffect} from 'react';
import {useAuth} from '../context/authContext';
import Navbar from './nav';
import {Col, Row} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import axios from 'axios';

const DevicePage = () => {
  const [deviceData, setDeviceData] = useState([]);
  useEffect( () => {
    const lookup = async () => {
      await axios
          .get('api/device').then((response) => {
            if (response.data) {
              setDeviceData(response.data);
            }
          });
    };
    lookup();
  }, []);

  const idFormatter = (cell: {} | null | undefined) => {
    return (
      <>
        <Link to={{pathname: '/device', state: {id: cell}}}>{cell}</Link>
      </>
    );
  };

  /* const columns = [
    {
      dataField: 'id',
      text: 'PID',
      filter: textFilter(),
      formatter: idFormatter,
    },
    {
      dataField: 'location',
      text: 'Location',
      filter: textFilter(),
      sort: true,
    },
    {
      dataField: 'cpu_usage',
      text: 'CPU',
      sort: true,
    },
    {
      dataField: 'memory_usage',
      text: 'Memory',
      sort: true,
    },
    {
      dataField: 'disk_usage',
      text: 'Disk',
      sort: true,
    },
    {
      dataField: 'uptime',
      text: 'Uptime',
      sort: true,
    },
  ]; */

  const columns = [
    {
      dataField: '_id',
      text: 'PID',
      filter: textFilter(),
      formatter: idFormatter,
    },
    {
      dataField: 'name',
      text: 'Name',
      filter: textFilter(),
      sort: true,
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
    },
    {
      dataField: 'hardware',
      text: 'Hardware',
      sort: true,
    },
  ];
  /*
  const fakeData = [
    {
      id: 1,
      location: 'Location 1',
      cpu_usage: '18%',
      memory_usage: '32%',
      disk_usage: '23%',
      uptime: '30 ms',
    },
    {
      id: 2,
      location: 'Location 2',
      cpu_usage: '20%',
      memory_usage: '40%',
      disk_usage: '30%',
      uptime: '40 ms',
    },
    {
      id: 3,
      location: 'Location 3',
      cpu_usage: '20%',
      memory_usage: '40%',
      disk_usage: '30%',
      uptime: '40 ms',
    },
  ];
*/
  const {user} = useAuth();

  return (
    <div>
      <Row className="flex-nowrap h-100">
        <Navbar />
        <Col>
          <div className="">
            user name : {user.name}, role: {user.role}
            <h1 className="text-primary mb-5 mt-5">Devices</h1>
            <BootstrapTable
              keyField="id"
              data={deviceData}
              columns={columns}
              filter={filterFactory()}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DevicePage;
