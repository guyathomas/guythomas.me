import styled from "@emotion/styled"
import ButtonLink from "~components/ButtonLink"

import { DESKTOP, MOBILE } from "./constants"

export const ResumeBannerButton = styled(ButtonLink)`
  @media ${DESKTOP} {
    margin-left: 1rem;
  }
  @media ${MOBILE} {
    margin-top: 1rem;
  }
`
