import React from "react"

import { SEO } from "~components/SEO"
import { App } from "~templates"

const NotFound: React.FC = () => (
  <App>
    <SEO title="404: Not Found" />
    <h1>Not Found</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </App>
)
export default NotFound
