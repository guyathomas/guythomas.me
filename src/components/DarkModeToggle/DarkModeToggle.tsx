import React from "react"
import styled from "@emotion/styled"
import { Global, css } from '@emotion/react'

import { COLOR_PALETTE } from "~styles"
import { ThemeContext } from "~templates"

import Moon from "./Moon.svg"
import Sun from "./Sun.svg"
import { Clock } from "./Clock"

interface ToggleButtonProps {
  isDarkMode: boolean
}

const TRANSITION_DURATION_MS = 1000
const TRANSITION_DURATION_FULL = `${TRANSITION_DURATION_MS}ms`
const TRANSITION_DURATION_HALF = `${TRANSITION_DURATION_MS / 2}ms`

const ToggleButton = styled.button<ToggleButtonProps>`
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
  outline: none;
  position: relative;
  padding: 0;
  transition-duration: ${TRANSITION_DURATION_FULL};
`

const SunToggleButton = styled(ToggleButton)`
  transform: rotate(${(props) => (props.isDarkMode ? "90deg" : "0deg")});
  transition: all ${TRANSITION_DURATION_FULL} cubic-bezier(0.3, -1, 0.265, 1);
  color: ${COLOR_PALETTE.whiteOrBlack.color};
  fill: ${COLOR_PALETTE.whiteOrBlack.color};
  stroke: ${COLOR_PALETTE.whiteOrBlack.color};
`

interface SVGWrapperProps {
  enabled: boolean
}
const SVGWrapper = styled.div<SVGWrapperProps>`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  fill: inherit;
  stroke: inherit;
`

const SVGWrapperSun = styled(SVGWrapper)`
  transition-delay: ${(props) =>
    props.enabled ? "0s" : TRANSITION_DURATION_HALF};
  transition: ${TRANSITION_DURATION_HALF};
  opacity: ${(props) => (props.enabled ? "1" : "0")};
`

const headerLinkStyles = css`
  #hour-hand,
  #minute-hand {
    transition: transform 1s;
    transform-origin: center;
  }
  #hour-hand {
    transform: rotate(0);
  }
  #hour-hand.fast-forward {
    transform: rotate(360deg);
  }
  #minute-hand {
    transform: rotate(0);
  }
  #minute-hand.fast-forward {
    transform: rotate(4320deg);
  }
`

const SVGAnimation: React.FC = () => <Global styles={headerLinkStyles} />

interface DarkModeToggleProps {
  toggleType?: "sun" | "clock"
  className?: string
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  toggleType = "sun",
  className,
}) => {
  const { isDarkMode, toggleColorMode } = React.useContext(ThemeContext)

  if (toggleType === "clock") {
    return (
      <ToggleButton
        className={className}
        isDarkMode={isDarkMode}
        onClick={toggleColorMode}
      >
        <SVGWrapper enabled={isDarkMode}>
          <SVGAnimation />
          <Clock fastForward={isDarkMode} />
        </SVGWrapper>
      </ToggleButton>
    )
  }

  return (
    <SunToggleButton
      className={className}
      isDarkMode={isDarkMode}
      onClick={toggleColorMode}
    >
      <SVGWrapperSun enabled={isDarkMode}>
        <Sun />
      </SVGWrapperSun>
      <SVGWrapperSun enabled={!isDarkMode}>
        <Moon />
      </SVGWrapperSun>
    </SunToggleButton>
  )
}
