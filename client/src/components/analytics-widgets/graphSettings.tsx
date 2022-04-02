import React from 'react';
import {Col, Accordion} from 'react-bootstrap';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateOptions = (listOfOptions: string[]) => {
  const returnString = [];
  console.log(listOfOptions.length);
  for (let i = 0; i < listOfOptions.length; i++) {
    console.log(i);
    returnString.push(<option key= {i} value = {listOfOptions[i].toString()}>{listOfOptions[i]}</option>);
  }
  return returnString;
};
const graphSettings = (Props:any) => {
  return (
    <Col className='graph-dark-accordion analytics-accordion'>
      <Accordion defaultActiveKey='0'>
        <Accordion.Item eventKey='0' className='analytics-accordion-item'>
          <Accordion.Header>
            <div className='d-flex w-100 justify-content-around'>Settings</div>
          </Accordion.Header>
          <Accordion.Body>
            <div className="settings-body-wrapper">
              <span className="settings-spans">Add Device</span>
              <select
                className="form-select form-select-sm w-100 mx-2 my-2"
                defaultValue={'DEFAULT'}
                onChange={(e) => {
                  if (!Props.sids||!Props.sids.includes(e.target.value)) {
                    Props.setSids([...Props.sids, e.target.value]);
                  }
                }}
              >
                {generateOptions(Props.listOfOptions)}
                <option value="">Place Holder</option>
              </select>
              <span className="settings-spans">Selected Metric</span>
              <select
                className="form-select form-select-sm w-100 mx-2 my-2"
                defaultValue={'DEFAULT'}
                onChange={(e) => Props.setMetric(e.target.value)}
              >
                <option value="">Nothing</option>
                <option value="cpu.aggregatedPercentage">CPU Usage</option>
                <option value="memory.aggregatedPercentage">Memory Usage</option>
                <option value="">Disk Usage</option>
                <option value="">Latency</option>
              </select>
              <span className="settings-spans">Selected Time Range</span>
              <select
                className="form-select form-select-sm w-100 mx-2 my-2"
                defaultValue={'DEFAULT'}
                onChange={(e) => {
                  Props.setDays(e.target.value);
                }}
              >
                <option value={1}>Day</option>
                <option value={7}>Week</option>
                <option value={30}>Month</option>
              </select>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default graphSettings;
