import React from "react"
import { ThemeProvider } from "../src/templates/GlobalLayout/ThemeProvider"

const ThemeDecorator = (storyFn) => <ThemeProvider>{storyFn()}</ThemeProvider>

export default ThemeDecorator
