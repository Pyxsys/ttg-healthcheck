// 3rd Party
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

// Custom
import {Device, DeviceLog, IResponse} from '../types/queries';
import {useRealTimeService} from '../context/realTimeContext';
import Navbar from './Navbar';
import PieWheel from './common/pieWheel';
import {SignalStrength, signalText} from './common/signalStrength';
import {TableDevice} from '../types/tables';
import Pagination from './common/pagination';


const useDebounce = (initialValue = '', delay: number) => {
  const [actualValue, setActualValue] = useState(initialValue);
  const [debounceValue, setDebounceValue] = useState(initialValue);
  useEffect(() => {
    const debounceId = setTimeout(() => setDebounceValue(actualValue), delay);
    return () => clearTimeout(debounceId);
  }, [actualValue, delay]);
  return [actualValue, debounceValue, setActualValue] as [string, string, Dispatch<SetStateAction<string>>];
};

const DevicePage = () => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;
  const initialOrderBy: string = 'Name';

  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const [orderByAsc, setOrderByAsc] = useState(true);
  const [actualFilter, delayedFilter, setFilter] = useDebounce('', 500);

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
    const deviceQuery = {params: {Total: true}};
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

  const filterTable = (device: TableDevice): boolean => {
    return device.static.deviceId.toLocaleLowerCase().includes(delayedFilter.toLocaleLowerCase());
  };

  const sortTable = (device1: TableDevice, device2: TableDevice): number => {
    const device1Swapped = orderByAsc ? device2 : device1;
    const device2Swapped = orderByAsc ? device1 : device2;
    switch (orderBy) {
      case 'UUID':
        return device1Swapped.static.deviceId.localeCompare(device2Swapped.static.deviceId);
      case 'Name':
        return (device1Swapped.static.name || '').localeCompare(device2Swapped.static.name || '');
      case 'CPU':
        return (device1Swapped.dynamic?.cpu?.aggregatedPercentage || -1) - (device2Swapped.dynamic?.cpu?.aggregatedPercentage || -1);
      case 'Memory':
        return (device1Swapped.dynamic?.memory?.aggregatedPercentage || -1) - (device2Swapped.dynamic?.memory?.aggregatedPercentage || -1);
      case 'Disk':
        return (device1Swapped.dynamic?.disk?.partitions[0]?.percent || -1) - (device2Swapped.dynamic?.disk?.partitions[0]?.percent || -1);
      case 'Network':
        const signal1 = device1Swapped.dynamic?.wifi?.signalStrength === undefined ? -1 : Number(device1Swapped.dynamic?.wifi?.signalStrength);
        const signal2 = device2Swapped.dynamic?.wifi?.signalStrength === undefined ? -1 : Number(device2Swapped.dynamic?.wifi?.signalStrength);
        return signal1 - signal2;
      default:
        return 0;
    }
  };

  const selectOrderBy = (order: string): void => {
    if (orderBy === order) {
      setOrderByAsc(!orderByAsc);
    } else {
      setOrderBy(order);
      setOrderByAsc(true);
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div id="outer-container">
        <Navbar />
      </div>

      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content">
        <div className='flex-grow-1 d-flex flex-column overflow-auto container'>
          <div className='flex-grow-1 overflow-auto table-container mt-5 p-1'>
            {delayedFilter}
            <table className="cerebellum-table table-striped text-white overflow-auto w-100 m-1">
              <thead>
                <tr className='sticky-header'>
                  {['UUID', 'Name', 'CPU', 'Memory', 'Disk', 'Network'].map((column) =>
                    <th key={column} tabIndex={0} className='cursor-pointer' onClick={() => selectOrderBy(column)}>
                      <div className='d-flex align-items-center'>
                        <span>{column}</span>
                        <div className='ps-2'>
                          {orderBy === column ?
                            <>{orderByAsc ?
                                <span className='dropdown px-1'><i className='caret'></i></span> :
                                <span className='dropup px-1'><i className='caret'></i></span>}
                            </> :
                            <>
                              <div className="d-flex">
                                <span className='dropdown'><i className='caret'></i></span>
                                <span className='dropup'><i className='caret'></i></span>
                              </div>
                            </>
                          }
                        </div>
                        {column === 'UUID' ?
                          <label className='ps-2 user-select-none'>
                            <input type="text" className="form-control" placeholder="Filter by UUID..." value={actualFilter}
                              onClick={(e) => e.stopPropagation()} onChange={(e) => setFilter(e.target.value)} />
                          </label> :
                          <></>
                        }
                      </div>
                    </th>,
                  )}
                </tr>
              </thead>
              <tbody className='overflow-auto'>
                {deviceTableData
                    .filter(filterTable)
                    .sort(sortTable)
                    .slice((page-1)*pageSize, (page-1)*pageSize+pageSize)
                    .map((device) =>
                      <tr key={device.static.deviceId}>
                        <td>
                          <div className="devices-uuid-text devices-font mx-auto h-100 py-3">
                            <Link className="text-white"
                              to={{pathname: '/device', state: {id: device.static.deviceId}}}
                            >
                              {device.static.deviceId}
                            </Link>
                          </div>
                        </td>
                        <td>
                          <span className="devices-font">
                            {device.static.name}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-end align-items-center">
                            <div className="text-truncate devices-font">
                              {Number(device.dynamic?.cpu.aggregatedPercentage).toFixed(2)}
                              {device.dynamic?.cpu.aggregatedPercentage ? '%' : ''}
                            </div>
                            <div className="ps-2 pie-wheel-size">
                              <PieWheel percentage={Number(device.dynamic?.cpu.aggregatedPercentage)} text={false} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-end align-items-center">
                            <div className="text-truncate devices-font">
                              {Number(device.dynamic?.memory.aggregatedPercentage).toFixed(2)}
                              {device.dynamic?.memory.aggregatedPercentage ? '%' : ''}
                            </div>
                            <div className="ps-2 pie-wheel-size">
                              <PieWheel percentage={Number(device.dynamic?.memory.aggregatedPercentage)} text={false} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-end align-items-center">
                            <div className="text-truncate devices-font">
                              {Number(device.dynamic?.disk?.partitions[0].percent).toFixed(2)}
                              {device.dynamic?.disk?.partitions[0].percent ? '%' : ''}
                            </div>
                            <div className="ps-2 pie-wheel-size">
                              <PieWheel percentage={Number(device.dynamic?.disk?.partitions[0].percent)} text={false} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <div className="d-flex justify-content-end align-items-center">
                              <div className="text-truncate devices-font">
                                {signalText(Number(device.dynamic?.wifi.signalStrength))}
                              </div>
                              <div className="ps-2 pie-wheel-size">
                                <SignalStrength level={Number(device.dynamic?.wifi.signalStrength)} showText={false} />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>,
                    )
                }
              </tbody>
            </table>
          </div>


          <div className="d-flex py-2 ms-auto">
            <Pagination page={page} totalPages={totalPages} onPageChanged={(page) => setPage(page)} />
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

export default DevicePage;
