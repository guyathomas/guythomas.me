import React from "react";
import Sidebar from "~/components/Sidebar";
import { SidebarContextProvider } from "~/context/SidebarContext";

interface LayoutProps {}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
}) => (
  <SidebarContextProvider>
    <Sidebar />
    {children}
  </SidebarContextProvider>
);

export default Layout;
