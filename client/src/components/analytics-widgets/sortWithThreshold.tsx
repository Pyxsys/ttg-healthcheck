// 3rd Party
import React from 'react';
import {Col, Accordion, Row} from 'react-bootstrap';
import {IDeviceTotal} from '../../types/device';
import {IColumnDetail} from '../../types/tables';
import ViewTable from '../common/viewTable';
import PieWheel from '../common/pieWheel';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CellValue = string | number | undefined;
const PieWheelCell = (cellValue: CellValue) => (
  <div className='d-flex justify-content-end align-items-center'>
    <div className='text-truncate devices-font'>
      {Number(cellValue).toFixed(2)}
      {cellValue ? '%' : ''}
    </div>
    <div className='ps-2 pie-wheel-size'>
      <PieWheel percentage={Number(cellValue)} text={false} />
    </div>
  </div>
);
const getAttribute = (
    object: any | undefined,
    attribute: string,
): number | string | undefined => {
  const attributes = attribute.split('.');
  return attributes.reduce(
      (prev, attr) => (prev ? prev[attr] : undefined),
      object,
  );
};


const sortWithThreshold = (_props: any) => {
  const devices: IDeviceTotal[] = _props.deviceDynamic;
  const devicesSorted: IDeviceTotal[] = devices.sort(_props.f).reverse();
  let counter = 0;
  let t = 0;
  console.log(_props.threshold);
  _props.threshold? t = _props.threshold as number : {};
  devices.forEach((e) => {
    const s = _props.columnKey;
    console.log(getAttribute(e, s));
    if (getAttribute(e, s) as number > t) {
      console.log(getAttribute(e, s) + ' '+ s);
      counter += 1;
    }
  });
  const column: IColumnDetail[] = [
    {
      key: 'static.deviceId',
      name: 'Name',
    },
    {
      key: _props.columnKey,
      name: (_props.columnKey as string).split('.')[(_props.columnKey as string).split('.').length -1],
      override: _props.columnKey == 'dynamic.wifi.sendSpeed' ? undefined : PieWheelCell,
    },
  ];

  return (
    <Col xs={12} sm={12} md={12} lg={4} xl={4} className='w-100 analytics-accordion restrict-accordion-height'>
      <Accordion defaultActiveKey='0'>
        <Accordion.Item eventKey='0' className='analytics-accordion-item'>
          <Accordion.Header>
            <div className='d-flex header-overflow p-0 m-2 w-100'>{_props.title}</div>
          </Accordion.Header>
          <Accordion.Body className='flex-grow-1 overflow-auto p-0 test'>
            <Row className='d-flex flex-column w-100 p-2 m-0'>
              <Col className='p-0'>
                <div className='border-bottom custom-font-size p-2'>
                  <div className=''>
                    Change Threshold
                  </div>
                  <input className="form-control form-control-sm w-100" type="string" value=""></input>
                </div>
              </Col>
              <Col className='p-0 mb-2'>
                <div className='border-bottom custom-font-size p-2'>
                  <div className=''>
                    Devices Above 80%
                  </div>
                  {counter}
                </div>
              </Col>
              <Col className='p-0'>
                <div>
                  <ViewTable
                    tableData={devicesSorted}
                    columns={column}
                    initialOrderBy='pid'
                  />
                </div>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default sortWithThreshold;
