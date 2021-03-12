import React from "react"
import styled from "styled-components"

const Stroke = styled.div`
  background-color: ${(props) => (props.isHighlighted ? "red" : "#1e0101")};
  height: 100%;
  width: 100%;
  grid-area: ${(props) => props.gridArea};
`

const SegmentThickness = "5px"

const DigitWrapper = styled.div`
  display: grid;
  width: 50px;
  height: 100px;
  grid-template-rows: ${SegmentThickness} 1fr ${SegmentThickness} 1fr ${SegmentThickness};
  grid-template-columns: ${SegmentThickness} 1fr ${SegmentThickness};
  grid-template-areas:
    "top top top"
    "top-left . top-right"
    "middle middle middle"
    "bottom-left . bottom-right"
    "bottom bottom bottom";
`
const allAreas = [
  "middle",
  "top",
  "top-right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "top-left",
]
const strokeNumberMap = new Map([
  [
    "0",
    ["top", "top-right", "bottom-right", "bottom", "bottom-left", "top-left"],
  ],
  ["1", ["top-right", "bottom-right"]],
  ["2", ["top", "top-right", "middle", "bottom-left", "bottom"]],
  ["3", ["top", "top-right", "middle", "bottom-right", "bottom"]],
  ["4", ["top-left", "middle", "top-right", "bottom-right"]],
  ["5", ["top", "top-left", "middle", "bottom-right", "bottom"]],
  ["6", ["top", "top-left", "middle", "bottom-right", "bottom", "bottom-left"]],
  ["7", ["top", "top-right", "bottom-right"]],
  [
    "8",
    [
      "top",
      "top-right",
      "bottom-right",
      "bottom",
      "bottom-left",
      "top-left",
      "middle",
    ],
  ],
  ["9", ["top", "top-right", "bottom-right", "bottom", "top-left", "middle"]],
])

const Digit = ({ value }) => {
  const highlightedAreas = new Set(strokeNumberMap.get(value))
  return (
    <DigitWrapper>
      {allAreas.map((gridArea) => (
        <Stroke
          key={gridArea}
          gridArea={gridArea}
          isHighlighted={highlightedAreas.has(gridArea)}
        />
      ))}
    </DigitWrapper>
  )
}

const formatDoubleDigit = (number) =>
  number.toString().padStart(2, "0").split("")

const getDigitValuesFromDate = (date) => {
  const hours = formatDoubleDigit(date.getHours())
  const minutes = formatDoubleDigit(date.getMinutes())
  const seconds = formatDoubleDigit(date.getSeconds())
  return { hours, minutes, seconds }
}

const ClockWrapper = styled.div`
  display: inline-grid;
  grid-column-gap: 20px;
  grid-auto-flow: column;
  grid-template-columns: repeat(6, min-content);
  background-color: black;
  padding: 20px;
`

const Dot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
`

const ColonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const Colon = () => (
  <ColonWrapper>
    <Dot />
    <Dot />
  </ColonWrapper>
)

const Clock = ({ date }) => {
  const { hours, minutes, seconds } = getDigitValuesFromDate(date)
  return (
    <ClockWrapper>
      {hours.map((value, index) => (
        <Digit key={`hour${index}`} value={value} />
      ))}
      <Colon />
      {minutes.map((value, index) => (
        <Digit key={`minute${index}`} value={value} />
      ))}
      <Colon />
      {seconds.map((value, index) => (
        <Digit key={`second${index}`} value={value} />
      ))}
    </ClockWrapper>
  )
}

const useCurrentDate = () => {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])
  return now
}

export default function App() {
  const currentDate = useCurrentDate()
  return <Clock date={currentDate} />
}
