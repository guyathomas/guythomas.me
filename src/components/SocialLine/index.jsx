import React from "react"
import styled from "@emotion/styled"

import LinkedIn from "./icons/linkedin.svg"
import Github from "./icons/github.svg"
import Medium from "./icons/medium.svg"

const IconWrapper = styled.span`
  width: 4rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  flex-shrink: 0;
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
`

const icons = {
  LinkedIn,
  Github,
  Medium,
}

const HorizontalLine = styled.div`
  border-bottom: 1px solid black;
  width: 100%;
`

const VerticalLine = styled.div`
  border-right: 1px solid black;
  height: 100%;
  flex-shrink: ${props => props.long ? 1 : 2};
`

export const SocialLine = ({ orientation = "horizontal" }) => {
  const LineLayout = orientation === 'horizontal' ? HorizontalLineLayout : VerticalLineLayout;
  const Line = orientation === 'horizontal' ? HorizontalLine : VerticalLine;
  return (
    <LineLayout>
      <Line orientation={orientation} />
        {Object.entries(icons).map(([ name, Icon ]) => (
          <IconWrapper key={name}>
            <Icon />
          </IconWrapper>
        ))}
      <Line orientation={orientation} long/>
    </LineLayout>
  )
}
