// 3rd Party
import React from 'react';
import {Col, Table, Accordion} from 'react-bootstrap';
import {format} from 'fecha';

// Custom
import {IDeviceLog} from '../../types/device';

const wifiUsageWidget = (props: { deviceDynamic: IDeviceLog, overrideHeader?: JSX.Element }) => {
  const deviceDynamic: IDeviceLog = props.deviceDynamic;

  return (
    <Col className="device-details-accordion dark-accordion pt-3 pb-3">
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            {props.overrideHeader ?
              props.overrideHeader :
              <div className="d-flex w-100 justify-content-around">
                Network Usage Information
              </div>
            }
          </Accordion.Header>
          <Accordion.Body>
            <Table className="device-details-table device-details-table-dark">
              <tbody>
                <tr className="border-bottom">
                  <td className="w-50">Send Speed</td>
                  <td className="float-right">
                    {deviceDynamic?.wifi?.sendSpeed || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Receive Speed</td>
                  <td className="float-right">
                    {deviceDynamic?.wifi?.receiveSpeed || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Signal Strength</td>
                  <td className="float-right">
                    {deviceDynamic?.wifi?.signalStrength || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Timestamp</td>
                  <td className="float-right">
                    {deviceDynamic?.timestamp ?
                      format(
                          new Date(deviceDynamic?.timestamp),
                          'MMM DD, YYYY, h:mm:ss A',
                      ) :
                      'N/A'}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default wifiUsageWidget;
