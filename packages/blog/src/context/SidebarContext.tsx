import React from "react";

interface SidebarContextValue {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const sidebarContextInitialValue: SidebarContextValue = {
  isExpanded: false,
  setIsExpanded: () => {},
};

export const SidebarContext = React.createContext<SidebarContextValue>(
  sidebarContextInitialValue
);
// TODO: Maybe remove this, may not need a provider.
export const SidebarContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};
