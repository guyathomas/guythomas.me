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
  border-bottom: 1px solid gray;
`

export const Bio = () => (
  <BioContainer>
    <h1>Guy Thomas</h1>
    <h3>Software Engineer</h3>
    <p>
      I love tinkering, teaching and exploring the outdoors. I'm currently
      ticking all those boxes at <a href="https://www.lyft.com">Lyft</a>
    </p>
  </BioContainer>
)

// export default Bio
