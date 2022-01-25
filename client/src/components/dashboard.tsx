// 3rd Party
import React, {useState} from 'react';
import {useAuth} from '../context/authContext';
import {queryDashboard, saveDashboard} from '../services/dashboard.service';
import {notificationService} from '../services/notification.service';
import {Dashboard} from '../types/dashboard';
import '../App.scss';

// Custom
import Navbar from './Navbar';
import CpuUsageWidget from './device-detail-widgets/cpuUsageWidget';
import {DeviceLog} from '../types/queries';
import {useModalService} from '../context/modal.context';
import AddWidgetModal from './dashboard-widgets/addWidgetModal';

const DashboardPage = () => {
  const modalService = useModalService();
  const {user} = useAuth();
  const [dashboard, setDashboard] = useState({} as Dashboard);
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
          options: '{deviceID: test2}',
        },
        {
          widgetType: 'Memory',
          options: '{deviceID: test1, size: 12}',
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
  };

  return (
    <div id="dashboard-container">
      <Navbar />
      <div id="page-wrap" className="h-100 overflow-auto container">
        dashboard
        <img className="rect-dash"></img>
        <button className='btn btn-secondary' onClick={() => modalService.open(<AddWidgetModal />, 'lg', {width: 60})}>Display Modal</button>


        <div>
          {dashboard?.widgets?.map((widget, index) =>
            <div key={`${widget.widgetType}_${index}`}>
              {widget.widgetType === 'cpu' ?
                <div><CpuUsageWidget deviceDynamic={{} as DeviceLog}></CpuUsageWidget></div> :
                <></>
              }
              {widget.widgetType === 'memory' ?
                <div><CpuUsageWidget deviceDynamic={{} as DeviceLog}></CpuUsageWidget></div> :
                <></>
              }
            </div>,
          )}
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
                    {dashboard.widgets.map((w) => (
                      <div key={w.widgetType} className="d-flex">
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
                          <span>{w.options}</span>
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
