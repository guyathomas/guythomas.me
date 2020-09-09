import React from "react"
import styled from "@emotion/styled"
import { COLOR_PALETTE } from "~styles"

import { NavLinks } from "~components/NavLinks"

const MenuContainer = styled.ul`
  height: 100vh;
  background-color: ${() => COLOR_PALETTE.backgroundBrand.color};
  border-top: 1px solid ${() => COLOR_PALETTE.strokeSecondary.color};
  margin-left: 0;
  width: 200px;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 3rem;
  & > li {
    margin-bottom: 1rem;
    font-size: 2rem;
  }
`

interface MenuProps {
  className?: string
  onClick: () => void
}

export const Menu: React.FC<MenuProps> = ({ className, onClick }) => {
  return (
    <MenuContainer className={className}>
      <NavLinks onClick={onClick} />
    </MenuContainer>
  )
}
