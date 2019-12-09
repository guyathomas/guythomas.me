import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"

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
export const Header = () => {
  const menuItems = [{ label: "Home", path: "/" }, { label: "Blog", path: "/blog" }]
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
