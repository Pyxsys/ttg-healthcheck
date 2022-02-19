// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

// Custom
import {IResponse} from '../../types/queries';
import {IDevice, IDeviceLog, IDeviceTotal} from '../../types/device';
import {useRealTimeService} from '../../context/realTimeContext';
import Navbar from '../common/Navbar';
import PieWheel from '../common/pieWheel';
import {SignalStrength, signalText} from '../common/signalStrength';
import {IColumnDetail} from '../../types/tables';
import Pagination from '../common/pagination';
import ViewTable from '../common/viewTable';

type CellValue = string | number | undefined

const DevicesTable = () => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;
  const initialOrderBy: string = 'static.deviceId';

  const [deviceTableData, setDeviceTableData] = useState([] as IDeviceTotal[]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const realTimeDataService = useRealTimeService();

  const initialRealTimeData = () => {
    realTimeDataService.getRealTimeData((newDevice) => {
      setDeviceTableData((prevState) =>
        prevState.map((device) => ({
          static: device.static,
          dynamic:
            device.static.deviceId === newDevice.deviceId ?
              newDevice :
              device.dynamic,
        })),
      );
    });
  };

  const queryTable = async () => {
    const deviceQuery = {params: {Total: true}};
    const deviceResponse = await axios.get<IResponse<IDevice>>(
        'api/device',
        deviceQuery,
    );
    const devices = deviceResponse.data.Results;
    const deviceIds = devices.map((device) => device.deviceId);

    const latestDevicesResponse = await axios.get<IResponse<IDeviceLog>>(
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
    queryTable();
  }, []);

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

  const PieWheelCell = (cellValue: CellValue) => (
    <div className="d-flex justify-content-end align-items-center">
      <div className="text-truncate devices-font">
        {Number(cellValue).toFixed(2)}
        {cellValue ? '%' : ''}
      </div>
      <div className="ps-2 pie-wheel-size">
        <PieWheel percentage={Number(cellValue)} text={false} />
      </div>
    </div>
  );

  const column: IColumnDetail[] = [
    {
      key: 'static.deviceId',
      name: 'UUID',
      filter: true,
      override: (cellValue: CellValue, device: IDeviceTotal) => (
        <div className="devices-uuid-text devices-font mx-auto h-100 py-3">
          <Link
            className="text-white"
            to={{
              pathname: '/device',
              search: `?Id=${device.static.deviceId}`,
            }}
          >
            {cellValue}
          </Link>
        </div>
      ),
    },
    {
      key: 'static.name',
      name: 'Name',
    },
    {
      key: 'dynamic.cpu.aggregatedPercentage',
      name: 'CPU',
      override: PieWheelCell,
    },
    {
      key: 'dynamic.memory.aggregatedPercentage',
      name: 'Memory',
      override: PieWheelCell,
    },
    {
      key: 'dynamic.disk.partitions.0.percent',
      name: 'Disk',
      override: PieWheelCell,
    },
    {
      key: 'dynamic.wifi.signalStrength',
      name: 'Network',
      override: (cellValue: CellValue) => (
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-end align-items-center">
            <div className="text-truncate devices-font">
              {signalText(Number(cellValue))}
            </div>
            <div className="ps-2 pie-wheel-size">
              <SignalStrength level={Number(cellValue)} showText={false} />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-100 d-flex flex-column">
      <div id="outer-container">
        <Navbar />
      </div>

      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content">
        <div className="flex-grow-1 d-flex flex-column overflow-auto container">
          <div className="flex-grow-1 overflow-auto table-container mt-5 p-1">
            <ViewTable
              tableData={deviceTableData}
              page={page}
              pageSize={pageSize}
              columns={column}
              initialOrderBy={initialOrderBy}
            />
          </div>
          <div className="d-flex py-2 ms-auto">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChanged={(newPage) => setPage(newPage)}
            />
          </div>
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

export default DevicesTable;
