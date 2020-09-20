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
  if (!process.env.GATSBY_AUTH0_DOMAIN || !process.env.GATSBY_AUTH0_CLIENT_ID) {
    return <>{element}</>
  }
  return (
    <Auth0Provider
      domain={process.env.GATSBY_AUTH0_DOMAIN}
      clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={process.env.GATSBY_AUTH0_AUDIENCE_GUYTHOMAS_API}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      {element}
    </Auth0Provider>
  )
}
