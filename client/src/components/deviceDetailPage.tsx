// 3rd Party
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Card, Col, Row, Table} from 'react-bootstrap';

// Custom
import Navbar from './Navbar';
import {IResponse} from '../types/common';
import {Device, MemoryLog, WifiLog, CpuLog, DiskLog} from '../types/queries';

const DeviceDetailPage = (props: any) => {
  const deviceId = props.location.state.id;
  const [deviceData, setDeviceData] = useState({} as Device);
  const [memoryData, setMemoryData] = useState({} as MemoryLog);
  const [wifiData, setWifiData] = useState({} as WifiLog);
  const [cpuData, setCpuData] = useState({} as CpuLog);
  const [diskData, setDiskData] = useState({} as DiskLog);

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

    const cpuResponse = await axios.get<IResponse<CpuLog>>('api/cpu-logs', {
      params: queryParams,
    });
    const cpuLogs = cpuResponse.data.Results;
    setCpuData(cpuLogs[0] || null);

    const memoryResponse = await axios.get<IResponse<MemoryLog>>(
        'api/memory-logs',
        {params: queryParams},
    );
    const memoryLogs = memoryResponse.data.Results;
    setMemoryData(memoryLogs[0] || null);

    const diskResponse = await axios.get<IResponse<DiskLog>>('api/disk-logs', {
      params: queryParams,
    });
    const diskLogs = diskResponse.data.Results;
    setDiskData(diskLogs[0] || null);

    const wifiResponse = await axios.get<IResponse<WifiLog>>('api/wifi-logs', {
      params: queryParams,
    });
    const wifiLogs = wifiResponse.data.Results;
    setWifiData(wifiLogs[0] || null);
  };

  useEffect(() => {
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
                          <td>{deviceData.name}</td>
                        </tr>
                        <tr>
                          <td>Description</td>
                          <td>{deviceData.description}</td>
                        </tr>
                        <tr>
                          <td>Connection Type</td>
                          <td>{deviceData.connectionType}</td>
                        </tr>
                        <tr>
                          <td>Status</td>
                          <td>{deviceData.status}</td>
                        </tr>
                        <tr>
                          <td>Provider</td>
                          <td>{deviceData.provider}</td>
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
                            {cpuData?.usagePercentage}%
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
                            {memoryData?.usagePercentage}%
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
                            {diskData?.activeTimePercent}%
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
                          <td className="w-50">{cpuData?.usagePercentage}%</td>
                        </tr>
                        <tr>
                          <td className="w-50">In Use</td>
                          <td className="w-50">Yes</td>
                        </tr>
                        <tr>
                          <td className="w-50">Number of Processes</td>
                          <td className="w-50">{cpuData?.numProcesses}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Threads Alive</td>
                          <td className="w-50">{cpuData?.threadsAlive}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Threads Sleeping</td>
                          <td className="w-50">{cpuData?.threadsSleeping}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Uptime</td>
                          <td className="w-50">{cpuData?.uptime}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50">{cpuData?.timestamp}</td>
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
                            {memoryData?.usagePercentage}%
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">In Use</td>
                          <td className="w-50">{memoryData?.inUse}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Available</td>
                          <td className="w-50">{memoryData?.available}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Cached</td>
                          <td className="w-50">{memoryData?.cached}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Paged Pool</td>
                          <td className="w-50">{memoryData?.pagedPool}</td>
                        </tr>
                        <tr>
                          <td className="w-50">non Paged Pool</td>
                          <td className="w-50">{memoryData?.nonPagedPool}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50">{memoryData?.timestamp}</td>
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
                          <td className="w-50">Active Time</td>
                          <td className="w-50">
                            {diskData?.activeTimePercent}%
                          </td>
                        </tr>
                        <tr>
                          <td className="w-50">Response Time</td>
                          <td className="w-50">{diskData?.responseTime}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Read Speed</td>
                          <td className="w-50">{diskData?.readSpeed}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Write Speed</td>
                          <td className="w-50">{diskData?.writeSpeed}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50">{diskData?.timestamp}</td>
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
                          <td className="w-50">{wifiData?.sendSpeed}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Receive Speed</td>
                          <td className="w-50">{wifiData?.receiveSpeed}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Signal Strength</td>
                          <td className="w-50">{wifiData?.signalStrength}</td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50">{wifiData?.timestamp}</td>
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
                          <th>
                            <td className="w-100">CPUs</td>
                          </th>
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
                          <th>
                            <td className="w-100">Memory</td>
                          </th>
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
                          <th>
                            <td className="w-100">Disks</td>
                          </th>
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
                            <td className="w-50">{deviceData?.disk?.type}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                    <Row>
                      <Table className="text-left" responsive="sm" hover>
                        <thead>
                          <th>
                            <td className="w-100">WIFIs</td>
                          </th>
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
                          <th>
                            <td className="w-100">Hardware</td>
                          </th>
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
