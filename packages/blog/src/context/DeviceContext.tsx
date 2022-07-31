import React from "react";

export type DeviceContextResult = { isMobile: boolean };
type DeviceContextValue = DeviceContextResult | undefined;

const deviceContextInitialValue: DeviceContextValue = undefined;

export const DeviceContext = React.createContext<DeviceContextValue>(
  deviceContextInitialValue
);

export const DeviceContextProvider: React.FC<
  React.PropsWithChildren<{ value: DeviceContextValue }>
> = ({ children, value }) => (
  <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
);
