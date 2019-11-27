import React from "react"
import styled from "@emotion/styled"

import LinkedIn from "./icons/linkedin.svg"
import Github from "./icons/github.svg"
import Medium from "./icons/medium.svg"
// import Instagram from './icons/instagram.svg';
// import TwitterIcon from './icons/twitter.svg';

const IconWrapper = styled.span`
  width: 70px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  flex-shrink: 0;
`

const dividerStyles = `
  content: '';
  border-bottom: 1px solid black;
  width: 100%;
`

const Line = styled.div`
  display: flex;
  flex-direction: ${props =>
    props.orientation === "horizontal" ? "row" : "column"};
  justify-content: center;
  align-items: center;
  &::after {
    ${dividerStyles}
  }
  &::before {
    ${dividerStyles}
  }
`
const IconGroup = styled.div`
  display: flex;
`

const icons = {
  LinkedIn,
  Github,
  Medium,
}

export const SocialLine = ({ orientation = "horizontal" }) => {
  return (
    <Line orientation={orientation}>
      {Object.entries(icons).map(([ name, Icon ]) => (
        <IconWrapper key={name}>
          <Icon />
        </IconWrapper>
      ))}
    </Line>
  )
}
