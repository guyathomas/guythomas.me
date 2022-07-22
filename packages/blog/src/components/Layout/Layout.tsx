import React from "react";

interface LayoutProps {
  children: React.ReactElement;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
