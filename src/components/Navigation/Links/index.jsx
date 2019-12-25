import React from "react"
import { Link, navigate } from "gatsby"
import styled from "@emotion/styled"

import { AppStateContext } from "../../Layout"

const NavList = styled.ul`
  list-style: none;
  display: flex;
  font-size: 1.5rem;
  margin: 0;
`

const NavItem = styled.li`
  margin: 0;
`

const links = [
  { label: "Home", path: "/" },
  { label: "Blog", path: "/blog" },
]

export const Links = ({ className = "" }) => {
  const { state, dispatchers } = React.useContext(AppStateContext)

  const createNavigationHandler = path => () => {
    navigate(path)
    dispatchers.toggleNavigation()
  }

  if (!state.isNavigationExpanded) return null

  return (
    <NavList className={className}>
      {links.map(({ label, path }) => (
        <NavItem>
          <Link onClick={createNavigationHandler(path)} to={path}>
            {label}
          </Link>
        </NavItem>
      ))}
    </NavList>
  )
}
