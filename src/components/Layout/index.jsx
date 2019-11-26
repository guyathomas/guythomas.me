import React, { createContext } from "react"
import styled from "@emotion/styled"
import noop from 'lodash/noop';
import "./style.css"

const Main = styled.main`
  scroll-snap-type: y mandatory;
  height: 100vh;
  overflow-y: scroll;
`

export const LayoutContext = createContext({ layoutEl: null })

export const Layout = ({ children, onScroll = noop }) => {
  return (
    <Main onScroll={onScroll}>{children}</Main>
  )
}
