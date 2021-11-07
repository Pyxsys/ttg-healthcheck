import React, {useEffect, useState} from 'react';
import Navbar from './nav';
import {Col, Row, Table} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {Link} from 'react-router-dom';
import axios from 'axios';

interface Device {
  id: string
  // location should go here
  cpuUsage: number
  memoryUsage: number
  // diskUsage should go here
  uptime: number
}

interface CpuLog {
  deviceId: string
  usagePercentage: number
  usageSpeed: number
  numProcesses: number
  threadsAlive: number
  threadsSleeping: number
  uptime: number
  timestamp: Date
}

interface MemoryLog {
  deviceId: string
  usagePercentage: number
  inUse: number
  available: number
  cached: number
  pagedPool: number
  nonPagedPool: number
  timestamp: Date
}
interface IdLog {
  _id: string
  deviceId: string
}

const DevicePage = () => {
  const [deviceData, setDeviceData] = useState([] as Device[]);
  let cpuData: CpuLog[];
  let memData: MemoryLog[];
  let idData: IdLog[];

  useEffect(() => {
    const lookup = async () => {
      await axios.get('api/device/ids').then((response) => {
        if (response.data) {
          idData = response.data;
        }
      });
      await axios
          .get('api/cpu-logs/timestamp', {
            params: {
              startTimeStamp: new Date(Date.now() - 2000000000),
              endTimeStamp: Date.now(),
            },
          })
          .then((response) => {
            if (response.data) {
              cpuData = response.data;
            }
          });
      await axios
          .get('api/memory-logs/timestamp', {
            params: {
              startTimeStamp: new Date(Date.now() - 2000000000),
              endTimeStamp: Date.now(),
            },
          })
          .then((response) => {
            if (response.data) {
              memData = response.data;
            }
          });

      const tempDeviceData: Device[] = [];
      idData.forEach((e) => {
        const id = e.deviceId;
        const device: Device = {
          id: id,
          cpuUsage: cpuData?.find((l) => l?.deviceId == id)
              ?.usagePercentage as number,
          memoryUsage: memData?.find((l) => l?.deviceId == id)
              ?.usagePercentage as number,
          uptime: cpuData?.find((l) => l?.deviceId == id)?.uptime as number,
        };
        tempDeviceData.push(device);
      });
      setDeviceData(tempDeviceData);
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

  const columns = [
    {
      dataField: 'id',
      text: 'PID',
      filter: textFilter(),
      formatter: idFormatter,
    },

    {
      dataField: 'cpuUsage',
      text: 'CPU',
      sort: true,
    },
    {
      dataField: 'memoryUsage',
      text: 'Memory',
      sort: true,
    },

    {
      dataField: 'uptime',
      text: 'Uptime',
      sort: true,
    },
  ];

  return (
    <div id="outer-container">
      <Navbar />
      <div id="page-wrap" className="h-100 overflow-auto container">
        <Row className="flex-nowrap h-100">
          <Col>
            <div className="">
              <h1 className="text-primary mb-5 mt-5">Devices</h1>
              <Table responsive>
                <BootstrapTable
                  keyField="id"
                  data={deviceData}
                  columns={columns}
                  filter={filterFactory()}
                  wrapperClasses="table-responsive"
                />
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DevicePage;
