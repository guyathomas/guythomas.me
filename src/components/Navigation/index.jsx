import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import { Link } from "gatsby"
import noop from "lodash/noop"
import { PagePreview } from "./PagePreview"
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

const MenuIconLine = `
  width: 30px;
  height: 2px;
  transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1);
`
const MenuIconPsuedo = `
  ${MenuIconLine}
  content: "";
  position: absolute;
  left: 0;
  background-color: #007acc;
  transform-origin: left;
`

const MenuIcon = styled.div`
  ${MenuIconLine}
  background-color: ${props =>
    props.isNavigationExpanded ? "transparent" : "#007acc"};

  &:before {
    ${MenuIconPsuedo}
    top: 0;
    transform: rotate(
      ${props => (props.isNavigationExpanded ? "45deg" : "0deg")}
    );
  }
  
  &:after {
    ${MenuIconPsuedo}
    bottom: 0;
    transform: rotate(
      ${props => (props.isNavigationExpanded ? "-45deg" : "0deg")}
    );
  }
`

const HamburgerWrapper = styled.button`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  padding: 0;
  background: none;
  border: none;
  outline: none;
`

const makeSmaller = props =>
  props.isNavigationExpanded
    ? css`
        transform: scale(0.7) translateY(-2rem);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        cursor: pointer;
      `
    : css`
        transform: scale(1) translateY(0rem);
      `
const transitionDuration = 0.4

const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: all ${transitionDuration}s;
  transform-origin: bottom;
  flex-shrink: 0;
  bottom: 0;
  position: absolute;
  display: flex;
  ${makeSmaller}
`

const NavList = styled.ul`
  list-style: none;
  display: flex;
  font-size: 1.5rem;
  margin: 0;
`

const NavItem = styled.li`
  margin: 0;
`

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Blog", path: "/blog" },
]

const NavigationItems = ({ className = "" }) => (
  <NavList className={className}>
    {menuItems.map(({ label, path }) => (
      <NavItem>
        <Link to={path}>{label}</Link>
      </NavItem>
    ))}
  </NavList>
)

const NavigationToggler = ({
  toggleNavigation = noop,
  isNavigationExpanded = false,
}) => {
  return (
    <HamburgerWrapper onClick={toggleNavigation}>
      <MenuIcon isNavigationExpanded={isNavigationExpanded} />
    </HamburgerWrapper>
  )
}

export const Navigation = {
  NavigationToggler,
  ContentContainer,
  NavigationItems,
}
