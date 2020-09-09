import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"

const LINE_COLOR = "#007ACC"

interface HamburgerProps {
  isExpanded: boolean
  onClick: () => void
}

const MenuIconLine = css`
  width: 100%;
  height: 0.2rem;
  transition: transform 120ms ease;
`

const MenuIconPsuedo = css`
  ${MenuIconLine};
  content: "";
  position: absolute;
  left: 0;
  background-color: ${LINE_COLOR};
  transform-origin: left;
`
interface MenuIconProps {
  isExpanded: boolean
}

const MenuIcon = styled.div<MenuIconProps>`
  ${MenuIconLine}
  background-color: ${(props) =>
    props.isExpanded ? "transparent" : LINE_COLOR};
  transition: opacity 150ms cubic-bezier(.22,.61,.35,1);
  transition-delay: 120ms;
  &:before {
    ${MenuIconPsuedo}
    top: 0;
    transform: rotate(
      ${(props) => (props.isExpanded ? "41deg" : "0deg")}
    );
  }
  
  &:after {
    ${MenuIconPsuedo}
    bottom: 0;
    transform: rotate(
      ${(props) => (props.isExpanded ? "-41deg" : "0deg")}
    );
  }
`

const HamburgerWrapper = styled.button`
  display: flex;
  flex-shrink: 0;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 1.5rem;
  position: relative;
  padding: 0;
  background: none;
  border: none;
  outline: none;
`

export const Hamburger: React.FC<HamburgerProps> = ({
  isExpanded,
  onClick,
}) => {
  return (
    <HamburgerWrapper onClick={onClick}>
      <MenuIcon isExpanded={isExpanded} />
    </HamburgerWrapper>
  )
}
