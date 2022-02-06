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
import CpuUsageWidget from './device-detail-widgets/cpuUsageWidget';
import MemoryUsageWidget from './device-detail-widgets/memoryUsageWidget';
import {DeviceLog, IResponse} from '../types/queries';
import {useModalService} from '../context/modal.context';
import AddWidgetModal from './dashboard-widgets/addWidgetModal';
import {FaPlus} from 'react-icons/fa';

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
    if (dashboard.widgets && dashboard.widgets.length > 0) {
      const deviceIds = dashboard?.widgets?.map(
          (widget) => widget.options.deviceId,
      );
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
  }, [dashboard]);

  useEffect(() => {
    viewDash();
  }, []);

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

  const resetDash = () => {
    setDashboard({
      userId: user._id,
      widgets: [] as DashboardWidget[],
    });
  };

  modalService.onPrimaryClicked = () => {
    if (dashboard.widgets?.length > 0) {
      const wids = dashboard.widgets as DashboardWidget[];
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
        <div className="d-flex">
          <button className="btn btn-success" onClick={() => saveDash()}>
            Save The Current Dashboard
          </button>
          <button className="btn btn-danger ms-2" onClick={() => resetDash()}>
            Clear Dashboard
          </button>
          <button className="btn btn-info ms-2" onClick={() => viewDash()}>
            Undo All Changes
          </button>
        </div>

        <div className="d-flex flex-wrap pt-3">
          {dashboard?.widgets?.map((widget, index) => (
            <div className="w-30 px-5" key={`${widget.widgetType}_${index}`}>
              {widget.widgetType === 'CPU' ? (
                <div>
                  <CpuUsageWidget
                    deviceDynamic={
                      deviceData.find(
                          (e) => e.deviceId == widget.options.deviceId,
                      ) as DeviceLog
                    }
                  ></CpuUsageWidget>
                </div>
              ) : (
                <></>
              )}
              {widget.widgetType === 'Memory' ? (
                <div>
                  <MemoryUsageWidget
                    deviceDynamic={
                      deviceData.find(
                          (e) => e.deviceId == widget.options.deviceId,
                      ) as DeviceLog
                    }
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
      </div>
    </div>
  );
};

export default DashboardPage;
