// 3rd Party
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Col, Row, Table, Accordion, Tabs, Tab} from 'react-bootstrap';

// Custom
import Navbar from '../common/Navbar';
import {IResponse} from '../../types/queries';
import {IDevice, IDeviceLog} from '../../types/device';
import {useRealTimeService} from '../../context/realTimeContext';
import {exportCSV} from '../../services/export.service';
import PieWheel from '../common/pieWheel';
import CpuUsageWidget from '../device-detail-widgets/cpuUsageWidget';
import CpuAdditionalWidget from '../device-detail-widgets/cpuAdditionalWidget';
import DiskUsageWidget from '../device-detail-widgets/diskUsageWidget';
import DiskAdditionalWidget from '../device-detail-widgets/diskAdditionalWidget';
import MemoryUsageWidget from '../device-detail-widgets/memoryUsageWidget';
import MemoryAdditionalWidget from '../device-detail-widgets/memoryAdditionalWidget';
import WifiUsageWidget from '../device-detail-widgets/wifiUsageWidget';
import WifiAdditionalWidget from '../device-detail-widgets/wifiAdditionalWidget';
import {SignalStrength, signalText} from '../common/signalStrength';
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

    await axios
        .get<IResponse<IDevice>>('api/device', {
          params: queryParams,
        })
        .then((deviceResponse) => {
          const devices = deviceResponse.data.Results;
          setDeviceData(devices[0] || null);
          axios
              .get<IResponse<IDeviceLog>>('api/device-logs', {
                params: queryParams,
              })
              .then((deviceLogResponse) => {
                const deviceLogs = deviceLogResponse.data.Results;
                setDeviceLogsData(deviceLogs[0] || null);
              })
              .catch((error) => {
                console.error(error);
              });
        })
        .catch((error) => {
          console.log(error);
        });
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

  const getDeviceCSV = (): void => {
    const deviceValue = [{
      UUID: deviceData.deviceId,
      Name: deviceData.name,
      Description: deviceData.description,
      Connection_Type: deviceData.connectionType,
      Status: deviceData.status,
      Provider: deviceData.provider,
      Hardware: deviceData.hardware?.harwareName,
      CPU_Base_Speed: deviceData.cpu?.baseSpeed,
      CPU_Num_Cores: deviceData.cpu?.cores,
      CPU_Num_Processors: deviceData.cpu?.processors,
      CPU_Num_Sockets: deviceData.cpu?.sockets,
      CPU_Total_Perentage: deviceLogsData?.cpu?.aggregatedPercentage,
      CPU_Usage: deviceLogsData?.cpu?.usageSpeed,
      CPU_Num_Processes: deviceLogsData?.cpu?.numProcesses,
      CPU_Threads_Sleeping: deviceLogsData?.cpu?.threadsSleeping,
      Memory_Max_Size: deviceData.memory?.maxSize,
      Memory_Form_Factor: deviceData.memory?.formFactor,
      Memory_Total_Percentage: deviceLogsData?.memory?.aggregatedPercentage,
      Memory_In_Use: deviceLogsData?.memory?.inUse,
      Memory_Available: deviceLogsData?.memory?.available,
      Memory_Cached: deviceLogsData?.memory?.cached,
      Disk_Capacity: deviceData.disk?.capacity,
      Disk_Type: deviceData.disk?.disks[0]?.type,
      Disk_Model: deviceData.disk?.disks[0]?.model,
      Disk_Size: deviceData.disk?.disks[0]?.size,
      Disk_Partition_Path: deviceLogsData?.disk?.partitions[0]?.path,
      Disk_Partition_Percentage: deviceLogsData?.disk?.partitions[0]?.percent,
      Disk_Response_Time: deviceLogsData?.disk?.disks[0]?.responseTime,
      Disk_Read_Time: deviceLogsData?.disk?.disks[0]?.readSpeed,
      Disk_Write_Time: deviceLogsData?.disk?.disks[0]?.writeSpeed,
      Network_Adapter_Name: deviceData.wifi?.adapterName,
      Network_SSID: deviceData.wifi?.SSID,
      Network_Coonection_Type: deviceData.wifi?.connectionType,
      Network_IPV4_Address: deviceData.wifi?.ipv4Address,
      Network_IPV6_Address: deviceData.wifi?.ipv6Address,
      Network_Send_Speed: deviceLogsData?.wifi?.sendSpeed,
      Network_Receive_Speed: deviceLogsData?.wifi?.receiveSpeed,
      Network_Signal_Strength: signalText(deviceLogsData?.wifi?.signalStrength || -1) || undefined,
      Timestamp: deviceLogsData?.timestamp,
    }];
    exportCSV(deviceValue, `device-${deviceData.deviceId}`);
  };

  const getProcessesCSV = (): void => {
    if (deviceLogsData?.processes?.length > 0) {
      const processValues = deviceLogsData?.processes?.map((process) => ({
        ID: process.pid,
        Name: process.name,
        CPU: process.cpu?.usagePercentage,
        Memory: process.memory?.usagePercentage,
        Status: process.status,
      }));
      exportCSV(processValues, `processes-${deviceData.deviceId}`);
    }
  };

  return (
    <div id="device-details-container">
      <Navbar name="Device details"/>
      <div className="device-details-wrapper">
        <div className="h-100 container pe-2 ps-2">
          <Row>
            <Col>
              <div className="d-flex">
                <div className="p-1 ms-auto">
                  <button className="btn btn-primary" onClick={() => getDeviceCSV()}>Export as CSV</button>
                </div>
              </div>

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
                              <td>{deviceData?.deviceId}</td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>Name</td>
                              <td>{deviceData?.name}</td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>Description</td>
                              <td>{deviceData?.description}</td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>
                                Connection Type
                              </td>
                              <td>{deviceData?.connectionType}</td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>Status</td>
                              <td>{deviceData?.status}</td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>Provider</td>
                              <td>{deviceData?.provider}</td>
                            </tr>
                            <tr>
                              <td style={{fontWeight: '600'}}>
                                Hardware Name
                              </td>
                              <td>{deviceData?.hardware?.harwareName}</td>
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
                              strength={Number(
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
                        <div className="d-flex flex-column">
                          <div className="p-1 ms-auto">
                            <button
                              className="btn btn-primary"
                              disabled={!deviceLogsData?.processes?.length}
                              onClick={() => getProcessesCSV()}>
                                Export Processes as CSV
                            </button>
                          </div>

                          <ProcessTable
                            deviceDynamic={deviceLogsData}
                          ></ProcessTable>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Col>
            <div className="d-flex justify-content-center devices-footer">
              <div className="pt-1 pb-3 devices-copyright">
                &#169; SOEN490 TTG-HEALTCHECK
              </div>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
