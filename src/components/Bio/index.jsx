/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import styled from "@emotion/styled"

const BioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  & > h1 {
    color: inherit;
  }
  & > h3 {
    color: inherit;
  }
`

const Title = styled.h1`
  margin: 0;
  font-weight: 400;
`

const Role = styled.h3`
  margin-bottom: 0;
  margin-top: 0.5rem;
`

const Description = styled.div`
  margin-bottom: 0;
  font-weight: 300;
  margin-top: 1rem;
`

const AboutMeWrapper = styled.div`
  display: ${props => (props.small ? "none" : "block")};
`

export const Bio = ({ small = false }) => (
  <BioContainer>
    <Title>Guy Thomas</Title>
    <AboutMeWrapper small={small}>
      <Role>Software Engineer</Role>
      <Description>
        I love tinkering, teaching and exploring the outdoors.
      </Description>
    </AboutMeWrapper>
  </BioContainer>
)
