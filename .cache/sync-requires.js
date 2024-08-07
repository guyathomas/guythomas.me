const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---src-templates-blog-post-js": hot(preferDefault(require("/Users/guythomas/src/guythomas.me/src/templates/blog-post.js"))),
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/guythomas/src/guythomas.me/.cache/dev-404-page.js"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/guythomas/src/guythomas.me/src/pages/404.js"))),
  "component---src-pages-blog-jsx": hot(preferDefault(require("/Users/guythomas/src/guythomas.me/src/pages/blog.jsx"))),
  "component---src-pages-index-jsx": hot(preferDefault(require("/Users/guythomas/src/guythomas.me/src/pages/index.jsx")))
}

