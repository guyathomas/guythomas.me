import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import noop from "lodash/noop"

import HamburgerSquare from "./icons/hamburger.svg"
import Cross from "./icons/cross.svg"

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 5rem 1rem;
  margin: 0;
`

const MenuListItem = styled.li`
  margin: 0;
  list-style: none;
  flex-shrink: 0;
  font-size: 1.5rem;
  & a.active {
    cursor: default;
    color: hsla(0, 0%, 0%, 0.7) !important;
  }
  & a {
    font-size: 3rem;
    cursor: pointer;
  }
  & a:hover {
    color: #005b98;
  }
`

const NavigationToggler = ({toggleNavigation, isNavigationExpanded}) => {
  const MenuIcon = isNavigationExpanded ? Cross : HamburgerSquare
  return <MenuIcon onClick={toggleNavigation} />
}

const MenuItems = () => {
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Blog", path: "/blog" },
  ]
  // menuItems.push({ label: "Resume", path: "/resume" }, { label: "Now", path: "/now" })
  return (
    <nav>
      <LinkList>
        {menuItems.map(({ label, path }) => (
          <MenuListItem key={label}>
            <Link to={path} activeClassName="active">
              {label}
            </Link>
          </MenuListItem>
        ))}
      </LinkList>
    </nav>
  )
}

export const Navigation = {
  NavigationToggler: NavigationToggler,
  MenuItems,
}