import React from 'react';
import {Col, Accordion} from 'react-bootstrap';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateOptions = (listOfOptions : Array<String>) => {
  let returnString = '';
  for (let i = 0; i < listOfOptions.length; i++) {
    returnString += '<option>' + listOfOptions[i] + '</option>';
  }
  return returnString;
};
const graphSettings = (_props: any) => {
  return (
    <Col className="graph-dark-accordion analytics-accordion">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className="analytics-accordion-item">
          <Accordion.Header>
            <div className="d-flex w-100 justify-content-around">Settings</div>
          </Accordion.Header>
          <Accordion.Body>
            <div className="settings-body-wrapper">
              <span className="settings-spans">Add Device</span>
              <select
                className="form-select form-select-sm w-100 mx-2 my-2"
                defaultValue={'DEFAULT'}
                onChange={() => {}}
              >
                <option value="">Place Holder</option>
                {generateOptions(_props[0])}
              </select>
              <span className="settings-spans">Selected Metric</span>
              <select
                className="form-select form-select-sm w-100 mx-2 my-2"
                defaultValue={'DEFAULT'}
                onChange={() => {}}
              >
                <option value="">CPU Usage</option>
                <option value="">Memory Usage</option>
                <option value="">Disk Usage</option>
                <option value="">Latency</option>
              </select>
              <span className="settings-spans">Selected Time Range</span>
              <select
                className="form-select form-select-sm w-100 mx-2 my-2"
                defaultValue={'DEFAULT'}
                onChange={() => {}}
              >
                <option value="">Day</option>
                <option value="">Week</option>
                <option value="">Month</option>
                <option value="">Year</option>
              </select>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default graphSettings;
