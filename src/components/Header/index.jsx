import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"

const Nav = styled.nav`
  position: absolute;
  width: 100%;
`

const LinkList = styled.ul`
  display: flex;
  padding: 1rem;
  justify-content: space-around;
  margin: 0;
  color: white;
  flex-wrap: wrap;
`

const MenuListItem = styled.li`
  margin: 0;
  list-style: none;
  flex-shrink: 0;
  & a {
    color: white;
  }
  & .active {
    border-bottom: 2px solid white;
  }
`

export const Header = () => {
  const menuItems = [{ label: "Home", path: "/" }]
  // menuItems.push({ label: "Blog", path: "/blog" }, { label: "Resume", path: "/resume" }, { label: "Now", path: "/now" })
  return (
    <Nav>
      <LinkList>
          {menuItems.map(({ label, path }) => (
            <MenuListItem>
              <Link key={label} to={path} activeClassName="active">
                {label}
              </Link>
            </MenuListItem>
          ))}
      </LinkList>
    </Nav>
  )
}
