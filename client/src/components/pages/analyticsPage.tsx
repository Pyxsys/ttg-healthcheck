// 3rd Party
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Col, Row, Accordion} from 'react-bootstrap';

// Custom
import GraphSettings from '../analytics-widgets/graphSettings';
import GraphDevices from '../analytics-widgets/graphDevices';
import GraphDisplay from '../analytics-widgets/graphDisplay';
import {IDevice, IDeviceLog, IDeviceTotal} from '../../types/device';
import {useRealTimeService} from '../../context/realTimeContext';
import TableDevices from '../analytics-widgets/tableDevices';
import TableDisplay from '../analytics-widgets/tableDisplay';
import TableLatency from '../analytics-widgets/tableLatency';

// Custom
import Navbar from '../common/Navbar';
import {IResponse} from '../../types/queries';

const AnalyticsPage = () => {
  const [deviceTableData, setDeviceTableData] = useState([] as IDeviceTotal[]);
  const [dIds, setDIds] = useState([] as String[]);
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
    setDIds(deviceIds);
    console.log(deviceIds);
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

    setDeviceTableData(tableDevices);
    realTimeDataService.setDeviceIds(deviceIds);
  };

  useEffect(() => {
    initialRealTimeData();
    queryTable();
  }, []);

  return (
    <div className="analytics-container">
      <Navbar />
      <div className="analytics-details-wrapper">
        <div className="h-100 container pe-2 ps-2">
          <Row>
            <Col>
              <Row className="gx-4">
                <TableDevices title="Overworked CPU Devices"></TableDevices>
                <TableDisplay title="Overworked Memory Devices"></TableDisplay>
                <TableLatency title="Latency Monitoring"></TableLatency>
              </Row>
              <Row>
                <Col className="analytics-accordion analytics-accordion-padding">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item
                      eventKey="0"
                      className="analytics-accordion-item"
                    >
                      <Accordion.Header>
                        <div className="d-flex w-100 justify-content-around">
                          Graph
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="align-items-start analytics-accordion-body-2">
                        <div className="graph-accordion-body w-100 justify-content-center">
                          <Row className="w-100">
                            <Col className="analytics-accordion-padding">
                              <div className="graph-widget-padding w-100">
                                <GraphSettings listOfOptions={dIds}></GraphSettings>
                              </div>
                            </Col>
                            <Col className="analytics-accordion-padding">
                              <div className="graph-widget-padding w-100">
                                <GraphDevices
                                  deviceDynamic={deviceTableData}
                                ></GraphDevices>
                              </div>
                            </Col>
                          </Row>
                          <Row className="w-100">
                            <Col className="analytics-accordion-padding">
                              <div className="graph-widget-padding w-100">
                                <GraphDisplay></GraphDisplay>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
