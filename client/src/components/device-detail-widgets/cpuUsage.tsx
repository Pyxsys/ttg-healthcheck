// 3rd Party
import React from 'react';
import {Col, Table, Accordion} from 'react-bootstrap';
import {format} from 'fecha';

// Custom
import {DeviceLog} from '../../types/queries';

const CpuUsageWidget = (props: any) => {
  const deviceDynamic: DeviceLog = props.deviceDynamic;

  return (
    <Col className="device-details-accordion">
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex w-100">CPU Usage Information</div>
          </Accordion.Header>
          <Accordion.Body>
            <Table className="device-details-table">
              <tbody>
                <tr className="border-bottom">
                  <td className="w-50">Usage</td>
                  <td>{deviceDynamic?.cpu?.usageSpeed || 'N/A'}%</td>
                </tr>
                <tr className="border-bottom">
                  <td>Number of Processes</td>
                  <td>{deviceDynamic?.cpu?.numProcesses || 'N/A'}</td>
                </tr>
                <tr className="border-bottom">
                  <td>Threads Sleeping</td>
                  <td>{deviceDynamic?.cpu?.threadsSleeping || 'N/A'}</td>
                </tr>
                <tr className="border-bottom">
                  <td>Timestamp</td>
                  <td>{
                    deviceDynamic?.timestamp ?
                      format(new Date(deviceDynamic?.timestamp), 'MMM DD, YYYY, h:mm:ss A') :
                      'N/A'
                  }</td>
                </tr>
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default CpuUsageWidget;
