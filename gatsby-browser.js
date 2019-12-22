// custom typefaces

require("typeface-open-sans")
require("typeface-work-sans")

exports.onClientEntry = () => {
  require("./polyfill");
}
