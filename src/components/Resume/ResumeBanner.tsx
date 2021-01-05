import styled from "@emotion/styled"
import Banner from "~components/Banner"

import { MOBILE } from "./constants"

export const ResumeBanner = styled(Banner)`
  @media only print {
    display: none;
  }
  @media ${MOBILE} {
    flex-direction: column;
  }
`
