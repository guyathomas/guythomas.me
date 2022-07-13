import { Link as GatsbyLink } from "gatsby";
import styled from "@emotion/styled";
import { COLOR_PALETTE } from "styles";

export const Link = styled(GatsbyLink)`
  color: ${COLOR_PALETTE.interactive.color};
  &:hover {
    color: ${COLOR_PALETTE.interactiveActive.color};
  }
`;
