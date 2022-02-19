// 3rd Party
import React from 'react';
import {Col, Table, Accordion} from 'react-bootstrap';
import {format} from 'fecha';

// Custom
import {IDeviceLog} from '../../types/device';

const diskUsageWidget = (props: { deviceDynamic: IDeviceLog, overrideHeader?: JSX.Element }) => {
  const deviceDynamic: IDeviceLog = props.deviceDynamic;

  return (
    <Col className="device-details-accordion dark-accordion pt-3 pb-3">
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            {props.overrideHeader ?
              props.overrideHeader :
              <div className="d-flex w-100 justify-content-around">
                Disk Usage Information
              </div>
            }
          </Accordion.Header>
          <Accordion.Body>
            <Table className="device-details-table device-details-table-dark">
              <tbody>
                <tr className="border-bottom">
                  <td className="w-50">Partition Path</td>
                  <td className="float-right">
                    {deviceDynamic?.disk?.partitions
                        .map((partition) => partition.path)
                        .join(', ') || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Partition Percentage</td>
                  <td className="float-right">
                    {deviceDynamic?.disk?.partitions
                        .map((partition) => partition.percent)
                        .join(', ') || 'N/A'}
                    %
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Reponse Time</td>
                  <td className="float-right">
                    {deviceDynamic?.disk?.disks
                        .map((disk) => disk.responseTime)
                        .join(', ') || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Read Time</td>
                  <td className="float-right">
                    {deviceDynamic?.disk?.disks
                        .map((disk) => disk.readSpeed)
                        .join(', ') || 'N/A'}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Write Time</td>
                  <td className="float-right">
                    {deviceDynamic?.disk?.disks
                        .map((disk) => disk.writeSpeed)
                        .join(', ') || 'N/A'}
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

export default diskUsageWidget;
