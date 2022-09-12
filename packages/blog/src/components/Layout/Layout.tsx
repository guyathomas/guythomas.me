import React from "react";
import Header from "~/components/Header";
import { SidebarContextProvider } from "~/context/SidebarContext";

interface LayoutProps {}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
}) => (
  <SidebarContextProvider>
    <div className="bg-white min-h-screen">
      <Header />
      {children}
    </div>
  </SidebarContextProvider>
);

export default Layout;
