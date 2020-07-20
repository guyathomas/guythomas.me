import React from "react"
import styled from "@emotion/styled"
import useDarkMode from "use-dark-mode"
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
  background-color: ${(_) => COLOR_PALETTE.backgroundBrand.color};
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
  const { isDarkMode } = React.useContext(ThemeContext)
  const { toggle } = useDarkMode()
  return (
    <>
      <HeroBannerContainer onClick={toggle}>
        <CenterHero isDay={!isDarkMode} />
      </HeroBannerContainer>
      <MainContainer>
        <Main>{children}</Main>
      </MainContainer>
    </>
  )
}
