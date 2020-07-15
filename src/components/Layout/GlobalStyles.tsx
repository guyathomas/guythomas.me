import React from "react"
import { Global, css } from "@emotion/core"
import { TRANSITIONS } from "~contexts/Transition"

// Create smooth transitions for header links
const enumerateHeaderStyles = (svgSelector = "", headerPsuedoClass = "") =>
  ["h1", "h2", "h3", "h4", "h5", "h6"]
    .map((h) => `${h}${headerPsuedoClass} ${svgSelector}`)
    .join(",")

const headerLinkStyles = css`
  ${enumerateHeaderStyles(`.header-anchor svg`)} {
    opacity: 0;
    visibility: visible;
    ${TRANSITIONS.page}
  }
  ${enumerateHeaderStyles(`.header-anchor svg`, ":hover")},
  ${enumerateHeaderStyles(`.header-anchor:focus svg`)} {
    opacity: 1;
  }
`

export const GlobalStyles = () => <Global styles={headerLinkStyles} />
