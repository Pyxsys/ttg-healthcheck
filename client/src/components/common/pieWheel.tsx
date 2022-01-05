import React from 'react';

// center text for piewheel
const Text = ({percentage}: any) => {
  if (!percentage) {
    percentage = 0;
  }
  return (
    <text
      x='50%'
      y='50%'
      dominantBaseline='central'
      textAnchor='middle'
      fontSize={'1em'}
      stroke='white'
      strokeWidth='1px'
      dy='-0.1em'
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

// piewheel
const Circle = ({colour, percentage}: any) => {
  const radius = 52;
  const circle = 2 * Math.PI * radius;
  const strokePct = ((100 - percentage) * circle) / 100;
  return (
    <circle
      r={radius}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePct !== circle ? colour : ''}
      strokeWidth={'2.4rem'}
      strokeDasharray={circle}
      strokeDashoffset={percentage ? strokePct : 0}
    ></circle>
  );
};

// this will be used to render our piewheel with a percentage value
const Pie = ({percentage}: any) => {
  let backgroundColour = '';
  let colour = '';
  console.log(typeof(percentage));
  switch (true) {
    case (percentage == 0 || isNaN(parseFloat(percentage))):
      backgroundColour = '#3F4651';
      break;
    case (percentage > 0 && percentage <= 40):
      backgroundColour = 'rgb(166, 187, 155)';
      colour = 'rgb(51, 153, 0)';
      break;
    case (percentage > 40 && percentage <= 75):
      backgroundColour = 'rgb(201, 181, 164)';
      colour = 'rgb(219, 123, 43)';
      break;
    case (percentage > 75):
      backgroundColour = 'rgb(198, 166, 155)';
      colour = 'rgb(204, 51, 0)';
      break;
  }
  return (
    <svg width="100%" height="auto" viewBox="0 0 200 200">
      <g transform={`rotate(-90 ${'100 100'})`} width="180" height="180">
        <Circle colour={backgroundColour} />
        <Circle colour={colour} percentage={percentage} />
      </g>
      <Text percentage={percentage}/>
    </svg>
  );
};

export default Pie;
