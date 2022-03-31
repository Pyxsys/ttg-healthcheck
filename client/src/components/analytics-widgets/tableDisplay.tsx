// 3rd Party
import React from 'react';
import {Col, Accordion} from 'react-bootstrap';
import {IDeviceTotal} from '../../types/device';
import {IColumnDetail} from '../../types/tables';
import ViewTable from '../common/viewTable';
import PieWheel from '../common/pieWheel';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CellValue = string | number | undefined;

const PieWheelCell = (cellValue: CellValue) => (
  <div className="d-flex justify-content-end align-items-center">
    <div className="text-truncate devices-font">
      {Number(cellValue).toFixed(2)}
      {cellValue ? '%' : ''}
    </div>
    <div className="ps-2 pie-wheel-size">
      <PieWheel percentage={Number(cellValue)} text={false} />
    </div>
  </div>
);
const tableDisplay = (_props: any) => {
  const devices: IDeviceTotal[] = _props.deviceDynamic || [];

  const column: IColumnDetail[] = [
    {
      key: 'static.deviceId',
      name: 'Name',
    },
    {
      key: 'dynamic.memory.aggregatedPercentage',
      name: 'Memory',
      override: PieWheelCell,
    },
  ];

  return (
    <Col className="graph-dark-accordion analytics-accordion">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className="analytics-accordion-item">
          <Accordion.Header>
            <div className="d-flex w-100 justify-content-around">Display</div>
          </Accordion.Header>
          <Accordion.Body>
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

export default tableDisplay;
