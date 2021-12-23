// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Col, Row} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';

// Custom
import {DeviceLog, IResponse} from '../types/queries';
import DevicesPageWrapper from './common/devicesPageWrapper';

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
        <div style={{display: 'flex', flexDirection: 'row'}}>
          {column.text}
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
      dataField: 'memory.aggregatedPercentage',
      text: 'Disk',
      sort: true,
    },
    {
      dataField: 'memory.aggregatedPercentage',
      text: 'Disk',
      sort: true,
    },
    {
      dataField: 'network',
      text: 'Network',
      sort: true,
    },
  ];

  return (
    <DevicesPageWrapper>
      <div id="page-wrap" className="h-100 overflow-auto container">
        <Row className="flex-nowrap h-100">
          <Col>
            <div className="devices-table ">
              <BootstrapTable
                keyField="id"
                data={deviceData}
                columns={columns}
                filter={filterFactory()}
                wrapperClasses="table-responsive"
              />
              <div className="d-flex justify-content-end">
                <i
                  className="pe-2 device-icon"
                  role="button"
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                >
                  <BsChevronLeft />
                </i>
                <span className="device-span" >Page {page}</span>
                <i
                  className="ps-2 device-icon"
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
    </DevicesPageWrapper>
  );
};

export default DevicePage;
