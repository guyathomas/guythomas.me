import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"

const LinkList = styled.ul`
  display: flex;
  padding: 2rem 1rem;
  justify-content: space-around;
  margin: 0;
  color: white;
  flex-wrap: wrap;
`

const MenuListItem = styled.li`
  margin: 0;
  list-style: none;
  flex-shrink: 0;
  font-size: 1.5rem;
  & a {
    color: white;
  }
`
// horizontal, verticalMiddle, horizontalTop
export const Header = ({ orientationAndPosition = 'horizontal' }) => {
  const menuItems = [{ label: "Home", path: "/" }, { label: "Blog", path: "/blog" }]
  // menuItems.push({ label: "Resume", path: "/resume" }, { label: "Now", path: "/now" })
  return (
    <nav>
      <LinkList>
          {menuItems.map(({ label, path }) => (
            <MenuListItem>
              <Link key={label} to={path} activeClassName="active">
                {label}
              </Link>
            </MenuListItem>
          ))}
      </LinkList>
    </nav>
  )
}
