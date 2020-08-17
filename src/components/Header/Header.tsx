import React from "react"
import styled from "@emotion/styled"
import { BREAKPOINTS, COLOR_PALETTE } from "~styles"
import { useLocation } from "@reach/router"
import { Link } from "~components/Link"
import { DarkModeToggle } from "~components/DarkModeToggle"
import Avatar from "./Avatar.svg"

interface AppLink {
  label: string
  path: string
}

export const LINKS: AppLink[] = [{ label: "Blog", path: "/blog" }]

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
  background-color: ${(_) => COLOR_PALETTE.backgroundBrand.color};
`

const LinkItems = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
`

interface LinkItemProps {
  isActive: boolean
}
const LinkItem = styled.li<LinkItemProps>`
  margin-left: 3rem;
  font-size: 1.25rem;
  margin-bottom: 0;
  color: ${(props) =>
    props.isActive ? COLOR_PALETTE.interactiveActive.color : "inherit"};

  &:hover {
    color: ${COLOR_PALETTE.interactiveActive.color};
  }
`

const AvatarWrapper = styled.div`
  height: 5rem;
  width: 5rem;
`

const AvatarAndDarkMode = styled.div`
  display: flex;
  align-items: end;
`

export const Header: React.FC = () => {
  const location = useLocation()
  return (
    <HeaderWrapper>
      <HeaderContent>
        <AvatarAndDarkMode>
          <Link to="/">
            <AvatarWrapper>
              <Avatar />
            </AvatarWrapper>
          </Link>
          <DarkModeToggle />
        </AvatarAndDarkMode>
        <LinkItems>
          {LINKS.map((link) => (
            <LinkItem
              key={link.path}
              isActive={location.pathname === link.path}
            >
              <Link to={link.path}>{link.label}</Link>
            </LinkItem>
          ))}
        </LinkItems>
      </HeaderContent>
    </HeaderWrapper>
  )
}
