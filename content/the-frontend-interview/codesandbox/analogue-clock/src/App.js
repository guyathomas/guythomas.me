import React from "react"
import styled from "@emotion/styled"

const useCurrentTime = () => {
  const [time, setTime] = React.useState(new Date())
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => {
      window.clearInterval(interval)
    }
  })
  return time
}

const FullScreenAndCenter = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
const App = () => {
  const currentTime = useCurrentTime()
  const hour = currentTime.getHours()
  const minute = currentTime.getMinutes()
  const second = currentTime.getSeconds()

  return (
    <FullScreenAndCenter>
      <ClockFace>
        <HourHand degreesComplete={(hour / 12) * 360} />
        <MinuteHand degreesComplete={(minute / 60) * 360} />
        <SecondHand degreesComplete={(second / 60) * 360} />
      </ClockFace>
    </FullScreenAndCenter>
  )
}
const Hand = styled.div`
  width: 50%;
  height: 1px;
  right: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%)
    rotate(${(props) => (props.degreesComplete || 0) - 90}deg);
  transform-origin: left center;
  background-color: black;
`

const HourHand = styled(Hand)`
  height: 5px;
  width: 25%;
`
const MinuteHand = styled(Hand)`
  background-color: blue;
  height: 3px;
`
const SecondHand = styled(Hand)`
  background-color: red;
`
const ClockOutline = styled.div`
  border: 1px solid black;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  position: relative;
`

const ClockLabelWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform:
    /* Diameter Radius 0.8 scale to put numbers inside */ translateX(
      calc(
        -50% + ${(props) => Math.cos(Math.PI * 2 * (props.position - 0.25)) * 50 * 0.8}px
      )
    )
    translateY(
      calc(
        -50% + ${(props) => Math.sin(Math.PI * 2 * (props.position - 0.25)) * 50 * 0.8}px
      )
    );
`

const ClockLabel = ({ time }) => (
  <ClockLabelWrapper position={time / 12}>{time}</ClockLabelWrapper>
)

const ClockFace = ({ children }) => (
  <ClockOutline>
    <ClockLabel time={12} />
    <ClockLabel time={3} />
    <ClockLabel time={6} />
    <ClockLabel time={9} />
    {children}
  </ClockOutline>
)

export default App
