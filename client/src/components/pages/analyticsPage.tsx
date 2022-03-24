// 3rd Party
import React from 'react';
import {Col, Row, Accordion} from 'react-bootstrap';
import GraphSettings from '../analytics-widgets/graphSettings';
import GraphDevices from '../analytics-widgets/graphDevices';
import GraphDisplay from '../analytics-widgets/graphDisplay';
import TableDevices from '../analytics-widgets/tableDevices';
import TableDisplay from '../analytics-widgets/tableDisplay';
import TableLatency from '../analytics-widgets/tableLatency';

// Custom
import Navbar from '../common/Navbar';

const AnalyticsPage = () => {
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
                                <GraphSettings></GraphSettings>
                              </div>
                            </Col>
                            <Col className="analytics-accordion-padding">
                              <div className="graph-widget-padding w-100">
                                <GraphDevices></GraphDevices>
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
