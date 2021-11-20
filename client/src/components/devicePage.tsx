// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Col, Row, Table} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';

// Custom
import Navbar from './Navbar';
import {IResponse} from '../types/common';
import {CpuLog, MemoryLog} from '../types/queries';
import {DevicesColumns} from '../types/tables';


const DevicePage = () => {
  const [deviceData, setDeviceData] = useState([] as DevicesColumns[]);

  const queryTable = async () => {
    // Query log information from year 2020 to today
    // We should change this so we do not query 1000's of records
    const timestampParams = {
      startTimeStamp: new Date('2020'),
      endTimeStamp: new Date(),
    };

    const deviceResponse = await axios.get<IResponse<string>>('api/device/ids');
    const deviceIds = deviceResponse.data.Results;

    const cpuResponse = await axios.get<IResponse<CpuLog>>('api/cpu-logs/timestamp', {params: timestampParams});
    const cpuUsages = cpuResponse.data.Results;

    const memoryResponse = await axios.get<IResponse<MemoryLog>>('api/memory-logs/timestamp', {params: timestampParams});
    const memoryUsages = memoryResponse.data.Results;

    const device: DevicesColumns[] = deviceIds.map((id) => {
      const cpu = cpuUsages?.find((cpuUsage) => cpuUsage?.deviceId == id);
      const mem = memoryUsages?.find((memoryUsage) => memoryUsage?.deviceId == id);
      return {
        id: id,
        cpuUsage: cpu?.usagePercentage as number,
        memoryUsage: mem?.usagePercentage as number,
        uptime: cpu?.uptime as number,
      };
    });
    setDeviceData(device);
  };

  useEffect(() => {
    queryTable();
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
