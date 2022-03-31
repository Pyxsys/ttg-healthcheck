import React from 'react'
import styled, { keyframes } from 'styled-components'

interface IBarInput {
  colour: string
  size: number
  delay: number
}

interface ISignalStrengthInput {
  strength: number
  showText?: boolean
}

/**
 * Returns the keyframes to fill in colour based on a given delay.
 * @param {string} colour the hex or RGB value to fill
 * @param {number} delay the delay in percentage
 * @return {Keyframe} the keyframes to fill in colour
 */
const fillColorDelay = (colour: string, delay: number) => keyframes`
  0% { fill: #C4C4C4; }
  ${delay}% { fill: #C4C4C4; }
  100% { fill: ${colour}; }
`

/**
 * Returns the bar colour depending on the overall strength and the index of the bar.
 * @param {number} strength stregnth of the overall signal
 * @param {number} barIndex index of current vertical bar
 * @return {string} the colour of the bar
 */
const barColour = (strength: number, barIndex: number) => {
  if (barIndex > strength) {
    return '#C4C4C4'
  }

  switch (strength) {
    case 1:
      return '#CC3300'
    case 2:
      return '#DB7B2B'
    case 3:
      return '#339900'
    default:
      return '#C4C4C4'
  }
}

/**
 * Returns the signal text depending on the level.
 * @param {number} strength stregnth of the overall signal
 * @return {string} the text of the strength bar
 */
const signalText = (strength: number) => {
  switch (strength) {
    case 1:
      return 'Poor'
    case 2:
      return 'Good'
    case 3:
      return 'Excellent'
    default:
      return ''
  }
}

/**
 * Creates a text that is placed down and to the right.
 * @param {string} text
 * @return {JSX.Element} a JSX Element of text
 */
const Text = ({ text }: { text: string }) => {
  return (
    <>
      {text ? (
        <text x="50" y="120" textAnchor="middle" fontSize={'1em'} fill="white">
          {text}
        </text>
      ) : (
        <></>
      )}
    </>
  )
}

/**
 * Creates a vertical rectangle with the given size and colour.
 * @param {IBarInput} bar the input attributes associated with the Bar Component
 * @return {JSX.Element} a JSX Element of a vertical bar
 */
const Bar = styled.rect.attrs((bar: IBarInput) => bar)`
  width: 20px;
  height: ${(bar) => bar.size}px;
  fill: ${(bar) => bar.colour};
  animation: ${(bar) => fillColorDelay(bar.colour, bar.delay)} 0.5s linear;
`

/**
 * Creates a slanted horizontal rectangle.
 * @return {JSX.Element} a JSX Element of a slanted cross bar
 */
const CrossBar = () => {
  return (
    <g transform={`translate(-10, 85) rotate(-30)`}>
      <rect width={125} height={10} fill={barColour(NaN, NaN)} />
    </g>
  )
}

/**
 * Creates vertical rectangles and changes their colour based on the strength provided.
 * @param {number} strength stregnth of the overall signal
 * @param {boolean} showText true if to display the text below the bars
 * @return {JSX.Element} a JSX Element of Signal Strength bars
 */
const SignalStrength = ({ strength, showText }: ISignalStrengthInput) => {
  const text = signalText(strength)
  const showSignalStrengthText: string = showText ? text : ''
  return (
    <svg width="100%" height="100%" viewBox="-40 0 175 125">
      {[1, 2, 3, 3].map((barLevel, index) => (
        <g
          key={`bar-${index}`}
          transform={`translate(${index * 25}, ${60 - index * 20})`}
        >
          <Bar
            colour={barColour(strength, barLevel)}
            size={40 + index * 20}
            delay={index * 25}
          />
        </g>
      ))}
      {text ? <Text text={showSignalStrengthText} /> : <CrossBar />}
    </svg>
  )
}

export { SignalStrength, signalText }
