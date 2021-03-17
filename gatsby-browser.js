// custom typefaces

import "typeface-open-sans"
import "typeface-work-sans"

// Line highlighting & numbers
import "./gatsby-remark-prismjs"

export const onClientEntry = () => {
  require("./polyfill")
}
