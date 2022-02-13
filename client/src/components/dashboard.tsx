// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {FaPlus} from 'react-icons/fa';

// Custom
import Navbar from './Navbar';
import {useAuth} from '../context/authContext';
import {useModalService} from '../context/modal.context';
import {notificationService} from '../services/notification.service';
import {queryDashboard, saveDashboard} from '../services/dashboard.service';
import {Device, DeviceLog, DeviceTotal, IResponse} from '../types/queries';
import {Dashboard, DashboardWidget} from '../types/dashboard';
import AddWidgetModal from './dashboard-widgets/addWidgetModal';
// Widgets
import CpuUsageWidget from './device-detail-widgets/cpuUsageWidget';
import CpuAdditionalWidget from './device-detail-widgets/cpuAdditionalWidget';
import MemoryUsageWidget from './device-detail-widgets/memoryUsageWidget';
import MemoryAdditionalWidget from './device-detail-widgets/memoryAdditionalWidget';
import DiskUsageWidget from './device-detail-widgets/diskUsageWidget';
import DiskAdditionalWidget from './device-detail-widgets/diskAdditionalWidget';
import WifiUsageWidget from './device-detail-widgets/wifiUsageWidget';
import WifiAdditionalWidget from './device-detail-widgets/wifiAdditionalWidget';

const DashboardPage = () => {
  const [deviceData, setDeviceData] = useState([] as DeviceTotal[]);
  const [allDeviceIds, setAllDeviceIds] = useState([] as String[]);
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

  useEffect(() => {
    queryDeviceData();
  }, [dashboard]);

  useEffect(() => {
    viewDash();
    getAllDeviceIds();
  }, []);

  const queryDeviceData = async () => {
    if (!dashboard?.widgets) {
      return;
    }
    const widgetDeviceIds = dashboard.widgets.map((widget) => widget.options.deviceId);
    // Remove duplicate Device Ids
    const deviceIds = Array.from(new Set(widgetDeviceIds)).join(',');
    const deviceResponse = await axios.get<IResponse<Device>>(
        'api/device',
        {params: {deviceIds: deviceIds}},
    );
    const latestDevicesResponse = await axios.get<IResponse<DeviceLog>>(
        'api/device-logs/latest',
        {params: {Ids: deviceIds}},
    );
    const devices = deviceResponse.data.Results;
    const latestDevices = latestDevicesResponse.data.Results;

    const dashboardDevices = devices.map((staticDevice) => ({
      static: staticDevice,
      dynamic: latestDevices.find(
          (device) => device.deviceId === staticDevice.deviceId,
      ),
    }));
    setDeviceData(dashboardDevices);
  };

  const getAllDeviceIds = async () => {
    const deviceResponse = await axios.get<IResponse<String>>('api/device/ids');
    const devices = deviceResponse.data.Results;
    setAllDeviceIds(devices);
  };

  const viewDash = () => {
    queryDashboard({userId: user._id}).then((dashboard) => {
      if (dashboard) {
        setDashboard(dashboard);
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

  const getWidgetHMTL = (widget: DashboardWidget): JSX.Element => {
    const device = deviceData.find(
        (e) => e.static.deviceId == widget.options.deviceId,
    );
    const staticDevice = device?.static;
    const dynamicDevice = device?.dynamic;
    if (!staticDevice || !dynamicDevice) {
      return <></>;
    }

    switch (widget.widgetType) {
      case 'CPU-Dynamic':
        return <CpuUsageWidget deviceDynamic={dynamicDevice}></CpuUsageWidget>;
      case 'CPU-Static':
        return (
          <CpuAdditionalWidget
            deviceStatic={staticDevice}
          ></CpuAdditionalWidget>
        );
      case 'Memory-Dynamic':
        return (
          <MemoryUsageWidget deviceDynamic={dynamicDevice}></MemoryUsageWidget>
        );
      case 'Memory-Static':
        return (
          <MemoryAdditionalWidget deviceStatic={staticDevice}></MemoryAdditionalWidget>
        );
      case 'Disk-Dynamic':
        return (
          <DiskUsageWidget deviceDynamic={dynamicDevice}></DiskUsageWidget>
        );
      case 'Disk-Static':
        return (
          <DiskAdditionalWidget deviceStatic={staticDevice}></DiskAdditionalWidget>
        );
      case 'Network-Dynamic':
        return (
          <WifiUsageWidget deviceDynamic={dynamicDevice}></WifiUsageWidget>
        );
      case 'Network-Static':
        return (
          <WifiAdditionalWidget deviceStatic={staticDevice}></WifiAdditionalWidget>
        );
      default:
        return <></>;
    }
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
        className="h-100 overflow-auto pe-2 ps-2"
      >
        <div className="d-flex pt-2 justify-content-end">
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

        <div className="container d-flex flex-wrap pt-3">
          {dashboard?.widgets?.map((widget, index) => (
            <div className="w-30 px-5" key={`${widget.widgetType}_${index}`}>
              {getWidgetHMTL(widget)}
            </div>
          ))}

          <div
            onClickCapture={() => setHover(true)}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            role="button"
            className="d-flex justify-content-center w-30"
            style={hoverStyleBox}
            onClick={() =>
              modalService.open(
                  <AddWidgetModal
                    setType={setWidgetType}
                    setName={setDeviceName}
                    ids={allDeviceIds}
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
