import React from 'react';
import {Col, Accordion} from 'react-bootstrap';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateOptions = (listOfOptions: String[]) => {
  const returnString = [];
  console.log(listOfOptions.length);
  for (let i = 0; i < listOfOptions.length; i++) {
    console.log(i);
    returnString.push(<option key= {i}>{listOfOptions[i]}</option>);
  }
  return returnString;
};
const graphSettings = (Props:any) => {
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
                {generateOptions(Props.listOfOptions)}
                <option value="">Place Holder</option>
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
