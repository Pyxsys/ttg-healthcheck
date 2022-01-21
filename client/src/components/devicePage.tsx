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
import {useRealTimeService} from '../context/realTimeContext';
import Navbar from './Navbar';
import PieWheel from './common/pieWheel';
import SignalStrength from './common/signalStrength';

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

  const pieUsageFormatter = (cell: {} | null | undefined) => {
    return (
      <div className="d-flex w-50 justify-content-center align-items-center">
        <div className="w-40">{cell}</div>
        <div className="ps-2 w-60">
          <PieWheel percentage={Number(cell)} text={true} />
        </div>
      </div>
    );
  };

  const signalStrengthFormatter = (cell: {} | null | undefined) => {
    return (
      <div className="d-flex w-50 justify-content-center align-items-center">
        <div className="w-40">{cell}</div>
        <div className="ps-2 w-60">
          <SignalStrength level={Number(cell)} showText={true} />
        </div>
      </div>
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
      formatter: pieUsageFormatter,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'memory.aggregatedPercentage',
      text: 'Memory',
      sort: true,
      formatter: pieUsageFormatter,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'disk.aggregatedPercentage',
      text: 'Disk',
      sort: true,
      formatter: pieUsageFormatter,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'wifi.signalStrength',
      text: 'Network',
      sort: true,
      formatter: signalStrengthFormatter,
      headerFormatter: uuidHeaderFormatter,
    },
  ];

  return (
    <div className="h-100 d-flex flex-column">
      <div id="outer-container">
        <Navbar />
      </div>

      <div className="flex-grow-1 d-flex flex-column align-items-center devices-content">
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
      </div>
      <div className="d-flex justify-content-center devices-footer">
        <div className="pt-1 pb-3 devices-copyright">
          &#169; SOEN490 TTG-HEALTCHECK
        </div>
      </div>
    </div>
  );
};

export default DevicePage;
