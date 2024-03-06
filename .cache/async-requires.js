// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---src-templates-blog-post-js": () => import("./../src/templates/blog-post.js" /* webpackChunkName: "component---src-templates-blog-post-js" */),
  "component---cache-dev-404-page-js": () => import("./dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---src-pages-404-js": () => import("./../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */),
  "component---src-pages-blog-jsx": () => import("./../src/pages/blog.jsx" /* webpackChunkName: "component---src-pages-blog-jsx" */),
  "component---src-pages-index-jsx": () => import("./../src/pages/index.jsx" /* webpackChunkName: "component---src-pages-index-jsx" */)
}

