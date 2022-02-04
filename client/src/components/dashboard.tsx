// 3rd Party
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/authContext';
import {queryDashboard, saveDashboard} from '../services/dashboard.service';
import {notificationService} from '../services/notification.service';
import {Dashboard, DashboardWidget} from '../types/dashboard';
import '../App.scss';

// Custom
import Navbar from './Navbar';
// import {DisplayWidget} from '../types/displayWidget';
import CpuUsageWidget from './device-detail-widgets/cpuUsageWidget';
import MemoryUsageWidget from './device-detail-widgets/memoryUsageWidget';
import {DeviceLog, IResponse} from '../types/queries';
import {useModalService} from '../context/modal.context';
import AddWidgetModal from './dashboard-widgets/addWidgetModal';
import {FaPlus} from 'react-icons/fa';
// import {Interface} from 'readline';

const DashboardPage = () => {
  const [deviceData, setDeviceData] = useState([] as DeviceLog[]);
  const [widgetType, setWidgetType] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const modalService = useModalService();
  const {user} = useAuth();
  const [dashboard, setDashboard] = useState({} as Dashboard);
  const [hover, setHover] = useState(false);
  const hoverStyleBox = {
    color: hover ? 'white' : 'grey',
    height: '360px',
    border: '4px dashed',
  };
  const hoverStyleIcon = {
    color: hover ? 'white' : 'grey',
    width: '100%',
    height: '100%',
  };
  const queryDeviceData = async () => {
    console.log('hello');
    if (dashboard.widgets && dashboard.widgets.length > 0) {
      const deviceIds = dashboard?.widgets?.map(
          (widget) => widget.options.deviceId,
      );
      console.log(deviceIds);
      const latestDevicesResponse = await axios.get<IResponse<DeviceLog>>(
          'api/device-logs/latest',
          {params: {Ids: deviceIds?.join(',')}},
      );
      const latestDevices = latestDevicesResponse.data.Results;

      setDeviceData(latestDevices);
    }
  };
  useEffect(() => {
    queryDeviceData();
  });
  const saveDash = () => {
    saveDashboard(dashboard)
        .catch((error) => {
          notificationService.error(`Error: ${error.response.data}`);
          return null;
        })
        .then((a) => {
          if (a) {
            notificationService.success(`Success: ${a}`);
          }
        });
  };
  /* -------------------------
   * For Testing Purposes Only
   * -------------------------
   */
  const saveValidDash = () => {
    const body = {
      userId: user._id,
      widgets: [
        {
          widgetType: 'CPU',
          options: {
            deviceId: 'TEST3C2D-C033-7B87-4B31-244BFX931D14',
            deviceName: 'test1',
          },
        },
        {
          widgetType: 'Memory',
          options: {
            deviceId: 'test2',
            deviceName: 'test1',
          },
        },
      ],
    };
    saveDashboard(body)
        .catch((error) => {
          notificationService.error(`Error: ${error.response.data}`);
          return null;
        })
        .then((a) => {
          if (a) {
            notificationService.success(`Success: ${a}`);
          }
        });
  };
  const saveInvalidDash = () => {
    const body = {
      userId: user._id,
      widgets: [
        {
          options: '{id: something}',
        },
      ] as any,
    };
    saveDashboard(body)
        .catch((error) => {
          notificationService.error(`Error: ${error.response.data}`);
          return null;
        })
        .then((a) => {
          if (a) {
            notificationService.success(`Success: ${a}`);
          }
        });
  };
  const viewDash = () => {
    queryDashboard({userId: user._id}).then((dashboard) => {
      if (dashboard) {
        setDashboard(dashboard);
        notificationService.success('Loaded Dashboard');
      } else {
        notificationService.error('No Dashboard in Database');
      }
    });
  };
  /* -------------------------
   * For Testing Purposes Only
   * -------------------------
   */

  modalService.onPrimaryClicked = () => {
    console.log('Save Clicked');
    if (dashboard.widgets?.length > 0) {
      const wids = dashboard.widgets as DashboardWidget[];
      console.log(wids);
      wids.push({
        widgetType: widgetType,
        options: {
          deviceId: deviceName,
          deviceName: deviceName,
        },
      } as DashboardWidget);
      setDashboard({
        ...dashboard,
        widgets: wids,
      });
    } else {
      setDashboard({
        ...dashboard,
        widgets: [
          {
            widgetType: widgetType,
            options: {
              deviceId: deviceName,
              deviceName: deviceName,
            },
          },
        ],
      });
    }
  };
  return (
    <div id="dashboard-container">
      <Navbar />
      <div
        id="page-wrap"
        className="h-100 overflow-auto container pe-2 ps-2 pt-5"
      >
        <div className="d-flex flex-wrap">
          {dashboard?.widgets?.map((widget, index) => (
            <div className="w-30 px-5" key={`${widget.widgetType}_${index}`}>
              {widget.widgetType === 'CPU' ? (
                <div>
                  <CpuUsageWidget
                    deviceDynamic={deviceData.find((e) => e.deviceId == widget.options.deviceId) as DeviceLog}
                  ></CpuUsageWidget>
                </div>
              ) : (
                <></>
              )}
              {widget.widgetType === 'Memory' ? (
                <div>
                  <MemoryUsageWidget
                    deviceDynamic={deviceData.find((e) => e.deviceId == widget.options.deviceId) as DeviceLog}
                  ></MemoryUsageWidget>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
          <div
            onClickCapture={() => setHover(true)}
            onMouseOver={() => {
              setHover(true);
              console.log('hello');
              console.log(widgetType);
              console.log(deviceName);
            }}
            onMouseOut={() => setHover(false)}
            role="button"
            className="d-flex justify-content-center w-30"
            style={hoverStyleBox}
            onClick={() =>
              modalService.open(
                  <AddWidgetModal
                    setType={setWidgetType}
                    setName={setDeviceName}
                  />,
                  'lg',
                  {width: 60},
              )
            }
          >
            <div className="d-flex justify-content-center align-items-center w-30 h-100">
              <FaPlus color="white" style={hoverStyleIcon} />
            </div>
          </div>
        </div>

        {/* For Testing Purposes Only */}
        <div className="pt-5 d-flex flex-column">
          <h5>For Testing Purposes</h5>
          <small>
            (To delete dashboard must use MongoDB, or use another account)
          </small>
          <div className="d-flex">
            <button className="btn btn-success" onClick={() => saveValidDash()}>
              Save A Valid Dash
            </button>
            <button className="btn btn-success" onClick={() => saveDash()}>
              Save A New Dash
            </button>
            <button
              className="btn btn-danger ms-2"
              onClick={() => saveInvalidDash()}
            >
              Save An Invalid Dash
            </button>
            <button className="btn btn-info ms-2" onClick={() => viewDash()}>
              View Saved Dash
            </button>
          </div>
          <div className="d-flex flex-column">
            {dashboard?.userId ? (
              <>
                <div className="d-flex pt-2">
                  <span className="fw-bold">User ID:</span>
                  <span className="ps-2">{dashboard.userId}</span>
                </div>
                <div className="d-flex flex-column">
                  <span className="border-bottom fw-bold pt-2">Widgets</span>
                  <div className="d-flex flex-column pt-2">
                    {dashboard.widgets.map((w, index) => (
                      <div key={`${w.widgetType}_${index}`} className="d-flex">
                        <div className="d-flex flex-column">
                          <span className="border-bottom fw-bold">
                            Widget Type
                          </span>
                          <span>{w.widgetType}</span>
                        </div>
                        <div className="d-flex flex-column ps-5">
                          <span className="border-bottom fw-bold">
                            Widget Options
                          </span>
                          <span>{JSON.stringify(w.options)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <h3 className="pt-3">No Dashboard Displayed</h3>
            )}
          </div>
        </div>
        {/* For Testing Purposes Only */}
      </div>
    </div>
  );
};

export default DashboardPage;
