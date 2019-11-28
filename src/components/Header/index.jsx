import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"

import Hamburger from "./icons/hamburger.svg"
import Cross from "./icons/cross.svg"
import { useState } from "react"

const Nav = styled.nav`
  position: absolute;
  width: 100%;
  z-index: 1;
`

const MenuPositioner = styled.div`
  height: 3.8rem;
  display: flex;
  justify-content: flex-end;
  padding: 1.8rem 1rem 0;
  & svg {
    height: 100%;
    width: unset;
  }
`

const MenuList = styled.ul`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  margin: 0;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: white;
  border-radius: 1rem 1rem 0 0;
  display: ${props => (props.isExpanded ? "initial" : 'none')}
`

const MenuListItem = styled.li`
  width: 100%;
  margin: 0;
  list-style: none;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
`

export const Header = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const MenuToggler = isExpanded ? Cross : Hamburger
  const MenuItems = [{ label: "Home", path: "/" }]
  const toggleIsExpanded = () => setIsExpanded(!isExpanded)
  return (
    <Nav>
      <MenuPositioner>
        <MenuToggler onClick={toggleIsExpanded} style={{ zIndex: 1 }} />
        <MenuList isExpanded={isExpanded}>
          {MenuItems.map(({ label, path }) => (
            <MenuListItem>
              <Link key={label} to={path}>
                {label}
              </Link>
            </MenuListItem>
          ))}
        </MenuList>
      </MenuPositioner>
    </Nav>
  )
}
