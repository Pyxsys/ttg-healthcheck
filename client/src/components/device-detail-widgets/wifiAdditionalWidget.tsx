// 3rd Party
import React from 'react';
import {Col, Table, Accordion} from 'react-bootstrap';

// Custom
import {IDevice} from '../../types/device';

const wifiAdditionalWidget = (props: { deviceStatic: IDevice, overrideHeader?: JSX.Element }) => {
  const deviceStatic: IDevice = props.deviceStatic;

  return (
    <Col className="device-details-accordion dark-accordion pt-3 pb-3">
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            {props.overrideHeader ?
              props.overrideHeader :
              <div className="d-flex w-100 justify-content-around">
                Additional Network Information
              </div>
            }
          </Accordion.Header>
          <Accordion.Body>
            <Table className="device-details-table device-details-table-dark">
              <tbody>
                <tr className="border-bottom">
                  <td>Adapter Name</td>
                  <td className="float-right">
                    {deviceStatic?.wifi?.adapterName || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="w-50">SSID</td>
                  <td className="float-right">
                    {deviceStatic?.wifi?.SSID || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="w-50">Connection Type</td>
                  <td className="float-right">
                    {deviceStatic?.wifi?.connectionType || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="w-50">IPV4 Address</td>
                  <td className="float-right">
                    {deviceStatic?.wifi?.ipv4Address || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="w-50">IPV6 Address</td>
                  <td className="float-right">
                    {deviceStatic?.wifi?.ipv6Address || 'N/A'}
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

export default wifiAdditionalWidget;
