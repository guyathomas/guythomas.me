import React from "react"
import styled from "@emotion/styled"
import { BREAKPOINTS, COLOR_PALETTE } from "~styles"
import { PageSizeContext } from "~context/PageSize"
import { Link } from "~components/Link"
import { NavLinks } from "~components/NavLinks"
import { Hamburger } from "~components/Hamburger"
import { DarkModeToggle } from "~components/DarkModeToggle"

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: ${BREAKPOINTS.lg}px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  padding: 1rem;
`

const HeaderWrapper = styled.header`
  transition: background-color 1s;
  background-color: ${() => COLOR_PALETTE.backgroundSky.color};
  border-bottom: ${() => COLOR_PALETTE.strokePrimary.color};
`

const LinkItemsStyle = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  font-size: 1.25rem;
  & > li {
    margin-left: 3rem;
    margin-bottom: 0;
  }
`

interface LinkItemsProps {
  children: React.ReactNode
  onMenuToggle: () => void
  isMenuActive: boolean
}

const LinkItems: React.FC<LinkItemsProps> = ({
  children,
  onMenuToggle,
  isMenuActive,
}) => {
  const { width } = React.useContext(PageSizeContext)
  if (width > BREAKPOINTS.sm) {
    return <LinkItemsStyle>{children}</LinkItemsStyle>
  }
  return <Hamburger isExpanded={isMenuActive} onClick={onMenuToggle} />
}

const AvatarAndDarkMode = styled.div`
  display: flex;
  align-items: center;
  color: ${COLOR_PALETTE.whiteOrBlack.color};
  fill: ${COLOR_PALETTE.whiteOrBlack.color};
  stroke: ${COLOR_PALETTE.whiteOrBlack.color};
`

const SiteTitleWrapper = styled.div`
  position: relative;
  width: 100%;
`

const SiteTitle = styled.h1`
  margin: 0;
`

const AdaptiveSiteTitle: React.FC = () => {
  const { width } = React.useContext(PageSizeContext)
  const isMobile = width < BREAKPOINTS.sm
  const siteTitle = isMobile ? "Guy" : "Guy Thomas"
  return (
    <SiteTitleWrapper>
      <SiteTitle>{siteTitle}</SiteTitle>
    </SiteTitleWrapper>
  )
}

interface HeaderProps {
  onMenuToggle: () => void
  isMenuActive: boolean
}

const DarkModeToggleWrapper = styled.div`
  padding: 11px;
  display: flex;
  align-items: center;
  margin-right: 8px;
`

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isMenuActive,
}) => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <AvatarAndDarkMode>
          <DarkModeToggleWrapper>
            <DarkModeToggle toggleType="sun" />
          </DarkModeToggleWrapper>
          <Link to="/">
            <AdaptiveSiteTitle />
          </Link>
        </AvatarAndDarkMode>
        <LinkItems onMenuToggle={onMenuToggle} isMenuActive={isMenuActive}>
          <NavLinks />
        </LinkItems>
      </HeaderContent>
    </HeaderWrapper>
  )
}
