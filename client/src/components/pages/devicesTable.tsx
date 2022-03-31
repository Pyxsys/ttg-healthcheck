// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {FaPlus, FaTrashAlt} from 'react-icons/fa';
import useOnclickOutside from 'react-cool-onclickoutside';

// Custom
import {IResponse} from '../../types/queries';
import {IDevice, IDeviceLog, IDeviceTotal} from '../../types/device';
import {useRealTimeService} from '../../context/realTimeContext';
import {exportCSV} from '../../services/export.service';
import Navbar from '../common/Navbar';
import PieWheel from '../common/pieWheel';
import {SignalStrength, signalText} from '../common/signalStrength';
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

const DevicesTable = () => {
  // Readonly Values
  const initialPage: number = 1;
  const pageSize: number = 10;
  const initialOrderBy: string = 'static.deviceId';

  const [deviceTableData, setDeviceTableData] = useState([] as IDeviceTotal[]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState([] as IFilter[]);
  const [showFilters, setshowFilters] = useState(false);
  const filtersRef = useOnclickOutside(() => setshowFilters(false));

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
    await axios
        .get<IResponse<IDevice>>('api/device', deviceQuery)
        .then((deviceResponse) => {
          const devices = deviceResponse.data.Results;
          const deviceIds = devices.map((device) => device.deviceId);
          axios
              .get<IResponse<IDeviceLog>>('api/device-logs/latest', {
                params: {Ids: deviceIds.join(',')},
              })
              .then((latestDevicesResponse) => {
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
              })
              .catch((error) => {
                console.log(error);
              });
        })
        .catch((error) => {
          console.log(error);
        });
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
              <SignalStrength strength={Number(cellValue)} showText={false} />
            </div>
          </div>
        </div>
      ),
    },
  ];

  /*
   * Filter Functions
   */

  const addEmptyFilter = (): void => {
    setFilters((prev) => [
      ...prev,
      {columnKey: '', type: undefined, value: ''},
    ]);
  };

  const removeFilter = (index: number): void => {
    setFilters((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  };

  const setFilterColumn = (
      filter: IFilter,
      index: number,
      value: string,
  ): void => {
    const columAndType = value.split(';');
    const prevType = filters[index].type;
    const newType = columAndType[1] as 'string' | 'number';

    const newFilter: IFilter = {
      ...filter,
      columnKey: columAndType[0],
      type: newType,
    };

    if (prevType !== newType) {
      newFilter.value = '';
      newFilter.equality =
        newType === 'number' ? Equality.E : Equality.StrictEqual;
    }
    setFilters((prev) => {
      prev.splice(index, 1, newFilter);
      return [...prev];
    });
  };

  const setFilterEquality = (
      filter: IFilter,
      index: number,
      value: number,
  ): void => {
    setFilters((prev) => {
      prev.splice(index, 1, {...filter, equality: value});
      return [...prev];
    });
  };

  const setFilterValue = (
      filter: IFilter,
      index: number,
      value: number | string,
  ): void => {
    setFilters((prev) => {
      prev.splice(index, 1, {...filter, value: value});
      return [...prev];
    });
  };

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

  const getFilterEqualityOptions = (
      type?: 'string' | 'number',
  ): JSX.Element => {
    switch (type) {
      case 'string':
        return (
          <>
            <option value={Equality.StrictEqual}>Equals</option>
            <option value={Equality.StartsWith}>Starts With</option>
            <option value={Equality.EndsWith}>Ends With</option>
            <option value={Equality.Includes}>Includes</option>
          </>
        );
      case 'number':
        return (
          <>
            <option value={Equality.LT}>Less Than (&lt;)</option>
            <option value={Equality.LTE}>Less Than or Equal (&le;)</option>
            <option value={Equality.E}>Equal (=)</option>
            <option value={Equality.GTE}>Greater Than or Equal (&ge;)</option>
            <option value={Equality.GT}>Greater Than (&gt;)</option>
          </>
        );
      default:
        return <></>;
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

  const getTableCSV = (): void => {
    const tableValues = getFilteredDevices().map((device) => ({
      UUID: device.static.deviceId,
      Name: device.static.name,
      CPU: device.dynamic?.cpu?.aggregatedPercentage,
      Memory: device.dynamic?.memory?.aggregatedPercentage,
      Disk: device.dynamic?.disk?.partitions[0]?.percent,
      Network: signalText(device.dynamic?.wifi?.signalStrength || -1) || undefined,
    }));
    exportCSV(tableValues);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <Navbar />
      <div className="flex-grow-1 d-flex flex-column align-items-center overflow-auto devices-content">
        <div className="flex-grow-1 d-flex flex-column overflow-auto container">

          {/* Row of Buttons (filter and export) */}
          <div className="d-flex pt-5 pb-1 w-100">
            <button
              ref={filtersRef}
              className={`d-flex flex-column position-absolute filter-container overflow-auto ${
                showFilters ? '' : 'invisible'
              }`}
            >
              <span>Filter Table ({filters.length})</span>
              <span className={`ps-2 ${showFilters ? 'dropup' : 'dropdown'}`}>
                <i className="caret"></i>
              </span>
            </button>

            <button
              className="btn btn-primary ms-auto"
              onClick={() => getTableCSV()}>
                Export To CSV
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="w-100">
            <div
              ref={filtersRef}
              className={`d-flex flex-column position-absolute filter-container overflow-auto ${
                showFilters ? '' : 'invisible'
              }`}
            >
              <div className="d-flex flex-column overflow-auto">
                {filters.length > 0 ? (
                  <div className="d-flex align-items-center fw-bold text-muted p-1">
                    <div className="w-5"></div>
                    <div className="w-20 px-1">Column</div>
                    <div className="w-40 px-1">Equality</div>
                    <div className="w-35 px-1">Value</div>
                  </div>
                ) : (
                  <></>
                )}
                {filters.map((filter, idx) => (
                  <div
                    className={`d-flex align-items-center p-1`}
                    key={`filter-${idx}`}
                  >
                    <div className="w-5">
                      <i
                        className="cursor-pointer user-select-none text-muted"
                        onClick={() => removeFilter(idx)}
                      >
                        <FaTrashAlt />
                      </i>
                    </div>

                    <div className="w-20 px-1">
                      <select
                        className="form-select form-select-sm w-100"
                        value={`${filter.columnKey};${filter.type}`}
                        onChange={(e) =>
                          setFilterColumn(filter, idx, e.target.value)
                        }
                      >
                        <option value=""></option>
                        <option value="static.deviceId;string">UUID</option>
                        <option value="static.name;string">Name</option>
                        <option value="dynamic.cpu.aggregatedPercentage;number">
                          CPU
                        </option>
                        <option value="dynamic.memory.aggregatedPercentage;number">
                          Memory
                        </option>
                        <option value="dynamic.disk.partitions.0.percent;number">
                          Disk
                        </option>
                        <option value="dynamic.wifi.signalStrength;number">
                          Network
                        </option>
                      </select>
                    </div>

                    {filter.columnKey ? (
                      <>
                        <div className="w-40 px-1">
                          <select
                            className="form-select form-select-sm w-100"
                            value={filter.equality}
                            onChange={(e) =>
                              setFilterEquality(
                                  filter,
                                  idx,
                                  Number(e.target.value),
                              )
                            }
                          >
                            {getFilterEqualityOptions(filter.type)}
                          </select>
                        </div>

                        <div className="w-35 px-1">
                          <input
                            className="form-control form-control-sm w-100"
                            type={filter.type}
                            value={filter.value}
                            onChange={(e) =>
                              setFilterValue(filter, idx, e.target.value)
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center p-2">
                <div
                  className="d-flex align-items-center text-muted cursor-pointer user-select-none border-dashed px-2"
                  onClick={() => addEmptyFilter()}
                >
                  <FaPlus />
                  <span className="ps-2">Add Filter</span>
                </div>
                <div
                  className="d-flex align-items-center text-muted cursor-pointer user-select-none border-dashed px-2 ms-3"
                  onClick={() => setFilters([])}
                >
                  <FaTrashAlt />
                  <span className="ps-2">Clear All</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-grow-1 overflow-auto table-container mt-3">
            <ViewTable
              tableData={getFilteredDevices()}
              page={page}
              pageSize={pageSize}
              columns={column}
              initialOrderBy={initialOrderBy}
            />
          </div>

          {/* Pagination */}
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
