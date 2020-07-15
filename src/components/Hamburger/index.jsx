import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"

import { TransitionConstants } from "../Layout/Transition"

const MenuIconLine = css`
  width: 30px;
  height: 2px;
  ${TransitionConstants.transitions.page}
`
const MenuIconPsuedo = css`
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

export const Hamburger = ({ onClick, isActive }) => {
  const menuIconName = isActive ? "cross" : "hamburger"

  return (
    <HamburgerWrapper onClick={onClick}>
      <MenuIcon menuIconName={menuIconName} />
    </HamburgerWrapper>
  )
}
