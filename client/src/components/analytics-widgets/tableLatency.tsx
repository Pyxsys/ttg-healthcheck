// 3rd Party
import React from 'react';
import {Col, Accordion} from 'react-bootstrap';

const TableLatency = (_props: any) => {
  return (
    <Col xs={12} sm={12} md={12} lg={4} xl={4} className="analytics-accordion">
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0" className="analytics-accordion-item">
          <Accordion.Header>
            <div className="d-flex w-100 justify-content-around">
              {_props.title}
            </div>
          </Accordion.Header>
          <Accordion.Body className="analytics-accordion-body"></Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default TableLatency;
