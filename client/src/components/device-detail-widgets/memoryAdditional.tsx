// 3rd Party
import React from 'react';
import {Col, Table, Accordion} from 'react-bootstrap';

// Custom
import {Device} from '../../types/queries';

const MemoryAdditionalWidget = (props: any) => {
  const deviceStatic: Device = props.deviceStatic;

  return (
    <Col className="device-details-accordion dark-accordion pt-3 pb-3">
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex w-100 justify-content-around">
              Additional Memory Information
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <Table className="device-details-table device-details-table-dark">
              <tbody>
                <tr className="border-bottom">
                  <td>Max Size</td>
                  <td className="float-right">
                    {deviceStatic?.memory?.maxSize || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="w-50">Form Factor</td>
                  <td className="float-right">
                    {deviceStatic?.memory?.formFactor || 'N/A'}
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

export default MemoryAdditionalWidget;
