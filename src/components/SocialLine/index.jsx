import React from "react"
import styled from "@emotion/styled"

import LinkedIn from "./icons/linkedin.svg"
import Github from "./icons/github.svg"
import Medium from "./icons/medium.svg"

const IconWrapper = styled.a`
  flex-shrink: 0;
  line-height: 0;
  margin: 0 1rem;
  fill: #007acc;
  cursor: pointer;
  &:last-of-type {
    margin-right: 2rem;
  }
  &:first-of-type {
    margin-left: 2rem;
  }
`

const VerticalLineLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  transform: translateX(100%);
`

const HorizontalLineLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0;
`

const socialLinks = {
  LinkedIn: {
    Icon: LinkedIn,
    url: "https://www.linkedin.com/in/guyathomas",
  },
  Github: {
    Icon: Github,
    url: "https://github.com/guyathomas",
  },
  Medium: {
    Icon: Medium,
    url: "https://medium.com/@stolemyusername",
  },
}

const HorizontalLine = styled.div`
  border-bottom: 1px solid black;
  width: 100%;
`

const VerticalLine = styled.div`
  border-right: 1px solid black;
  height: 100%;
  flex-shrink: ${props => (props.long ? 1 : 2)};
`

export const SocialLine = ({ orientation = "horizontal" }) => {
  const LineLayout =
    orientation === "horizontal" ? HorizontalLineLayout : VerticalLineLayout
  const Line = orientation === "horizontal" ? HorizontalLine : VerticalLine
  return (
    <LineLayout>
      <Line orientation={orientation} />
      {Object.entries(socialLinks).map(([name, { Icon, url }]) => (
        <IconWrapper key={name} href={url}>
            <Icon />
        </IconWrapper>
      ))}
      <Line orientation={orientation} long />
    </LineLayout>
  )
}
