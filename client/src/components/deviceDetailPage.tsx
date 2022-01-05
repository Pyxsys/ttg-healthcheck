// 3rd Party
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Col, Row, Table, Accordion} from 'react-bootstrap';

// Custom
import Navbar from './Navbar';
import {Device, DeviceLog, IResponse} from '../types/queries';
import {useRealTimeService} from '../context/realTimeContext';
import Pie from './common/pieWheel';

const DeviceDetailPage = (props: any) => {
  const deviceId: string = props.location.state.id;
  const [deviceData, setDeviceData] = useState({} as Device);
  const [deviceLogsData, setDeviceLogsData] = useState({} as DeviceLog);

  const realTimeDataService = useRealTimeService();

  const initialRealTimeData = () => {
    realTimeDataService.setDeviceIds([deviceId]);
    realTimeDataService.getRealTimeData((device) => {
      setDeviceLogsData(device);
    });
  };

  const queryLogs = async () => {
    const queryParams = {
      deviceId: deviceId,
      limit: 1,
    };

    const deviceResponse = await axios.get<IResponse<Device>>('api/device', {
      params: queryParams,
    });
    const devices = deviceResponse.data.Results;
    setDeviceData(devices[0] || null);

    const deviceLogResponse = await axios.get<IResponse<DeviceLog>>(
        'api/device-logs',
        {
          params: queryParams,
        },
    );
    const deviceLogs = deviceLogResponse.data.Results;
    setDeviceLogsData(deviceLogs[0] || null);
  };

  useEffect(() => {
    initialRealTimeData();
    queryLogs();
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

  return (
    <div id="device-details-container">
      <Navbar />
      <div id="device-details-wrapper" className="h-100 container pe-0 ps-0 overflow-hidden">
        <Row>
          <Col>
            <Row className="d-flex gx-5">
              <Col xs={12} sm={12} md={12} lg={12} xl={4}>
                <Accordion defaultActiveKey="0" flush className="device-details-accordion">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <div className="d-flex w-100">Device</div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Table className="device-details-table">
                        <tbody>
                          <tr>
                            <td className="w-50">ID</td>
                            <td>{deviceId}</td>
                          </tr>
                          <tr>
                            <td>Name</td>
                            <td>{deviceData?.name}</td>
                          </tr>
                          <tr>
                            <td>Description</td>
                            <td>{deviceData?.description}</td>
                          </tr>
                          <tr>
                            <td>Connection Type</td>
                            <td>{deviceData?.connectionType}</td>
                          </tr>
                          <tr>
                            <td>Status</td>
                            <td>{deviceData?.status}</td>
                          </tr>
                          <tr>
                            <td>Provider</td>
                            <td>{deviceData?.provider}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={8}>
                <Accordion defaultActiveKey="0" flush className="device-details-accordion">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <div className="d-flex w-100 justify-content-around">
                        <div>CPU</div>
                        <div>Memory</div>
                        <div>Disk</div>
                        <div>Wifi</div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="d-flex justify-content-center pt-5 w-100">
                        <div><Pie percentage={deviceLogsData?.cpu?.aggregatedPercentage}/></div>
                        <div><Pie percentage={deviceLogsData?.memory?.aggregatedPercentage}/></div>
                        <div><Pie percentage={deviceLogsData?.disk?.partitions?.reduce(
                            (sum, p) => sum + p.percent,
                            0,
                        ) / deviceLogsData?.disk?.partitions?.length}/></div>
                        <div><Pie percentage={88}/></div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
            <Row className="d-flex pt-5">
              <Col>
                <Accordion defaultActiveKey="0" flush className="device-details-accordion">
                  <Accordion.Item eventKey="0">
                    <div>
                      <Accordion.Header>Device</Accordion.Header>
                    </div>
                    <Accordion.Body>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DeviceDetailPage;
