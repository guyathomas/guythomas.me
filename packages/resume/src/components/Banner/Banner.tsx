import React from "react";
import styled from "@emotion/styled";
import { COLOR_PALETTE } from "styles";

const PageBannerContainer = styled.div`
  padding: 1rem;
  background-color: #1890ff;
  color: ${() => COLOR_PALETTE.primary.color};
  position: sticky;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;
interface BannerProps {
  className?: string;
  children: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({ children, className }) => (
  <PageBannerContainer className={className}>{children}</PageBannerContainer>
);

export default Banner;
