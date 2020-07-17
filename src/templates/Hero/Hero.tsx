import React from "react"
import styled from "@emotion/styled"
import { BREAKPOINTS, COLOR_PALETTE } from "~constants"
import HeroBanner from "./HeroBanner.svg"

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
  background-color: ${COLOR_PALETTE.backgroundBrand.color};
  max-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

export const Hero: React.FC<HeroProps> = ({ children }) => {
  return (
    <>
      <HeroBannerContainer>
        <HeroBanner />
      </HeroBannerContainer>
      <Main>{children}</Main>
    </>
  )
}
