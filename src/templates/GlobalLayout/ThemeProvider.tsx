import React from "react"
import useDarkMode from "use-dark-mode"
import { COLOR_PALETTE } from "~styles"

interface ThemeProviderProps {
  children: React.ReactNode
}

interface ThemeContextProps {
  isDarkMode: boolean
}
export const ThemeContext = React.createContext<ThemeContextProps>({
  isDarkMode: false,
})

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { value: isDarkMode } = useDarkMode(false)
  React.useEffect(() => {
    Object.values(COLOR_PALETTE).forEach((color) => {
      document.documentElement.style.setProperty(
        color.cssVariable,
        isDarkMode ? color.dark : color.light
      )
    })
  }, [isDarkMode])
  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
