import React from "react"
import styled from "@emotion/styled"
import { COLOR_PALETTE } from "~styles"

interface ButtonLinkProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}
const ButtonLinkWrapper = styled.button`
  cursor: pointer;
  border: none;
  white-space: nowrap;
  background-color: ${COLOR_PALETTE.backgroundPrimary.color};
  color: ${COLOR_PALETTE.interactive.color};
  &:hover {
    color: ${COLOR_PALETTE.interactiveActive.color};
  }
`

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  onClick,
  className,
}) => (
  <ButtonLinkWrapper className={className} onClick={onClick}>
    {children}
  </ButtonLinkWrapper>
)

export default ButtonLink
