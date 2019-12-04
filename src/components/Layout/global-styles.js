import React from "react"
import { Global, css } from "@emotion/core"

// Create smooth transitions for header links
const enumerateHeaderStyles = (svgSelector = "", headerPsuedoClass = "") =>
  ["h1", "h2", "h3", "h4", "h5", "h6"]
    .map(h => `${h}${headerPsuedoClass} ${svgSelector}`)
    .join(",")

const headerLinkStyles = css`
  ${enumerateHeaderStyles()} {
    position: relative;
  }
  ${enumerateHeaderStyles(`.header-anchor`)} {
    /* Reset Initial Styles */
    float: initial;
    padding-right: initial;
    margin-left: initial;
    
    /* Actual Styles */
    position: absolute;
    left: 0;
    padding-right: 0.5rem;
    transform: translateX(-100%);
  }
  ${enumerateHeaderStyles(`.header-anchor svg`)} {
    visibility: visible;
    opacity: 0;
    transition: opacity 0.25s linear;
    width: 1.25rem;
    height: 1.25rem;
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
