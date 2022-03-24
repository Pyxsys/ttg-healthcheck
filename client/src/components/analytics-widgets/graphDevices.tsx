import React from 'react';
import {Col, Accordion, FormCheck} from 'react-bootstrap';
import {IDeviceTotal} from '../../types/device';
import {IColumnDetail} from '../../types/tables';
import ViewTable from '../common/viewTable';
import {MdClose} from 'react-icons/md';

interface AnalyticsDevicesTableInputs {
  deviceDynamic: IDeviceTotal[]
}

const graphDevices = (props: AnalyticsDevicesTableInputs) => {
  const devices: IDeviceTotal[] = props.deviceDynamic || [];

  const column: IColumnDetail[] = [
    {
      key: 'static.deviceId',
      name: 'Name',
    },
    {
      key: '',
      name: 'Settings',
      override: () => (
        <div className="devices-settings-content-wrapper">
          <MdClose color="red" />
          <FormCheck></FormCheck>
        </div>
      ),
    },
  ];

  return (
    <Col className="graph-dark-accordion restrict-accordion-height analytics-accordion">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className="analytics-accordion-item">
          <Accordion.Header>
            <div className="d-flex w-100 justify-content-around">Devices</div>
          </Accordion.Header>
          <Accordion.Body className="flex-grow-1 overflow-auto p-0">
            <div className="overflow-auto">
              <ViewTable
                tableData={devices}
                columns={column}
                initialOrderBy="pid"
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default graphDevices;