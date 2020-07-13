// custom typefaces

require("typeface-open-sans")
require("typeface-work-sans")

// Line highlighting & numbers
require("./gatsby-remark-prismjs")

// require("prismjs/themes/prism-twilight.css")

exports.onClientEntry = () => {
  require("./polyfill")
}
