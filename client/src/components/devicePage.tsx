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
import {useRealTimeService} from '../context/realTimeContext';

const DevicePage = () => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;

  const [deviceData, setDeviceData] = useState([] as DeviceLog[]);
  const [page, setPage] = useState(initialPage);

  const realTimeDataService = useRealTimeService();

  const initialRealTimeData = () => {
    realTimeDataService.getRealTimeData((newDevice) => {
      setDeviceData((prevState) =>
        prevState.map((device) =>
          device.deviceId === newDevice.deviceId ? newDevice : device,
        ),
      );
    });
  };

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
    realTimeDataService.setDeviceIds(deviceIds);
  };

  useEffect(() => {
    initialRealTimeData();
  }, []);

  useEffect(() => {
    queryTable();
  }, [page]);

  /**
   * If the browser window unloads
   * or if the React component unloads
   * clear devices for real time data
   */
  useEffect(() => {
    const clearDevices = () => realTimeDataService.setDeviceIds([]);
    window.addEventListener('beforeunload', clearDevices);
    return () => {
      window.removeEventListener('beforeunload', clearDevices);
      clearDevices();
    };
  }, []);

  const idFormatter = (cell: {} | null | undefined) => {
    return (
      <>
        <Link to={{pathname: '/device', state: {id: cell}}}>{cell}</Link>
      </>
    );
  };

  const uuidFirstHeaderFormatter = (
      column: any,
      colIndex: any,
      {sortElement, filterElement}: any,
  ) => {
    return (
      <div className="devices-first-header-formatter">
        {column.text}
        {filterElement}
        {sortElement}
      </div>
    );
  };

  const uuidHeaderFormatter = (
      column: any,
      colIndex: any,
      {sortElement, filterElement}: any,
  ) => {
    return (
      <div className="devices-table-header-formatter">
        {column.text}
        {filterElement}
        {sortElement}
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
      headerFormatter: uuidFirstHeaderFormatter,
    },
    {
      dataField: 'cpu.aggregatedPercentage',
      text: 'CPU',
      sort: true,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'memory.aggregatedPercentage',
      text: 'Memory',
      sort: true,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'disk.aggregatedPercentage',
      text: 'Disk',
      sort: true,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'network',
      text: 'Network',
      sort: true,
      headerFormatter: uuidHeaderFormatter,
    },
  ];

  return (
    <DevicesPageWrapper>
      <div id="page-wrap" className="h-100 overflow-auto container">
        <Row className="flex-nowrap h-100">
          <Col>
            <div className="devices-table ">
              <BootstrapTable
                striped={true}
                keyField="id"
                data={deviceData}
                columns={columns}
                filter={filterFactory()}
              />
              <div className="d-flex justify-content-end">
                <i
                  className="pe-2 device-icon"
                  role="button"
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                >
                  <BsChevronLeft />
                </i>
                <span className="device-span">Page {page}</span>
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
