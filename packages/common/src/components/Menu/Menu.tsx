import React from "react"
import styled from "@emotion/styled"
import { COLOR_PALETTE } from "~styles"

import { NavLinks } from "~components/NavLinks"
import { DarkModeToggle } from "~components/DarkModeToggle"

const MenuContainer = styled.ul`
  height: 100vh;
  background-color: ${() => COLOR_PALETTE.backgroundSky.color};
  border-top: 1px solid ${() => COLOR_PALETTE.strokePrimary.color};
  margin-left: 0;
  padding: 1rem;
  width: 200px;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 3rem;
  background-color: 1s ease 0s;
  & > li {
    margin-bottom: 1rem;
    font-size: 2rem;
  }
`

interface MenuProps {
  className?: string
  onClick: () => void
}

const StyledDarkModeToggle = styled(DarkModeToggle)`
  margin-top: 5rem;
`

export const Menu: React.FC<MenuProps> = ({ className, onClick }) => {
  return (
    <MenuContainer className={className}>
      <NavLinks onClick={onClick} />
      <StyledDarkModeToggle toggleType="sun" />
    </MenuContainer>
  )
}
