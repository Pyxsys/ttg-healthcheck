import React from 'react';
import {Col, Accordion} from 'react-bootstrap';
import {LineChart} from '@carbon/charts-react';
import '@carbon/charts/styles/styles-g90.scss';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const graphDisplay = (_props: any) => {
  enum ToolbarControlTypes {
    MAKE_FULLSCREEN = 'Make fullscreen',
  }
  type dataPoint = {
    group: string,
    key: string,
    value: number,
  }
  enum ScaleTypes {
    TIME = 'time',
    LINEAR = 'linear',
    LOG = 'log',
    LABELS = 'labels',
    LABELS_RATIO = 'labels-ratio',
  }
  let data = [
    {
      group: 'Dataset 1',
      key: 'Qty',
      value: 23500,
    },
    {
      group: 'Dataset 2',
      key: 'More',
      value: 34200,
    },
  ];
  console.log(_props.deviceHistories);
  if (_props.deviceHistories) {
    data =[];
    let c1 = 0;
    let c2 = 0;
    (_props.deviceHistories as number[][]).forEach((e) => {
      e.forEach((e)=>{
        data.push({
          group: c1.toString(),
          key: c2.toString(),
          value: e,

        } as dataPoint);
        c2++;
      });
      c1++;
    });
  }

  const state = {
    data: data};

  const options = {
    title: 'CPU Usage',
    axes: {
      left: {
        primary: true,
        stacked: true,
      },
      bottom: {
        scaleType: ScaleTypes.LABELS,
        secondary: true,
      },
    },
    height: '400px',
    toolbar: {
      enabled: true,
      controls: [
        {
          type: ToolbarControlTypes.MAKE_FULLSCREEN,
        },
      ],
    },
  };


  return (
    <Col className='graph-dark-accordion analytics-accordion'>
      <Accordion defaultActiveKey='0'>
        <Accordion.Item eventKey='0' className='analytics-accordion-item'>
          <Accordion.Header>
            <div className='d-flex w-100 justify-content-around'>Display</div>
          </Accordion.Header>
          <Accordion.Body>
            <Col>
              <LineChart data={state.data} options={options}/>
            </Col>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default graphDisplay;
