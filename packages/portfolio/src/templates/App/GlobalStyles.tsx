import React from "react"
import { Global, css } from '@emotion/react'
import { COLOR_PALETTE } from "~styles"

const headerValues = ["h1", "h2", "h3", "h4", "h5", "h6"]
// Create smooth transitions for header links, to fade in on hover
const enumerateHeaderStyles = (svgSelector = "", headerPsuedoClass = "") =>
  headerValues.map((h) => `${h}${headerPsuedoClass} ${svgSelector}`).join(",")

const headerLinkStyles = css`
  html {
    background-color: ${COLOR_PALETTE.backgroundPrimary.color};
    scroll-behavior: smooth;
  }

  ${enumerateHeaderStyles(`.header-anchor svg`)} {
    opacity: 0;
    visibility: visible;
    transition: opacity 250ms ease-in-out;
  }
  ${enumerateHeaderStyles(`.header-anchor svg`, ":hover")},
  ${enumerateHeaderStyles(`.header-anchor:focus svg`)} {
    opacity: 1;
  }
`

export const GlobalStyles: React.FC = () => <Global styles={headerLinkStyles} />
