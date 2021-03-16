import React from "react"
import styled from "@emotion/styled"
import { ThemeContext } from "~context/ThemeProvider"
import { COLOR_PALETTE } from "~styles"
import { HeroBanner } from "./HeroBanner"

const HeroBannerContainer = styled.div`
  background-color: ${() => COLOR_PALETTE.backgroundSky.color};
  transition: background-color 1s;
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CenterHero = styled(HeroBanner)`
  max-width: 700px;
`

export const Hero: React.FC = () => {
  const { colorMode } = React.useContext(ThemeContext)
  return (
    <HeroBannerContainer>
      <CenterHero colorMode={colorMode} />
    </HeroBannerContainer>
  )
}
