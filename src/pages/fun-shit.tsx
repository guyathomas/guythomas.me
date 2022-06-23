import * as React from "react"
import { Page } from "~templates"
import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
import TimelineDot, { TimelineDotProps } from "@mui/lab/TimelineDot"
import AccountBalance from "@mui/icons-material/AccountBalance"
import AcUnit from "@mui/icons-material/AcUnit"
import Code from "@mui/icons-material/Code"
import DirectionsCar from "@mui/icons-material/DirectionsCar"
import Work from "@mui/icons-material/Work"
import Wifi from "@mui/icons-material/Wifi"
import Typography from "@mui/material/Typography"

interface TimelineItemProps {
  time: string
  title: string
  icon: JSX.Element
  subtitle?: string
  iconColor?: TimelineDotProps["color"]
}
const TimelineListItem: React.FC<TimelineItemProps> = ({
  time,
  title,
  subtitle,
  icon,
  iconColor,
}) => (
  <TimelineItem>
    <TimelineOppositeContent sx={{ m: "auto 0" }} color="inherit">
      {time}
    </TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineConnector />
      <TimelineDot color={iconColor}>{icon}</TimelineDot>
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent sx={{ py: "12px", px: 2 }}>
      <Typography variant="h6" component="span">
        {title}
      </Typography>
      {subtitle && <Typography>{subtitle}</Typography>}
    </TimelineContent>
  </TimelineItem>
)
const timelineItems: TimelineItemProps[] = [
  {
    icon: <AccountBalance />,
    time: "2013",
    title: "Start",
    subtitle: "Economics / Finance",
    iconColor: "warning",
  },
  {
    icon: <AccountBalance />,
    time: "2013",
    title: "Graduate",
    subtitle: "Economics / Finance",
    iconColor: "warning",
  },
  {
    icon: <AcUnit />,
    iconColor: "primary",
    time: "2013/2014",
    title: "Ski Instructor",
    subtitle: "Canada",
  },
  {
    icon: <DirectionsCar />,
    time: "2013/2014",
    title: "Road Trip",
    subtitle: "Vancouver > NYC > SF > Vancouver",
    iconColor: "secondary",
  },
  {
    icon: <AcUnit />,
    iconColor: "primary",
    time: "2014",
    title: "Ski Instructor",
    subtitle: "Austria",
  },
  {
    icon: <Work />,
    time: "2014-2016",
    title: "IBM",
    subtitle: "Australia",
    iconColor: "warning",
  },
  {
    icon: <DirectionsCar />,
    time: "2016",
    title: "Road Trip",
    subtitle: "Sweden/Norway/Denmark",
    iconColor: "secondary",
  },
  {
    icon: <Code />,
    time: "2016",
    title: "Hack Reactor",
    iconColor: "warning",
  },
  {
    icon: <AcUnit />,
    iconColor: "primary",
    time: "2017",
    title: "Ski Instructor",
    subtitle: "Japan",
  },
  {
    icon: <Work />,
    time: "2017-2019",
    title: "Reflektive",
    subtitle: "Australia",
    iconColor: "warning",
  },
  {
    icon: <Work />,
    time: "2019-2021",
    title: "Lyft",
    subtitle: "Australia",
    iconColor: "warning",
  },
  {
    icon: <Wifi />,
    time: "2020",
    title: "Digital Nomadding",
    subtitle: "NYC > Vermont > Denver > Austin > Long Beach",
    iconColor: "secondary",
  },
]
const HistoryOfMe: React.FC = () => {
  return (
    <Page title="Fun Shit I've Done">
      <Timeline position="right">
        {timelineItems.map((lineItemProps) => (
          <TimelineListItem {...lineItemProps} key={lineItemProps.time} />
        ))}
      </Timeline>
    </Page>
  )
}

export default HistoryOfMe
