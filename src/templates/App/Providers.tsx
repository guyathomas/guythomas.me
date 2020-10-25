import React from "react"
import { PageSizeProvider } from "~context/PageSize"
import { GlobalStyles } from "./GlobalStyles"
import { ThemeProvider } from "./ThemeProvider"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <PageSizeProvider>
      <ThemeProvider>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </PageSizeProvider>
  )
}
