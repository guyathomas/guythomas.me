import React from "react"
import styled from "@emotion/styled"
import { ThemeContext } from "~templates"
import { BREAKPOINTS, COLOR_PALETTE } from "~styles"
import { HeroBanner } from "./HeroBanner"

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  max-width: ${BREAKPOINTS.md}px;
  margin: auto;
  padding: 1rem;
`

interface HeroProps {
  children: React.ReactNode
}

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

export const Hero: React.FC<HeroProps> = ({ children }) => {
  const { colorMode } = React.useContext(ThemeContext)
  return (
    <>
      <HeroBannerContainer>
        <CenterHero colorMode={colorMode} />
      </HeroBannerContainer>
      <MainContainer>
        <Main>{children}</Main>
      </MainContainer>
    </>
  )
}