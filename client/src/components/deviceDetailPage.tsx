import React from 'react';
import Navbar from './nav';
import {Card, Col, Row, Table} from 'react-bootstrap';

const DeviceDetailPage = (props: any) => {
  // will define interfaces here for each type of data

  /*
  const [memoryData, setMemoryData] = useState([]);

  const [wifiData, setWifiData] = useState([]);

  const [cpuData, setCpuData] = useState([]);

  const [diskData, setDiskData] = useState([]);
  */
  /*
  const {user} = useAuth();
  */
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
                          <td className="w-50">{props.location.state.id}</td>
                        </tr>
                        <tr>
                          <td>Name</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Description</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Connection Type</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Status</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Provider</td>
                          <td></td>
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
                          <div className="col-12 my-auto">15%</div>
                        </div>
                      </Card.Body>
                    </Card>
                    <Card className=" me-2 w-100 text-center">
                      <Card.Header className="text-center bg-primary text-secondary">
                        Memory
                      </Card.Header>
                      <Card.Body>
                        <div className="row h-100">
                          <div className="col-12 my-auto">35%</div>
                        </div>
                      </Card.Body>
                    </Card>
                    <Card className="w-100 text-center">
                      <Card.Header className="text-center bg-primary text-secondary">
                        Disk
                      </Card.Header>
                      <Card.Body>
                        <div className="row h-100">
                          <div className="col-12 my-auto">25%</div>
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
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">In Use</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Number of Processes</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Threads Alive</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Threads Sleeping</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Uptime</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50"></td>
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
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">In Use</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Available</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Cached</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Paged Pool</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">non Paged Pool</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50"></td>
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
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Response Time</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Read Speed</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Write Speed</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50"></td>
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
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Receive Speed</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Signal Strength</td>
                          <td className="w-50"></td>
                        </tr>
                        <tr>
                          <td className="w-50">Timestamp</td>
                          <td className="w-50"></td>
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
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">Sockets</td>
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">Cores</td>
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">Processors</td>
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">Cache Size L1</td>
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">Cache Size L2</td>
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">Cache Size L3</td>
                            <td className="w-50"></td>
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
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">Form Factor</td>
                            <td className="w-50"></td>
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
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">Type</td>
                            <td className="w-50"></td>
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
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">SSID</td>
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">Connection Type</td>
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">IPV4 Address</td>
                            <td className="w-50"></td>
                          </tr>
                          <tr>
                            <td className="w-50">IPV6 Address</td>
                            <td className="w-50"></td>
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
                            <td className="w-100"></td>
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
