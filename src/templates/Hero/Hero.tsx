import React from "react"
import styled from "@emotion/styled"
import useDarkMode from "use-dark-mode"
import { ThemeContext } from "~templates"
import { BREAKPOINTS, COLOR_PALETTE } from "~styles"
import { HeroBanner } from "./HeroBanner"

const MainContainer = styled.div`
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  max-width: ${BREAKPOINTS.md}px;
  margin: auto;
  padding: 1rem;
  padding-top: 0;
`

interface HeroProps {
  children: React.ReactNode
}

const HeroBannerContainer = styled.div`
  width: 100%;
  max-height: 500px;
`

const CenterHero = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`

export const Hero: React.FC<HeroProps> = ({ children }) => {
  const { isDarkMode } = React.useContext(ThemeContext)
  const { toggle } = useDarkMode()
  return (
    <>
      <HeroBannerContainer onClick={toggle}>
        <CenterHero>
          <HeroBanner isDay={!isDarkMode} />
        </CenterHero>
      </HeroBannerContainer>
      <MainContainer>
        <Main>{children}</Main>
      </MainContainer>
    </>
  )
}
