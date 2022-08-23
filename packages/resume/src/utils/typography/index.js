/* eslint-disable */

import Typography from "typography"
import theme from "./config"

const typography = new Typography(theme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale

/* eslint-enable */
