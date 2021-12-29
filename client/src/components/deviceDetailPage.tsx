// 3rd Party
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Card, Col, Row, Table} from 'react-bootstrap';

// Custom
import Navbar from './Navbar';
import {Device, DeviceLog, IResponse} from '../types/queries';
import {useRealTimeService} from '../context/realTimeContext';

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

  return (
    <div id="outer-container">
      <Navbar />
      <div id="page-wrap" className="h-100 overflow-auto container pe-0 ps-0">
        <Row>
          <Col>
            <Row className="d-flex pb-0">
              <Col className="">
                <Card className=" ">
                  <Card.Header className="text-center bg-primary text-secondary">
                    Device
                  </Card.Header>
                  <Card.Body>
                    <Table className="text-center table-responsive" hover>
                      <tbody>
                        <tr>
                          <td className="w-50">ID</td>
                          <td className="w-50">{deviceId}</td>
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
                  </Card.Body>
                </Card>
              </Col>
              <Col className="mb-0">
                <Card className="h-100 border-0">
                  <Card.Body className="mt-0 mb-0 pt-0 pb-0 d-flex">
                    <Card className=" me-2 w-100 text-center">
                      <Card.Header className="text-center bg-primary text-secondary">
                        CPU
                      </Card.Header>
                      <Card.Body>
                        <div className="row h-100">
                          <div className="col-12 my-auto">
                            {deviceLogsData?.cpu?.aggregatedPercentage}%
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                    <Card className=" me-2 w-100 text-center">
                      <Card.Header className="text-center bg-primary text-secondary">
                        Memory
                      </Card.Header>
                      <Card.Body>
                        <div className="row h-100">
                          <div className="col-12 my-auto">
                            {deviceLogsData?.memory?.aggregatedPercentage}%
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                    <Card className="w-100 text-center">
                      <Card.Header className="text-center bg-primary text-secondary">
                        Disk
                      </Card.Header>
                      <Card.Body>
                        <div className="row h-100">
                          <div className="col-12 my-auto">
                            {deviceLogsData?.disk?.partitions?.reduce(
                                (sum, p) => sum + p.percent,
                                0,
                            ) / deviceLogsData?.disk?.partitions?.length}
                            %
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* Row containing columns of cards for
          various usage information */}
            <Row className="mt-2 mb-2 d-flex">
              <Col>
                <Card className="h-100 me-2 mb-2">
                  <Card.Header className="text-center bg-primary text-secondary">
                    CPU Usage
                  </Card.Header>
                  <Card.Body>
                    <Table className="text-center" responsive="sm" hover>
                      <tbody>
                        <tr>
                          <td className="w-50">Usage</td>
                          <td className="w-50">
                            {deviceLogsData?.cpu?.aggregatedPercentage}%
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">In Use</td>
                          <td className="w-50">Yes</td>
                        </tr>
                        <tr>
                          <td className="w-50">Number of Processes</td>
                          <td className="w-50">
                            {deviceLogsData?.cpu?.numProcesses}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Threads Sleeping</td>
                          <td className="w-50">
                            {deviceLogsData?.cpu?.threadsSleeping}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50">{deviceLogsData?.timestamp}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="h-100 me-2 mb-2">
                  <Card.Header className="text-center bg-primary text-secondary">
                    Memory Usage
                  </Card.Header>
                  <Card.Body>
                    <Table className="text-center" responsive="sm" hover>
                      <tbody>
                        <tr>
                          <td className="w-50">Usage</td>
                          <td className="w-50">
                            {deviceLogsData?.memory?.aggregatedPercentage}%
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">In Use</td>
                          <td className="w-50">
                            {deviceLogsData?.memory?.inUse}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Available</td>
                          <td className="w-50">
                            {deviceLogsData?.memory?.available}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Cached</td>
                          <td className="w-50">
                            {deviceLogsData?.memory?.cached}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50">{deviceLogsData?.timestamp}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="h-100 me-2 mb-2">
                  <Card.Header className="text-center bg-primary text-secondary">
                    Disk Usage
                  </Card.Header>
                  <Card.Body>
                    <Table className="text-center" responsive="sm" hover>
                      <tbody>
                        <tr>
                          <td className="w-50">Partition Percent</td>
                          <td className="w-50">
                            {deviceLogsData?.disk?.partitions[0]?.percent}%
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Response Time</td>
                          <td className="w-50">
                            {deviceLogsData?.disk?.disks[0]?.responseTime}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Read Speed</td>
                          <td className="w-50">
                            {deviceLogsData?.disk?.disks[0]?.readSpeed}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Write Speed</td>
                          <td className="w-50">
                            {deviceLogsData?.disk?.disks[0]?.writeSpeed}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50">{deviceLogsData?.timestamp}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="h-100 me-2 mb-2">
                  <Card.Header className="text-center bg-primary text-secondary">
                    Wifi Usage
                  </Card.Header>
                  <Card.Body>
                    <Table className="text-center" responsive="sm" hover>
                      <tbody>
                        <tr>
                          <td className="w-50">Send Speed</td>
                          <td className="w-50">
                            {deviceLogsData?.wifi?.sendSpeed}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Receive Speed</td>
                          <td className="w-50">
                            {deviceLogsData?.wifi?.receiveSpeed}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Signal Strength</td>
                          <td className="w-50">
                            {deviceLogsData?.wifi?.signalStrength}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50">{deviceLogsData?.timestamp}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card className="h-100 me-2 mb-2">
                  <Card.Header className="text-center bg-primary text-secondary">
                    Additional Information
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Table className="text-left" responsive="sm" hover>
                        <thead>
                          <tr>
                            <th className="w-100">CPUs</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="w-50">Base Speed</td>
                            <td className="w-50">
                              {deviceData?.cpu?.baseSpeed}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-50">Sockets</td>
                            <td className="w-50">{deviceData?.cpu?.sockets}</td>
                          </tr>
                          <tr>
                            <td className="w-50">Cores</td>
                            <td className="w-50">{deviceData?.cpu?.cores}</td>
                          </tr>
                          <tr>
                            <td className="w-50">Processors</td>
                            <td className="w-50">
                              {deviceData?.cpu?.processors}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-50">Cache Size L1</td>
                            <td className="w-50">
                              {deviceData?.cpu?.cacheSizeL1}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-50">Cache Size L2</td>
                            <td className="w-50">
                              {deviceData?.cpu?.cacheSizeL2}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-50">Cache Size L3</td>
                            <td className="w-50">
                              {deviceData?.cpu?.cacheSizeL3}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                    <Row>
                      <Table className="text-left" responsive="sm" hover>
                        <thead>
                          <tr>
                            <th className="w-100">Memory</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="w-50">Max Size</td>
                            <td className="w-50">
                              {deviceData?.memory?.maxSize}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-50">Form Factor</td>
                            <td className="w-50">
                              {deviceData?.memory?.formFactor}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                    <Row>
                      <Table className="text-left" responsive="sm" hover>
                        <thead>
                          <tr>
                            <th className="w-100">Disks</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="w-50">Capactiy</td>
                            <td className="w-50">
                              {deviceData?.disk?.capacity}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-50">Type</td>
                            <td className="w-50">
                              {deviceData?.disk?.disks[0]?.type}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                    <Row>
                      <Table className="text-left" responsive="sm" hover>
                        <thead>
                          <tr>
                            <th className="w-100">WIFIs</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="w-50">Adapter Name</td>
                            <td className="w-50">
                              {deviceData?.wifi?.adapterName}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-50">SSID</td>
                            <td className="w-50">{deviceData?.wifi?.SSID}</td>
                          </tr>
                          <tr>
                            <td className="w-50">Connection Type</td>
                            <td className="w-50">
                              {deviceData?.wifi?.connectionType}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-50">IPV4 Address</td>
                            <td className="w-50">
                              {deviceData?.wifi?.ipv4Address}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-50">IPV6 Address</td>
                            <td className="w-50">
                              {deviceData?.wifi?.ipv6Address}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                    <Row>
                      <Table className="text-left" responsive="sm" hover>
                        <thead>
                          <tr>
                            <th className="w-100">Hardware</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="w-100">
                              {deviceData?.hardware?.harwareName}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DeviceDetailPage;
