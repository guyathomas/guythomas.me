import React from "react"
import styled from "@emotion/styled"

import LinkedIn from "./icons/linkedin.svg"
import Github from "./icons/github.svg"
import Medium from "./icons/medium.svg"

const HorizontalIconMargins = `
  margin: 0 1rem;
  &:last-of-type {
    margin-right: 2rem;
  }
  &:first-of-type {
    margin-left: 2rem;
  }
`

const VerticalIconMargins = `
  margin: 1rem 0;
  &:last-of-type {
    margin-bottom: 2rem;
  }
  &:first-of-type {
    margin-top: 2rem;
  }
`

const IconWrapper = styled.a`
  flex-shrink: 0;
  line-height: 0;
  fill: #007acc;
  cursor: pointer;
  ${props =>
    props.orientation === "horizontal"
      ? HorizontalIconMargins
      : VerticalIconMargins}
`
const VerticalLineLayout = styled.div`
  top: 0;
  right: 0;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 250ms ease-in-out;
  opacity: ${props => (props.visible ? 1 : 0)};
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
  border-bottom: 1px solid lightgray;
  width: 100%;
`

const VerticalLine = styled.div`
  border-right: 1px solid lightgray;
  height: 100%;
  flex-shrink: ${props => (props.long ? 1 : 2)};
  min-height: 6rem;
`

export const SocialLine = ({ orientation = "horizontal", visible = true }) => {
  if (orientation === "vertical") {
    return (
      <VerticalLineLayout visible={visible}>
        <VerticalLine />
        {Object.entries(socialLinks).map(([name, { Icon, url }]) => (
          <IconWrapper key={name} href={url} orientation={orientation}>
            <Icon />
          </IconWrapper>
        ))}
        <VerticalLine long />
      </VerticalLineLayout>
    )
  }

  return (
    <HorizontalLineLayout>
      <HorizontalLine />
      {Object.entries(socialLinks).map(([name, { Icon, url }]) => (
        <IconWrapper key={name} href={url} orientation={orientation}>
          <Icon />
        </IconWrapper>
      ))}
      <HorizontalLine />
    </HorizontalLineLayout>
  )
}
