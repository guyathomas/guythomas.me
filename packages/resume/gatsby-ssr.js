import React from "react"
import { COLOR_PALETTE } from "./src/styles"

const COLOR_MODE_KEY = "color-mode"
const INITIAL_COLOR_MODE_CSS_PROP = "--initial-color-mode"

function setColorsByTheme() {
  const colors = "🌈"
  const colorModeKey = "🔑"
  const colorModeCssProp = "⚡️"

  const mql = window.matchMedia("(prefers-color-scheme: dark)")
  const prefersDarkFromMQ = mql.matches
  const persistedPreference = localStorage.getItem(colorModeKey)

  let colorMode = "light"

  const hasUsedToggle = typeof persistedPreference === "string"

  if (hasUsedToggle) {
    colorMode = persistedPreference
  } else {
    colorMode = prefersDarkFromMQ ? "dark" : "light"
  }

  let root = document.documentElement

  root.style.setProperty(colorModeCssProp, colorMode)

  Object.values(colors).forEach((color) => {
    root.style.setProperty(
      color.cssVariable,
      colorMode === "dark" ? color.dark : color.light
    )
  })
}

const MagicScriptTag = () => {
  const boundFn = String(setColorsByTheme)
    .replace('"🌈"', JSON.stringify(COLOR_PALETTE))
    .replace("🔑", COLOR_MODE_KEY)
    .replace("⚡️", INITIAL_COLOR_MODE_CSS_PROP)

  const calledFunction = `(${boundFn})()`

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: calledFunction }} />
}

/**
 * If the user has JS disabled, the injected script will never fire!
 * This means that they won't have any colors set, everything will be default
 * black and white.
 * We can solve for this by injecting a `<style>` tag into the head of the
 * document, which sets default values for all of our colors.
 * Only light mode will be available for users with JS disabled.
 */
// TODO:  Maybe remove. Not sure if this is needed
// const FallbackStyles = () => {
//   // Create a string holding each CSS variable:
//   /*
//     `--color-text: black;
//     --color-background: white;`
//   */

//   const cssVariableString = Object.entries(COLORS).reduce(
//     (acc, [name, colorByTheme]) => {
//       return `${acc}\n--color-${name}: ${colorByTheme.light};`
//     },
//     ""
//   )

//   const wrappedInSelector = `html { ${cssVariableString} }`

//   return <style>{wrappedInSelector}</style>
// }

export const onRenderBody = ({ setPreBodyComponents, setHeadComponents }) => {
  //   setHeadComponents(<FallbackStyles />)
  setPreBodyComponents(<MagicScriptTag />)
}
