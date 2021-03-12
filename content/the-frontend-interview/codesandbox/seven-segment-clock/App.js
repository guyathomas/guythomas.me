import React from "react"
import styled from "styled-components"

const Stroke = styled.div`
  background-color: red;
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

const strokeNumberMap = new Map([
  [
    0,
    ["top", "top-right", "bottom-right", "bottom", "bottom-left", "top-left"],
  ],
  [1, ["top-right", "bottom-right"]],
  [2, ["top", "top-right", "middle", "bottom-left", "bottom"]],
  [3, ["top", "top-right", "middle", "bottom-right", "bottom"]],
  [4, ["top-left", "middle", "top-right", "bottom-right"]],
  [5, ["top", "top-left", "middle", "bottom-right", "bottom"]],
  [6, ["top", "top-left", "middle", "bottom-right", "bottom", "bottom-left"]],
  [7, ["top", "top-right", "bottom-right"]],
  [
    8,
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
  [9, ["top", "top-right", "bottom-right", "bottom", "top-left", "middle"]],
])

const Digit = ({ value }) => (
  <DigitWrapper>
    {strokeNumberMap.get(value).map((gridArea) => (
      <Stroke gridArea={gridArea} />
    ))}
  </DigitWrapper>
)

const formatDoubleDigit = (number) => number.toString().padStart(2, "0")

const getDigitValuesFromDate = (date) => {
  const hours = formatDoubleDigit(date.getHours()).split("")
  const minutes = formatDoubleDigit(date.getMinutes()).split("")
  const seconds = formatDoubleDigit(date.getSeconds()).split("")
  return [...hours, ...minutes, ...seconds]
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

const colonPositions = new Set([2])

const Clock = ({ date }) => {
  const digitValues = getDigitValuesFromDate(date)
  return (
    <ClockWrapper>
      {digitValues.map((value, index) => (
        <React.Fragment>
          {colonPositions.has(index) && <Colon />}
          <Digit value={parseInt(value, 10)} />
        </React.Fragment>
      ))}
    </ClockWrapper>
  )
}

export default function App() {
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])
  return <Clock date={now} />
}
