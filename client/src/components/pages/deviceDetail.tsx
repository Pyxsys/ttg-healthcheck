// 3rd Party
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Col, Row, Table, Accordion, Tabs, Tab} from 'react-bootstrap';

// Custom
import Navbar from '../common/Navbar';
import {IResponse} from '../../types/queries';
import {IDevice, IDeviceLog} from '../../types/device';
import {useRealTimeService} from '../../context/realTimeContext';
import PieWheel from '../common/pieWheel';
import CpuUsageWidget from '../device-detail-widgets/cpuUsageWidget';
import CpuAdditionalWidget from '../device-detail-widgets/cpuAdditionalWidget';
import DiskUsageWidget from '../device-detail-widgets/diskUsageWidget';
import DiskAdditionalWidget from '../device-detail-widgets/diskAdditionalWidget';
import MemoryUsageWidget from '../device-detail-widgets/memoryUsageWidget';
import MemoryAdditionalWidget from '../device-detail-widgets/memoryAdditionalWidget';
import WifiUsageWidget from '../device-detail-widgets/wifiUsageWidget';
import WifiAdditionalWidget from '../device-detail-widgets/wifiAdditionalWidget';
import {SignalStrength} from '../common/signalStrength';
import ProcessTable from '../device-detail-widgets/processTable';

const DeviceDetail = (props: any) => {
  const getSearchParam = (key: string): string => {
    const search: string = props.location.search;
    const allParams = search.replace('?', '').split('&');
    const found = allParams.find((param) => param.startsWith(`${key}=`));
    return found?.split('=')[1] || '';
  };

  const deviceId: string = getSearchParam('Id');
  const [deviceData, setDeviceData] = useState({} as IDevice);
  const [deviceLogsData, setDeviceLogsData] = useState({} as IDeviceLog);

  const realTimeDataService = useRealTimeService();

  const initialRealTimeData = () => {
    realTimeDataService.setDeviceIds([deviceId]);
    realTimeDataService.getRealTimeData((device) => {
      setDeviceLogsData(device);
    });
  };

  const queryLogs = async () => {
    if (!deviceId) return;

    const queryParams = {
      deviceId: deviceId,
      limit: 1,
    };

    const deviceResponse = await axios.get<IResponse<IDevice>>('api/device', {
      params: queryParams,
    });
    const devices = deviceResponse.data.Results;
    setDeviceData(devices[0] || null);

    const deviceLogResponse = await axios.get<IResponse<IDeviceLog>>(
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
      <div className="device-details-wrapper">
        <div className="h-100 container pe-2 ps-2">
          <Row>
            <Col>
              <Row className="gx-4">
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={4}
                  xl={4}
                  className="device-details-accordion"
                >
                  <Accordion defaultActiveKey="0" flush>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <div className="d-flex w-100 justify-content-around">
                          Device
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Table className="device-details-table">
                          <tbody>
                            <tr>
                              <td
                                className="w-50"
                                style={{fontWeight: '600'}}
                              >
                                ID
                              </td>
                              <td style={{fontStyle: 'italic'}}>
                                {deviceData?.deviceId}
                              </td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>Name</td>
                              <td style={{fontStyle: 'italic'}}>
                                {deviceData?.name}
                              </td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>Description</td>
                              <td style={{fontStyle: 'italic'}}>
                                {deviceData?.description}
                              </td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>
                                Connection Type
                              </td>
                              <td style={{fontStyle: 'italic'}}>
                                {deviceData?.connectionType}
                              </td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>Status</td>
                              <td style={{fontStyle: 'italic'}}>
                                {deviceData?.status}
                              </td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>Provider</td>
                              <td style={{fontStyle: 'italic'}}>
                                {deviceData?.provider}
                              </td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>
                                Hardware Name
                              </td>
                              <td style={{fontStyle: 'italic'}}>
                                {deviceData?.hardware?.harwareName}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={8}
                  className="device-details-accordion device-details-second-accordion"
                >
                  <Accordion defaultActiveKey="0" flush>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <div className="d-flex w-100 justify-content-around">
                          <div>CPU</div>
                          <div>Memory</div>
                          <div>Disk</div>
                          <div>Network</div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="d-flex justify-content-center">
                          <div>
                            <PieWheel
                              percentage={
                                deviceLogsData?.cpu?.aggregatedPercentage
                              }
                              text={true}
                            />
                          </div>
                          <div>
                            <PieWheel
                              percentage={
                                deviceLogsData?.memory?.aggregatedPercentage
                              }
                              text={true}
                            />
                          </div>
                          <div>
                            <PieWheel
                              percentage={
                                deviceLogsData?.disk?.partitions?.reduce(
                                    (sum, p) => sum + p.percent,
                                    0,
                                ) / deviceLogsData?.disk?.partitions?.length
                              }
                              text={true}
                            />
                          </div>
                          <div>
                            <SignalStrength
                              level={Number(
                                  deviceLogsData?.wifi?.signalStrength,
                              )}
                              showText={true}
                            />
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
              </Row>
              <Row>
                <Col className="device-details-tabs">
                  <Tabs defaultActiveKey="cpu">
                    <Tab eventKey="cpu" title="CPU">
                      <div className="tab-body d-flex justify-content-center">
                        <Row className="w-100">
                          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <div className="tab-widget-padding w-100">
                              <CpuUsageWidget
                                deviceDynamic={deviceLogsData}
                              ></CpuUsageWidget>
                            </div>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <div className="tab-widget-padding w-100">
                              <CpuAdditionalWidget
                                deviceStatic={deviceData}
                              ></CpuAdditionalWidget>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                    <Tab eventKey="memory" title="Memory">
                      <div className="tab-body d-flex justify-content-center">
                        <Row className="w-100">
                          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <div className="tab-widget-padding w-100">
                              <MemoryUsageWidget
                                deviceDynamic={deviceLogsData}
                              ></MemoryUsageWidget>
                            </div>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <div className="tab-widget-padding w-100">
                              <MemoryAdditionalWidget
                                deviceStatic={deviceData}
                              ></MemoryAdditionalWidget>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                    <Tab eventKey="disk" title="Disk">
                      <div className="tab-body d-flex justify-content-around">
                        <Row className="w-100">
                          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <div className="tab-widget-padding w-100">
                              <DiskUsageWidget
                                deviceDynamic={deviceLogsData}
                              ></DiskUsageWidget>
                            </div>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <div className="tab-widget-padding w-100">
                              <DiskAdditionalWidget
                                deviceStatic={deviceData}
                              ></DiskAdditionalWidget>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                    <Tab eventKey="wifi" title="Network">
                      <div className="tab-body d-flex justify-content-around">
                        <Row className="w-100">
                          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <div className="tab-widget-padding w-100">
                              <WifiUsageWidget
                                deviceDynamic={deviceLogsData}
                              ></WifiUsageWidget>
                            </div>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <div className="tab-widget-padding w-100">
                              <WifiAdditionalWidget
                                deviceStatic={deviceData}
                              ></WifiAdditionalWidget>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                    <Tab eventKey="processes" title="Processes">
                      <div className="tab-body">
                        <ProcessTable
                          deviceDynamic={deviceLogsData}
                        ></ProcessTable>
                      </div>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
