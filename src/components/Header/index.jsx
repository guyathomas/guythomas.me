import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import noop from "lodash/noop"

import HamburgerSquare from "../Header/icons/hamburger.svg"
import Cross from "../Header/icons/cross.svg"

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
  & a {
    font-size: 3rem;
  }
`

// horizontal, verticalMiddle, horizontalTop
const Hamburger = ({ toggleMenu, menuExpanded }) => {
  const MenuIcon = menuExpanded ? Cross : HamburgerSquare
  return (
      <MenuIcon onClick={toggleMenu} />
  )
}

const Nav = () => {
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

export const Header = ({ children = noop }) => {
  const [menuExpanded, setMenuExpanded] = React.useState(false)
  const toggleMenu = () => setMenuExpanded(!menuExpanded)
  const BoundHamburger = () => <Hamburger toggleMenu={toggleMenu} menuExpanded={menuExpanded} />
  return <div>{children({ Hamburger: BoundHamburger, Nav }, menuExpanded)}</div>
}
