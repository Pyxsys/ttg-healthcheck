import React from 'react';
import styled, {keyframes} from 'styled-components';

interface PieWheel {
  percentage: number
  colour?: string
  backgroundColour?: string
  text?: boolean
}

// center text for piewheel
const Text = ({percentage}: PieWheel) => {
  if (!percentage) {
    percentage = 0;
  }
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={'1em'}
      stroke="white"
      strokeWidth="1px"
      dy="-0.1em"
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

// keyframe animation for fill
const fillColour = (percentage: number) => keyframes`
  from { stroke-dashoffset: 310; }
  to { stroke-dashoffset: ${percentage}; }
`;

const strokePct = (percentage: number) => {
  return ((100 - percentage) * (2 * Math.PI * 52)) / 100;
};

// color fill and animation
const Circle = styled.circle.attrs(
    (props: { colour: string; percentage: number; animate: boolean }) => props,
)`
  r: 52;
  cx: 100;
  cy: 100;
  fill: transparent;
  stroke-dashoffset: ${(props) =>
    props.percentage ? strokePct(props.percentage) : 0};
  stroke: ${(props) =>
    strokePct(props.percentage) !== 2 * Math.PI * 52 ? () => props.colour : ''};
  stroke-width: 2.4rem;
  stroke-dasharray: ${2 * Math.PI * 52};
  animation: ${(props) =>
      props.animate ? () => fillColour(strokePct(props.percentage)) : ''}
    0.4s linear;
`;

// wheel colour depending on percentage
const wheelColor = (percentage: number) => {
  let backgroundColour = '';
  let colour = '';
  if (!percentage) {
    backgroundColour = '#C4C4C4';
  }
  if (percentage > 0 && percentage <= 40) {
    backgroundColour = 'rgb(166, 187, 155)';
    colour = 'rgb(51, 153, 0)';
  }
  if (percentage > 40 && percentage <= 75) {
    backgroundColour = 'rgb(201, 181, 164)';
    colour = 'rgb(219, 123, 43)';
  }
  if (percentage > 75) {
    backgroundColour = 'rgb(198, 166, 155)';
    colour = 'rgb(204, 51, 0)';
  }
  return [backgroundColour, colour];
};

// import to create our piewheel with a percentage value
const pieWheel = ({percentage, text}: PieWheel) => {
  const [backgroundColour, colour] = wheelColor(percentage);
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200">
      <g transform={`rotate(-90 ${'100 100'})`} width="180" height="180">
        <Circle colour={backgroundColour} percentage={100} animate={false} />
        <Circle colour={colour} percentage={percentage} animate={true}></Circle>
      </g>
      {text ? <Text percentage={percentage} /> : ''}
    </svg>
  );
};

export default pieWheel;
