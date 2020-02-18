// custom typefaces

require("typeface-lato")

// Line highlighting & numbers
require("./gatsby-remark-prismjs")

// require("prismjs/themes/prism-twilight.css")

exports.onClientEntry = () => {
  require("./polyfill")
}
