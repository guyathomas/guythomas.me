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

const SiteTitleWrapper = styled.div`
  position: relative;
  width: 100%;
`

const SiteTitle = styled.h2`
  margin: 0;
`

const AdaptiveSiteTitle: React.FC = () => {
  const { width } = React.useContext(PageSizeContext)
  const isMobile = width < BREAKPOINTS.sm
  const siteTitle = isMobile ? "Guy" : "Guy_Thomas"
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

const StyledDarkModeToggleWrapper = styled(DarkModeToggle)`
  margin-right: 8px;
  margin-left: auto;
  @media (max-width: ${BREAKPOINTS.sm}px) {
    display: none;
  }
`

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isMenuActive,
}) => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <Link to="/">
          <AdaptiveSiteTitle />
        </Link>
        <LinkItems onMenuToggle={onMenuToggle} isMenuActive={isMenuActive}>
          <NavLinks />
        </LinkItems>
        <StyledDarkModeToggleWrapper toggleType="sun" />
      </HeaderContent>
    </HeaderWrapper>
  )
}
