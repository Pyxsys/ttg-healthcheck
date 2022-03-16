// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

// Custom
import {IResponse} from '../../types/queries';
import {IDevice, IDeviceLog, IDeviceTotal} from '../../types/device';
import {useRealTimeService} from '../../context/realTimeContext';
import Navbar from '../common/Navbar';
import {IColumnDetail} from '../../types/tables';
import Pagination from '../common/pagination';
import ViewTable from '../common/viewTable';

type CellValue = string | number | undefined

enum Equality {
  GT,
  GTE,
  E,
  LTE,
  LT,
  StrictEqual,
  StartsWith,
  EndsWith,
  Includes,
}

interface IFilter {
  columnKey: string
  value: string | number
  type?: 'string' | 'number'
  equality?: Equality
}

const AdminPanel = () => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;
  const initialOrderBy: string = 'static.deviceId';

  const [deviceTableData, setDeviceTableData] = useState([] as IDeviceTotal[]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState([] as IFilter[]);

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
    const results = await axios.get(
        'api/user/all',
    );
    const users = results.data.users;
    console.log(users);
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
    console.log(latestDevices);
    const tableDevices = users.map((staticDevice: any) => ({
      static: staticDevice,
    }),
    );
    console.log(tableDevices);

    setTotalPages(Math.ceil(deviceResponse.data.Total / pageSize));
    setDeviceTableData(tableDevices);
    realTimeDataService.setDeviceIds(deviceIds);
  };

  useEffect(() => {
    initialRealTimeData();
    queryTable();
    setFilters([]);
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

  const column: IColumnDetail[] = [
    {
      key: 'static.name',
      name: 'Name',
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
      key: 'static.email',
      name: 'Email',
    },
    {
      key: 'static.role',
      name: 'role',
    },
    {
      key: 'dynamic.memory.aggregatedPercentage',
      name: 'Icon',
    },
  ];

  /*
   * Filter Functions
   */

  const computeFilterEquality = (
      equality: Equality,
      value: string | number,
  ) => {
    switch (equality) {
      case Equality.LTE:
        return (compareValue: number | undefined) =>
          compareValue !== undefined &&
          compareValue !== null &&
          compareValue <= Number(value);
      case Equality.LT:
        return (compareValue: number | undefined) =>
          compareValue !== undefined &&
          compareValue !== null &&
          compareValue < Number(value);
      case Equality.E:
        return (compareValue: number | undefined) =>
          compareValue !== undefined &&
          compareValue !== null &&
          compareValue === Number(value);
      case Equality.GT:
        return (compareValue: number | undefined) =>
          compareValue !== undefined &&
          compareValue !== null &&
          compareValue > Number(value);
      case Equality.GTE:
        return (compareValue: number | undefined) =>
          compareValue !== undefined &&
          compareValue !== null &&
          compareValue >= Number(value);
      case Equality.StrictEqual:
        return (compareValue: string | undefined) =>
          compareValue !== undefined &&
          compareValue !== null &&
          compareValue.toLowerCase() === String(value).toLowerCase();
      case Equality.StartsWith:
        return (compareValue: string | undefined) =>
          compareValue !== undefined &&
          compareValue !== null &&
          compareValue.toLowerCase().startsWith(String(value).toLowerCase());
      case Equality.EndsWith:
        return (compareValue: string | undefined) =>
          compareValue !== undefined &&
          compareValue !== null &&
          compareValue.toLowerCase().endsWith(String(value).toLowerCase());
      case Equality.Includes:
        return (compareValue: string | undefined) =>
          compareValue !== undefined &&
          compareValue !== null &&
          compareValue.toLowerCase().includes(String(value).toLowerCase());
      default:
        return () => false;
    }
  };

  const getAttribute = (object: any, attribute: string): number | string => {
    const attributes = attribute.split('.');
    return attributes.reduce(
        (prev, attr) => (prev ? prev[attr] : undefined),
        object,
    );
  };

  const getFilteredDevices = (): IDeviceTotal[] => {
    const activeFilters = filters
        .filter((filter) => filter.equality && filter.value)
        .map((filter) => ({
          ...filter,
          compute: computeFilterEquality(
          filter.equality as Equality,
          filter.value as string | number,
          ),
        }));
    return deviceTableData.filter((device) =>
      activeFilters.every((filter) =>
        filter.compute(getAttribute(device, filter.columnKey) as any),
      ),
    );
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div id="outer-container">
        <Navbar />
      </div>
      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content">
        {/* Table */}
        <div className="flex-grow-1 d-flex flex-column overflow-auto container">
          <div className="flex-grow-1 overflow-auto table-container mt-5">
            <ViewTable
              tableData={getFilteredDevices()}
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

export default AdminPanel;
