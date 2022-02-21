// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {FaPlus, FaTrashAlt} from 'react-icons/fa';

// Custom
import Navbar from '../common/Navbar';
import {useAuth} from '../../context/authContext';
import {useModalService} from '../../context/modal.context';
import {notificationService} from '../../services/notification.service';
import {queryDashboard, saveDashboard} from '../../services/dashboard.service';
import {IResponse} from '../../types/queries';
import {IDevice, IDeviceLog, IDeviceTotal} from '../../types/device';
import {IDashboard, IDashboardWidget} from '../../types/dashboard';
import AddWidgetModal from '../dashboard-widgets/addWidgetModal';
// Widgets
import CpuUsageWidget from '../device-detail-widgets/cpuUsageWidget';
import CpuAdditionalWidget from '../device-detail-widgets/cpuAdditionalWidget';
import MemoryUsageWidget from '../device-detail-widgets/memoryUsageWidget';
import MemoryAdditionalWidget from '../device-detail-widgets/memoryAdditionalWidget';
import DiskUsageWidget from '../device-detail-widgets/diskUsageWidget';
import DiskAdditionalWidget from '../device-detail-widgets/diskAdditionalWidget';
import WifiUsageWidget from '../device-detail-widgets/wifiUsageWidget';
import WifiAdditionalWidget from '../device-detail-widgets/wifiAdditionalWidget';

const Dashboard = () => {
  const {user} = useAuth();
  const modalService = useModalService();

  const [dashboard, setDashboard] = useState({} as IDashboard);
  const [deviceData, setDeviceData] = useState([] as IDeviceTotal[]);
  const [widgetType, setWidgetType] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [hover, setHover] = useState(false);
  const [dashboardModified, setDashboardModified] = useState(false);


  const hoverStyleBox = {
    color: hover ? 'white' : 'grey',
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
  }, []);

  const queryDeviceData = async (): Promise<void> => {
    if (!dashboard?.widgets) {
      return;
    }
    const widgetDeviceIds = dashboard.widgets.map((widget) => widget.options.deviceId);
    // Remove duplicate Device Ids
    const deviceIds = Array.from(new Set(widgetDeviceIds)).join(',');
    const deviceResponse = await axios.get<IResponse<IDevice>>(
        'api/device',
        {params: {deviceIds: deviceIds}},
    );
    const latestDevicesResponse = await axios.get<IResponse<IDeviceLog>>(
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

  const viewDash = (): void => {
    queryDashboard({userId: user._id}).then((newDashboard) => {
      if (newDashboard) {
        setDashboard(newDashboard);
        setDashboardModified(false);
      }
    });
  };

  const addWidgetType = (newWidgetType: string): void => {
    setWidgetType(newWidgetType);
    setDashboardModified(true);
  };

  const saveDash = (): void => {
    saveDashboard(dashboard)
        .catch((error) => {
          notificationService.error(`Error: ${error.response.data}`);
          return null;
        })
        .then((a) => {
          if (a) {
            setDashboardModified(false);
            notificationService.success(`Success: ${a}`);
          }
        });
  };

  const resetDash = (): void => {
    setDashboard({
      userId: user._id,
      widgets: [] as IDashboardWidget[],
    });
    setDashboardModified(true);
  };

  const removeWidget = (index: number): void => {
    dashboard.widgets.splice(index, 1);
    setDashboard((prev) => ({...prev, widgets: dashboard.widgets}));
    setDashboardModified(true);
  };

  const overrideWidgetHeaderHTML = (widgetName: string, widgetTitle: string, index: number): JSX.Element => (
    <div className="d-flex w-100">
      <div className="d-flex justify-content-center w-100">
        <div className="d-flex flex-column align-content-center">
          <h6 className="text-truncate text-center">{widgetName}</h6>
          <div className="text-center">{widgetTitle}</div>
        </div>
      </div>
      <div className="d-flex align-self-center px-2 ms-auto cursor-pointer"
        onClick={() => removeWidget(index)}>
        <FaTrashAlt />
      </div>
    </div>
  );

  const getWidgetHMTL = (widget: IDashboardWidget, index: number): JSX.Element => {
    const device = deviceData.find(
        (e) => e.static.deviceId === widget.options.deviceId,
    );
    const staticDevice = device?.static;
    if (!staticDevice) {
      return <></>;
    }
    switch (widget.widgetType) {
      case 'CPU-Static':
        return (
          <CpuAdditionalWidget
            deviceStatic={staticDevice}
            overrideHeader={overrideWidgetHeaderHTML(
                widget.options.deviceName || widget.options.deviceId,
                'Additional CPU Information',
                index,
            )}
          ></CpuAdditionalWidget>
        );
      case 'Memory-Static':
        return (
          <MemoryAdditionalWidget
            deviceStatic={staticDevice}
            overrideHeader={overrideWidgetHeaderHTML(
                widget.options.deviceName || widget.options.deviceId,
                'Additional Memory Information',
                index,
            )}
          ></MemoryAdditionalWidget>
        );
      case 'Disk-Static':
        return (
          <DiskAdditionalWidget
            deviceStatic={staticDevice}
            overrideHeader={overrideWidgetHeaderHTML(
                widget.options.deviceName || widget.options.deviceId,
                'Additional Disk Information',
                index,
            )}
          ></DiskAdditionalWidget>
        );
      case 'Network-Static':
        return (
          <WifiAdditionalWidget
            deviceStatic={staticDevice}
            overrideHeader={overrideWidgetHeaderHTML(
                widget.options.deviceName || widget.options.deviceId,
                'Additional Network Information',
                index,
            )}
          ></WifiAdditionalWidget>
        );
    }

    const dynamicDevice = device?.dynamic;
    if (!dynamicDevice) {
      return <></>;
    }
    switch (widget.widgetType) {
      case 'CPU-Dynamic':
        return <CpuUsageWidget
          deviceDynamic={dynamicDevice}
          overrideHeader={overrideWidgetHeaderHTML(
              widget.options.deviceName || widget.options.deviceId,
              'CPU Usage Information',
              index,
          )}
        ></CpuUsageWidget>;
      case 'Memory-Dynamic':
        return (
          <MemoryUsageWidget
            deviceDynamic={dynamicDevice}
            overrideHeader={overrideWidgetHeaderHTML(
                widget.options.deviceName || widget.options.deviceId,
                'Memory Usage Information',
                index,
            )}
          ></MemoryUsageWidget>
        );
      case 'Disk-Dynamic':
        return (
          <DiskUsageWidget
            deviceDynamic={dynamicDevice}
            overrideHeader={overrideWidgetHeaderHTML(
                widget.options.deviceName || widget.options.deviceId,
                'Disk Usage Information',
                index,
            )}
          ></DiskUsageWidget>
        );
      case 'Network-Dynamic':
        return (
          <WifiUsageWidget
            deviceDynamic={dynamicDevice}
            overrideHeader={overrideWidgetHeaderHTML(
                widget.options.deviceName || widget.options.deviceId,
                'Network Usage Information',
                index,
            )}
          ></WifiUsageWidget>
        );
    }
    return <></>;
  };

  modalService.onPrimaryClicked = (): void => {
    if (dashboard.widgets?.length > 0) {
      const wids: IDashboardWidget[] = dashboard.widgets;
      wids.push({
        widgetType: widgetType,
        options: {
          deviceId: deviceName,
          deviceName: deviceName,
        },
      });
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
          <button className="btn btn-secondary" onClick={() => resetDash()}>
            Clear Dashboard
          </button>
          <button className="btn btn-secondary ms-2" disabled={!dashboardModified} onClick={() => saveDash()}>
            Save Changes
          </button>
          <button className="btn btn-secondary ms-2" disabled={!dashboardModified} onClick={() => viewDash()}>
            Cancel Changes
          </button>
        </div>

        <div className="container d-flex flex-wrap py-3">
          {/* Dashboard Widgets */}
          {dashboard?.widgets?.map((widget, index) => (
            <div className="d-flex flex-column widget-width px-4" key={`${widget.widgetType}_${index}`}>
              {getWidgetHMTL(widget, index)}
            </div>
          ))}

          {/* Add New Widget */}
          <div className="widget-width px-4">
            <div
              role="button"
              className="d-flex justify-content-center dashboard-dashed-box"
              style={hoverStyleBox}
              onMouseOver={() => setHover(true)}
              onMouseOut={() => setHover(false)}
              onClick={() =>
                modalService.open(
                    <AddWidgetModal
                      setType={addWidgetType}
                      setName={setDeviceName}
                    />,
                    'lg',
                    {width: 60},
                )
              }
            >
              <div className="w-25">
                <FaPlus color="white" style={hoverStyleIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
