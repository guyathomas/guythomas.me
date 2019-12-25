import React from "react"
import styled from "@emotion/styled"
import { AppStateContext } from "../../Layout"

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
    props.menuIconName === "cross" ? "transparent" : "#007acc"};

  &:before {
    ${MenuIconPsuedo}
    top: 0;
    transform: rotate(
      ${props => (props.menuIconName === "cross" ? "45deg" : "0deg")}
    );
  }
  
  &:after {
    ${MenuIconPsuedo}
    bottom: 0;
    transform: rotate(
      ${props => (props.menuIconName === "cross" ? "-45deg" : "0deg")}
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

export const Hamburger = ({ disableNavigation = false }) => {
  const { state, dispatchers } = React.useContext(AppStateContext)
  const handleOnClick = () => !disableNavigation && dispatchers.toggleNavigation()
  const menuIconName = state.isNavigationExpanded ? "cross" : "hamburger"

  return (
    <HamburgerWrapper onClick={handleOnClick}>
      <MenuIcon menuIconName={menuIconName} />
    </HamburgerWrapper>
  )
}
