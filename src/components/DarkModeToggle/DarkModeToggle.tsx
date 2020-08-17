import React from "react"
import styled from "@emotion/styled"
import useDarkMode from "use-dark-mode"

import { COLOR_PALETTE } from "~styles"
import { ThemeContext } from "~templates"

import Moon from "./Moon.svg"
import Sun from "./Sun.svg"

interface ToggleButtonProps {
  isDarkMode: boolean
}

const TRANSITION_DURATION_MS = 1000
const TRANSITION_DURATION_FULL = `${TRANSITION_DURATION_MS}ms`
const TRANSITION_DURATION_HALF = `${TRANSITION_DURATION_MS / 2}ms`

const ToggleButton = styled.button<ToggleButtonProps>`
  border-radius: 50%;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border: none;
  background-color: ${COLOR_PALETTE.blackOrWhite.color};
  transform: rotate(${(props) => (props.isDarkMode ? "90deg" : "0deg")});
  transition: all ${TRANSITION_DURATION_FULL} cubic-bezier(0.3, -1, 0.265, 1);
  outline: none;
  position: relative;
  padding: 0;
`

interface SVGWrapperProps {
  enabled: boolean
}
const SVGWrapper = styled.div<SVGWrapperProps>`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  transition: ${TRANSITION_DURATION_HALF};
  opacity: ${(props) => (props.enabled ? "1" : "0")};
  fill: ${COLOR_PALETTE.whiteOrBlack.color};
  stroke: ${COLOR_PALETTE.whiteOrBlack.color};
  transition-delay: ${(props) =>
    props.enabled ? "0s" : TRANSITION_DURATION_HALF};
`

interface DarkModeToggleProps {
  toggleType?: "sun" | "clock"
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  toggleType = "sun",
}) => {
  const { isDarkMode } = React.useContext(ThemeContext)
  const { toggle } = useDarkMode()

  if (toggleType === "sun") {
    return (
      <ToggleButton isDarkMode={isDarkMode} onClick={toggle}>
        <SVGWrapper enabled={isDarkMode}>
          <Sun />
        </SVGWrapper>
        <SVGWrapper enabled={!isDarkMode}>
          <Moon />
        </SVGWrapper>
      </ToggleButton>
    )
  }
  return null
}
