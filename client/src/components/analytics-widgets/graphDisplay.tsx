import React from 'react';
import {Col, Accordion} from 'react-bootstrap';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const graphDisplay = (_props: any) => {
  return (
    <Col className="graph-dark-accordion analytics-accordion">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className="analytics-accordion-item">
          <Accordion.Header>
            <div className="d-flex w-100 justify-content-around">Display</div>
          </Accordion.Header>
          <Accordion.Body></Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default graphDisplay;
