import React from "react"
import styled from "@emotion/styled"
import { COLOR_PALETTE } from "~styles"
import { useLocation } from "@reach/router"
import { Link } from "~components/Link"

interface AppLink {
  label: string
  path: string
}

const LINKS: AppLink[] = [
  { label: "Blog", path: "/blog" },
  { label: "Resume", path: "/resume" },
  { label: "The Frontend Interview", path: "/the-frontend-interview" },
]

interface LinksProps {
  onClick?: () => void
}

interface LinkItemProps {
  isActive: boolean
}
const LinkItem = styled.li<LinkItemProps>`
  text-align: center;
  color: ${(props) =>
    props.isActive ? COLOR_PALETTE.interactiveActive.color : "inherit"};

  &:hover {
    color: ${COLOR_PALETTE.interactiveActive.color};
  }
`

export const NavLinks: React.FC<LinksProps> = ({ onClick }) => {
  const location = useLocation()

  return (
    <>
      {LINKS.map((link) => (
        <LinkItem
          key={link.path}
          isActive={location.pathname === link.path}
          onClick={onClick}
        >
          <Link to={link.path}>{link.label}</Link>
        </LinkItem>
      ))}
    </>
  )
}
