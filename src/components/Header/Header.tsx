import React from "react"
import styled from "@emotion/styled"
import { LINKS, BREAKPOINTS, COLOR_PALETTE } from "~constants"
import { useLocation } from "@reach/router"
import { Link } from "../Link"
import Avatar from "./Avatar.svg"

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
  background-color: ${COLOR_PALETTE.backgroundBrand.color};
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

export const Header: React.FC = () => {
  const location = useLocation()
  return (
    <HeaderWrapper>
      <HeaderContent>
        <Link to="/">
          <AvatarWrapper>
            <Avatar />
          </AvatarWrapper>
        </Link>
        <LinkItems>
          {LINKS.map((link) => (
            <LinkItem isActive={location.pathname === link.path}>
              <Link to={link.path}>{link.label}</Link>
            </LinkItem>
          ))}
        </LinkItems>
      </HeaderContent>
    </HeaderWrapper>
  )
}
