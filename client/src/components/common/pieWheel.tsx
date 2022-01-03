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
      strokeWidth='0.8px'
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

const Circle = ({colour, percentage}: any) => {
  const radius = 45;
  const circle = 2 * Math.PI * radius;
  const strokePct = ((100 - percentage) * circle) / 100;
  return (
    <circle
      r={radius}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePct !== circle ? colour : ''}
      strokeWidth={'2rem'}
      strokeDasharray={circle}
      strokeDashoffset={percentage ? strokePct : 0}
    ></circle>
  );
};

const Pie = ({percentage}: any) => {
  const backgroundColour = percentage > 70 ? 'rgb(198, 166, 155)' : 'rgb(166, 187, 155)';
  const colour = percentage > 70 ? 'rgb(204, 51, 0)' : 'rgb(51, 153, 0)';
  return (
    <svg width="100%" height="auto" viewBox="0 0 200 200" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g transform={`rotate(-90 ${'100 100'})`} width="240" height="240">
        <Circle colour={backgroundColour} />
        <Circle colour={colour} percentage={percentage} />
      </g>
      <Text percentage={percentage}/>
    </svg>
  );
};

export default Pie;
