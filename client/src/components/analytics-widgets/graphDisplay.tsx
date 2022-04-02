import React from 'react';
import {Col, Accordion} from 'react-bootstrap';
import {LineChart} from '@carbon/charts-react';
import '@carbon/charts/styles/styles-g90.scss';
import {IDeviceLog} from '../../types/device';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const graphDisplay = (_props: any) => {
  const addDaysToToday = (i:number) => {
    const date1 = new Date();
    const date2 = new Date();
    date2.setDate(date1.getDate() + i);
    return date2;
  };
  const addHoursToToday = (i:number) => {
    const date1 = new Date();
    const date2 = new Date();
    date2.setHours(date1.getHours() + i);
    return date2;
  };
  enum ToolbarControlTypes {
    MAKE_FULLSCREEN = 'Make fullscreen',
  }
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
  data = [];
  console.log(_props.deviceHistories);

  type davg = {
    id: string,
    index: number,
    value: number,
  }

  if (_props.deviceHistories[0] && _props.deviceHistories[0].length > 0 ) {
    let timeFunction = addDaysToToday;
    let days = _props.days;
    if (_props.days == 1) {
      timeFunction = addHoursToToday;
      days = 24;
    }
    console.log(_props.deviceHistories.length);
    const davgs: davg[] = [];
    (_props.deviceHistories as IDeviceLog[][]).forEach((e) => {
      console.log(e);
      const id = e[0].deviceId;
      for (let j = 0; j < days; j++) {
        const onThisDay = e.filter((_d, i, a) => {
          return (new Date(a[i].timestamp) < new Date(timeFunction(-j)) && new Date(a[i].timestamp) > new Date(timeFunction(-j-1)));
        });
        const thisDayAvg = (onThisDay.map((a) => getAttribute(a, _props.metric)) as number[]).reduce((a:number|undefined, b:number|undefined) => {
          if (b) {
            if (a) {
              return a+b;
            } else {
              return b;
            }
          } else {
            return 0;
          }
        }, 0)/ (onThisDay.length > 0? onThisDay.length : 1 );
        console.log(thisDayAvg);
        davgs.push({
          id: id,
          index: j,
          value: thisDayAvg,
        });
      }
    });
    data =[];
    davgs.reverse().forEach((e) => {
      console.log(_props.metric);
      data.push({
        group: e.id,
        key: e.index.toString(),
        value: e.value,

      } as dataPoint);
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
