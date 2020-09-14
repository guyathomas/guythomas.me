import React from "react"
import { Auth0Provider, Auth0ProviderOptions } from "@auth0/auth0-react"
import { navigate } from "gatsby"

const onRedirectCallback: Auth0ProviderOptions["onRedirectCallback"] = (
  appState
) => {
  navigate(appState?.returnTo || "/", { replace: true }).catch(console.error)
}

export const wrapRootElement = ({
  element,
}: {
  element: React.ReactNode
}): React.ReactNode => {
  if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID) {
    return <>{element}</>
  }
  return (
    <Auth0Provider
      domain={process.env.AUTH0_DOMAIN}
      clientId={process.env.AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience="api.guythomas.me"
    >
      {element}
    </Auth0Provider>
  )
}
