// custom typefaces

require("typeface-open-sans")
require("typeface-work-sans")

// Line highlighting & numbers
require("./gatsby-remark-prismjs")

exports.onClientEntry = () => {
  require("./polyfill")
}
