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
import SortWithThreshold from '../analytics-widgets/sortWithThreshold';

// Custom
import Navbar from '../common/Navbar';
import {IResponse} from '../../types/queries';

const AnalyticsPage = () => {
  const [deviceTableData, setDeviceTableData] = useState([] as IDeviceTotal[]);
  const [metric, setMetric] = useState('');
  const [dIds, setDIds] = useState([] as string[]);
  const [sids, setSids] = useState([] as string[]);
  const [days, setDays] = useState(0);
  const realTimeDataService = useRealTimeService();
  const [deviceHistories, setDeviceHistories] = useState([[]] as IDeviceLog[][]);
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
    const dh = await axios.get<IResponse<Array<IDeviceLog>>>('api/analytics/afterDate',
        {params: {Ids: sids, days: days}});
    console.log(sids+'nnnnnnn');
    console.log(dh.data.Results);
    setDeviceHistories(dh.data.Results);
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
  }, [sids]);
  console.log(deviceHistories);
  return (
    <div className="analytics-container">
      <Navbar />
      <div className="analytics-details-wrapper">
        <div className="h-100 container pe-2 ps-2">
          <Row>
            <Col>
              <Row className="gx-4 d-flex">
                <Col className='w-100 p-2'>
                  <SortWithThreshold
                    title="Overworked CPU Devices"
                    deviceDynamic = {deviceTableData} f = {(a:IDeviceTotal, b:IDeviceTotal) => b?.dynamic?.cpu?.aggregatedPercentage as number - (a?.dynamic?.cpu?.aggregatedPercentage as number) }
                    columnKey= {'dynamic.memory.aggregatedPercentage'}
                    threshold = {80}>
                  </SortWithThreshold>
                </Col>
                <Col className='w-100 p-2'>
                  <SortWithThreshold
                    deviceDynamic = {deviceTableData}
                    title="Overworked Memory Devices" f = {(a:IDeviceTotal, b:IDeviceTotal) => b?.dynamic?.memory?.aggregatedPercentage as number - (a?.dynamic?.memory?.aggregatedPercentage as number) }
                    columnKey= {'dynamic.cpu.aggregatedPercentage'}
                    threshold = {80}>
                  </SortWithThreshold>
                </Col>
                <Col className='w-100 p-2'>
                  <SortWithThreshold
                    deviceDynamic = {deviceTableData}
                    title="Network Speed Monitoring" f = {(a:IDeviceTotal, b:IDeviceTotal) => b?.dynamic?.wifi?.sendSpeed as number - (a?.dynamic?.wifi?.sendSpeed as number) }
                    columnKey= {'dynamic.wifi.sendSpeed'}
                    threshold = {80}>
                  </SortWithThreshold>
                </Col>
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
                                <GraphSettings listOfOptions={dIds} setMetric = {setMetric} setDays = {setDays} setSids = {setSids} sids ={sids}></GraphSettings>
                              </div>
                            </Col>
                            <Col className="analytics-accordion-padding">
                              <div className="graph-widget-padding w-100">
                                <GraphDevices
                                  sids = {sids}
                                  setSids = {setSids}
                                ></GraphDevices>
                              </div>
                            </Col>
                          </Row>
                          <Row className="w-100">
                            <Col className="analytics-accordion-padding">
                              <div className="graph-widget-padding w-100">
                                <GraphDisplay metric = {metric} deviceHistories = {deviceHistories} sids ={sids}></GraphDisplay>
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
