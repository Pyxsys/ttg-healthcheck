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
  const devices: IDeviceTotal[] = _props.deviceDynamic;
  const devicesSorted: IDeviceTotal[] = devices.sort((a, b) => b?.dynamic?.memory?.aggregatedPercentage as number - (a?.dynamic?.memory?.aggregatedPercentage as number)).reverse();


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
    <Col xs={12} sm={12} md={12} lg={4} xl={4} className="analytics-accordion restrict-accordion-height">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className="analytics-accordion-item">
          <Accordion.Header>
            <div className="d-flex w-100 justify-content-around">Overworked Memory Devices</div>
          </Accordion.Header>
          <Accordion.Body className="flex-grow-1 overflow-auto p-0">
            <div className="overflow-auto">
              <ViewTable
                tableData={devicesSorted}
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
