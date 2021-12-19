// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Col, Row} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';

// Custom
import Navbar from './Navbar';
import {DeviceLog, IResponse} from '../types/queries';

const DevicePage = () => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;

  const [deviceData, setDeviceData] = useState([] as DeviceLog[]);
  const [page, setPage] = useState(initialPage);

  const queryTable = async () => {
    const skip: number = (page - 1) * pageSize;
    const deviceIdQuery = {
      params: {
        limit: pageSize,
        skip: skip,
      },
    };
    const deviceResponse = await axios.get<IResponse<string>>(
        'api/device/ids',
        deviceIdQuery,
    );
    const deviceIds = deviceResponse.data.Results;

    const latestDevicesResponse = await axios.get<IResponse<DeviceLog>>(
        'api/device-logs/latest',
        {params: {Ids: deviceIds.join(',')}},
    );
    const latestDevices = latestDevicesResponse.data.Results;

    setDeviceData(latestDevices);
  };

  useEffect(() => {
    queryTable();
  }, [page]);

  const idFormatter = (cell: {} | null | undefined) => {
    return (
      <>
        <Link to={{pathname: '/device', state: {id: cell}}}>{cell}</Link>
      </>
    );
  };

  const uuidHeaderFormatter = (
      column: any,
      colIndex: any,
      {sortElement, filterElement}: any,
  ) => {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {column.text}
        <div style={{display: 'flex', flexDirection: 'row'}}>
          {filterElement}
          {sortElement}
        </div>
      </div>
    );
  };

  const columns = [
    {
      dataField: 'deviceId',
      text: 'UUID',
      filter: textFilter({
        placeholder: 'Filter by UUID...',
      }),
      sort: true,
      formatter: idFormatter,
      headerFormatter: uuidHeaderFormatter,
    },

    {
      dataField: 'cpu.aggregatedPercentage',
      text: 'CPU',
      sort: true,
    },
    {
      dataField: 'memory.aggregatedPercentage',
      text: 'Memory',
      sort: true,
    },

    {
      dataField: 'timestamp',
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
              <BootstrapTable
                keyField="id"
                data={deviceData}
                columns={columns}
                filter={filterFactory()}
                wrapperClasses="table-responsive"
              />
              <h4>Change Page</h4>
              <div className="d-flex align-items-center">
                <i
                  className="pe-2"
                  role="button"
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                >
                  <BsChevronLeft />
                </i>
                <span>Page {page}</span>
                <i
                  className="ps-2"
                  role="button"
                  onClick={() => setPage(page + 1)}
                >
                  <BsChevronRight />
                </i>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DevicePage;
