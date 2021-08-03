import * as React from "react"
import { Page } from "~templates"
import Timeline from "@material-ui/lab/Timeline"
import TimelineItem from "@material-ui/lab/TimelineItem"
import TimelineSeparator from "@material-ui/lab/TimelineSeparator"
import TimelineConnector from "@material-ui/lab/TimelineConnector"
import TimelineContent from "@material-ui/lab/TimelineContent"
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent"
import TimelineDot, { TimelineDotProps } from "@material-ui/lab/TimelineDot"
import AccountBalance from "@material-ui/icons/AccountBalance"
import AcUnit from "@material-ui/icons/AcUnit"
import Code from "@material-ui/icons/Code"
import DirectionsCar from "@material-ui/icons/DirectionsCar"
import Work from "@material-ui/icons/Work"
import Wifi from "@material-ui/icons/Wifi"
import Typography from "@material-ui/core/Typography"

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
