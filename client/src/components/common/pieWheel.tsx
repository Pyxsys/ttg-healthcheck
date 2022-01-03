import React from 'react';

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

const Circle = ({colour, percentage}: any) => {
  const radius = 55;
  const circle = 2 * Math.PI * radius;
  const strokePct = ((100 - percentage) * circle) / 100;
  return (
    <circle
      r={radius}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePct !== circle ? colour : ''}
      strokeWidth={'2.2rem'}
      strokeDasharray={circle}
      strokeDashoffset={percentage ? strokePct : 0}
    ></circle>
  );
};

const Pie = ({percentage}: any) => {
  let backgroundColour = 'rgb(166, 187, 155)';
  let colour = 'rgb(51, 153, 0)';
  console.log(typeof(percentage));
  switch (true) {
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
  }
  return (
    <svg width="100%" height="auto" viewBox="0 0 200 200" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g transform={`rotate(-90 ${'100 100'})`} width="180" height="180">
        <Circle colour={backgroundColour} />
        <Circle colour={colour} percentage={percentage} />
      </g>
      <Text percentage={percentage}/>
    </svg>
  );
};

export default Pie;
