import React from "react"
import { Global, css } from "@emotion/core"

// Create smooth transitions for header links
const enumerateHeaderStyles = (svgSelector = "", headerPsuedoClass = "") =>
  ["h1", "h2", "h3", "h4", "h5", "h6"]
    .map(h => `${h}${headerPsuedoClass} ${svgSelector}`)
    .join(",")

const headerLinkStyles = css`
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

export default () => (
  <>
    <Global styles={headerLinkStyles} />
  </>
)
