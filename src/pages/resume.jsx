import React from "react"
import { SEO } from "../components/Seo"
import { Resume } from "../components/Resume"

export default () => {
  return (
    <>
      <SEO title="Guy Thomas's Resume" />
      <main>
        Resume Page
        <Resume />
      </main>
    </>
  )
}
