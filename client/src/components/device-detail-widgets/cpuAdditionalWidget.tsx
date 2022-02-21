// 3rd Party
import React from 'react';
import {Col, Table, Accordion} from 'react-bootstrap';

// Custom
import {IDevice} from '../../types/device';

const cpuAdditionalWidget = (props: { deviceStatic: IDevice, overrideHeader?: JSX.Element }) => {
  const deviceStatic: IDevice = props.deviceStatic;

  return (
    <Col className="device-details-accordion dark-accordion pt-3 pb-3">
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            {props.overrideHeader ?
              props.overrideHeader :
              <div className="d-flex w-100 justify-content-around">
                Additional CPU Information
              </div>
            }
          </Accordion.Header>
          <Accordion.Body>
            <Table className="device-details-table device-details-table-dark">
              <tbody>
                <tr className="border-bottom">
                  <td>Base Speed</td>
                  <td className="float-right">
                    {deviceStatic?.cpu?.baseSpeed || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="w-50">Number Of Cores</td>
                  <td className="float-right">
                    {deviceStatic?.cpu?.cores || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Number Of Processors</td>
                  <td className="float-right">
                    {deviceStatic?.cpu?.processors || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Number Of Scokets</td>
                  <td className="float-right">
                    {deviceStatic?.cpu?.sockets || 'N/A'}
                  </td>
                </tr>
                {deviceStatic?.cpu?.cacheSizeL1 ? (
                  <tr className="border-bottom">
                    <td>Cache Size 1</td>
                    <td>{deviceStatic?.cpu?.cacheSizeL1}</td>
                  </tr>
                ) : (
                  <></>
                )}
                {deviceStatic?.cpu?.cacheSizeL2 ? (
                  <tr className="border-bottom">
                    <td>Cache Size 2</td>
                    <td>{deviceStatic?.cpu?.cacheSizeL2}</td>
                  </tr>
                ) : (
                  <></>
                )}
                {deviceStatic?.cpu?.cacheSizeL3 ? (
                  <tr className="border-bottom">
                    <td>Cache Size 3</td>
                    <td>{deviceStatic?.cpu?.cacheSizeL3}</td>
                  </tr>
                ) : (
                  <></>
                )}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default cpuAdditionalWidget;
