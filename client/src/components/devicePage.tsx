// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Col, Row} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';

// Custom
import {Device, DeviceLog, IResponse} from '../types/queries';
import {useRealTimeService} from '../context/realTimeContext';
import Navbar from './Navbar';
import PieWheel from './common/pieWheel';
import {SignalStrength, signalText} from './common/signalStrength';
import {TableDevice} from '../types/tables';


const DevicePage = () => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;


  const [deviceTableData, setDeviceTableData] = useState([] as TableDevice[]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const realTimeDataService = useRealTimeService();

  const initialRealTimeData = () => {
    realTimeDataService.getRealTimeData((newDevice) => {
      setDeviceTableData((prevState) =>
        prevState.map((device) => ({
          static: device.static,
          dynamic: device.static.deviceId === newDevice.deviceId ? newDevice : device.dynamic,
        })),
      );
    });
  };

  const queryTable = async () => {
    const skip: number = (page - 1) * pageSize;
    const deviceQuery = {
      params: {
        limit: pageSize,
        skip: skip,
        Total: true,
      },
    };
    const deviceResponse = await axios.get<IResponse<Device>>(
        'api/device',
        deviceQuery,
    );
    const devices = deviceResponse.data.Results;
    const deviceIds = devices.map((device) => device.deviceId);

    const latestDevicesResponse = await axios.get<IResponse<DeviceLog>>(
        'api/device-logs/latest',
        {params: {Ids: deviceIds.join(',')}},
    );
    const latestDevices = latestDevicesResponse.data.Results;

    const tableDevices = devices.map((staticDevice) => ({
      static: staticDevice,
      dynamic: latestDevices.find(
          (device) => device.deviceId === staticDevice.deviceId,
      ),
    }));

    setTotalPages(Math.ceil(deviceResponse.data.Total / pageSize));
    setDeviceTableData(tableDevices);
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

  type cell = any | null | undefined

  const idFormatter = (cell: cell) => {
    return (
      <div className="devices-column-h d-flex justify-content-left align-items-center">
        <div className="devices-uuid-text devices-font">
          <Link
            className="text-white"
            to={{pathname: '/device', state: {id: cell}}}
          >
            {cell}
          </Link>
        </div>
      </div>
    );
  };

  const nameFormatter = (cell: cell) => {
    return (
      <div className="devices-column-h d-flex justify-content-left align-items-center">
        <div className="devices-uuid-text devices-font">
          {cell}
        </div>
      </div>
    );
  };

  const pieUsageFormatter = (cell: cell) => {
    return (
      <div className="d-flex justify-content-end align-items-center">
        <div className="text-truncate devices-font">
          {Number(cell).toFixed(2)}
          {cell ? '%' : ''}
        </div>
        <div className="ps-2 devices-column">
          <PieWheel percentage={Number(cell)} text={false} />
        </div>
      </div>
    );
  };

  const signalStrengthFormatter = (cell: cell) => {
    return (
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-end align-items-center">
          <div className="text-truncate devices-font">
            {signalText(Number(cell))}
          </div>
          <div className="ps-2 devices-column">
            <SignalStrength level={Number(cell)} showText={false} />
          </div>
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
        {sortElement}
        <span className='ps-2'>{filterElement}</span>
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
        {sortElement}
      </div>
    );
  };

  const columns = [
    {
      dataField: 'static.deviceId',
      text: 'UUID',
      filter: textFilter({
        placeholder: 'Filter by UUID...',
      }),
      sort: true,
      formatter: idFormatter,
      headerFormatter: uuidFirstHeaderFormatter,
    },
    {
      dataField: 'static.name',
      text: 'Name',
      sort: true,
      formatter: nameFormatter,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'dynamic.cpu.aggregatedPercentage',
      text: 'CPU',
      sort: true,
      formatter: pieUsageFormatter,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'dynamic.memory.aggregatedPercentage',
      text: 'Memory',
      sort: true,
      formatter: pieUsageFormatter,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'dynamic.disk.aggregatedPercentage',
      text: 'Disk',
      sort: true,
      formatter: pieUsageFormatter,
      headerFormatter: uuidHeaderFormatter,
    },
    {
      dataField: 'dynamic.wifi.signalStrength',
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
                  keyField="static.deviceId"
                  data={deviceTableData}
                  columns={columns}
                  filter={filterFactory()}
                  sort={{dataField: 'static.deviceId', order: 'desc'}}
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
                    onClick={() => setPage(page < totalPages ? page + 1 : page)}
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
