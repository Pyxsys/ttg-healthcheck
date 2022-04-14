// 3rd Party
import React from 'react';
import {Col, Accordion} from 'react-bootstrap';
import {LineChart} from '@carbon/charts-react';
import '@carbon/charts/styles/styles-g90.scss';

// Common
import {exportCSV} from '../../services/export.service';
import {IDeviceLog} from '../../types/device';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addIfBothExist = (a: number|undefined, b:number|undefined) => {
  if (b) {
    if (a) {
      return a+b;
    } else {
      return b;
    }
  } else {
    return 0;
  }
};
const oneIfLengthZero = (a:IDeviceLog[]) => {
  return a.length > 0 ? a.length:1;
};
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

    const davgs: davg[] = [];
    (_props.deviceHistories as IDeviceLog[][]).forEach((e) => {
      const id = e[0].deviceId;
      for (let j = 0; j < days; j++) {
        const onThisDay = e.filter((_d, i, a) => {
          return (new Date(a[i].timestamp) < new Date(timeFunction(-j)) && new Date(a[i].timestamp) > new Date(timeFunction(-j-1)));
        });
        const thisDayAvg = (onThisDay.map((a) => getAttribute(a, _props.metric)) as number[]).reduce((a:number|undefined, b:number|undefined) => {
          return addIfBothExist(a, b);
        }, 0)/ oneIfLengthZero(onThisDay);
        davgs.push({
          id: id,
          index: j,
          value: thisDayAvg,
        });
      }
    });
    data =[];
    const davgsr = [...davgs].reverse();
    davgsr.forEach((e) => {
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
    title: _props.title,
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

  const getGraphCSV = (): void => {
    const convertDaysToText = (days: string): string => {
      switch (days) {
        case '1':
          return 'Day';
        case '7':
          return 'Week';
        case '30':
          return 'Month';
        default:
          return 'None';
      }
    };
    const period = convertDaysToText(_props.days);
    const graphValues = state.data.map((graphData) => ({
      Device_Name: graphData.group,
      [period]: graphData.key,
      Value: graphData.value,
    }));
    const today = new Date();
    exportCSV(graphValues, `Analytics-${_props.title}-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);
  };


  return (
    <Col className='graph-dark-accordion analytics-accordion gaph-Display'>
      <Accordion defaultActiveKey='0'>
        <Accordion.Item eventKey='0' className='analytics-accordion-item'>
          <Accordion.Header>
            <div className='d-flex w-100 justify-content-around'>Display</div>
          </Accordion.Header>
          <Accordion.Body>
            <Col>
              <div className="d-flex">
                <div className="p-1 ms-auto">
                  <button className="btn btn-primary"
                    onClick={() => getGraphCSV()}
                  >
                    Export as CSV
                  </button>
                </div>
              </div>
              <LineChart data={state.data} options={options}/>
            </Col>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default graphDisplay;
