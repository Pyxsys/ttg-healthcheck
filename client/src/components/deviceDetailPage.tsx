import React from 'react';
import Navbar from './nav';
import {Card, Col, Row, Table} from 'react-bootstrap';
import {useAuth} from '../context/authContext';

const DeviceDetailPage = (props: any) => {
  // will define interfaces here for each type of data

  /*
  const [memoryData, setMemoryData] = useState([]);

  const [wifiData, setWifiData] = useState([]);

  const [cpuData, setCpuData] = useState([]);

  const [diskData, setDiskData] = useState([]);
  */

  const {user} = useAuth();

  return (
    <div>
      <Row className="flex-nowrap h-100">
        <Navbar />
        <Col>
          device detail page, user: {user.name}, role: {user.role}
          <Row className="">
            <Col className="">
              <Card className="me-2 mb-2">
                <Card.Header className="text-center bg-primary text-secondary">
                  Device
                </Card.Header>
                <Card.Body>
                  <Table className="text-center" responsive="sm" hover>
                    <tbody>
                      <tr>
                        <td className="w-50">ID</td>
                        <td className="w-50">{props.location.state.id}</td>
                      </tr>
                      <tr>
                        <td>Name</td>
                        <td>Empty</td>
                      </tr>
                      <tr>
                        <td>Description</td>
                        <td>Empty</td>
                      </tr>
                      <tr>
                        <td>Connection Type</td>
                        <td>Empty</td>
                      </tr>
                      <tr>
                        <td>Status</td>
                        <td>Empty</td>
                      </tr>
                      <tr>
                        <td>Provider</td>
                        <td>Empty</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col className="me-2 mb-0">
              <Card className="h-100 border-0 me-4">
                <Card.Body className="mt-0 mb-0 pt-0 pb-0 d-flex">
                  <Card className=" me-2 w-100 text-center">
                    <Card.Header
                      className="text-center bg-primary text-secondary">
                      CPU
                    </Card.Header>
                    <Card.Body>
                      <div className="row h-100">
                        <div className="col-12 my-auto">15%</div>
                      </div>
                    </Card.Body>
                  </Card>
                  <Card className=" me-2 w-100 text-center">
                    <Card.Header
                      className="text-center bg-primary text-secondary">
                      Memory
                    </Card.Header>
                    <Card.Body>
                      <div className="row h-100">
                        <div className="col-12 my-auto">35%</div>
                      </div>
                    </Card.Body>
                  </Card>
                  <Card className="w-100 text-center">
                    <Card.Header
                      className="text-center bg-primary text-secondary">
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
          {/* Row containing columns of cards for various usage information */}
          <Row className="mt-2 d-flex">
            <Col>
              <Card className="me-2 mb-2">
                <Card.Header className="text-center bg-primary text-secondary">
                  CPU Usage
                </Card.Header>
                <Card.Body>
                  <Table className="text-center" responsive="sm" hover>
                    <tbody>
                      <tr>
                        <td className="w-50">ID</td>
                        <td className="w-50">{props.location.state.id}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="me-2 mb-2">
                <Card.Header className="text-center bg-primary text-secondary">
                  Memory Usage
                </Card.Header>
                <Card.Body>
                  <Table className="text-center" responsive="sm" hover>
                    <tbody>
                      <tr>
                        <td className="w-50">ID</td>
                        <td className="w-50">{props.location.state.id}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="me-2 mb-2">
                <Card.Header className="text-center bg-primary text-secondary">
                  Disk Usage
                </Card.Header>
                <Card.Body>
                  <Table className="text-center" responsive="sm" hover>
                    <tbody>
                      <tr>
                        <td className="w-50">ID</td>
                        <td className="w-50">{props.location.state.id}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="me-2 mb-2">
                <Card.Header className="text-center bg-primary text-secondary">
                  Wifi Usage
                </Card.Header>
                <Card.Body>
                  <Table className="text-center" responsive="sm" hover>
                    <tbody>
                      <tr>
                        <td className="w-50">ID</td>
                        <td className="w-50">{props.location.state.id}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default DeviceDetailPage;
