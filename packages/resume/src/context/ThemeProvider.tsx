import React from "react";
import { COLOR_PALETTE } from "styles";

interface ThemeProviderProps {
  children: React.ReactNode;
}
export type ColorMode = "light" | "dark";
const validColors = new Set<ColorMode>(["light", "dark"]);
interface ThemeContextValue {
  colorMode?: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
  isDarkMode: boolean;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  setColorMode: () => {
    return undefined;
  },
  toggleColorMode: () => {
    return undefined;
  },
  isDarkMode: false,
  colorMode: undefined,
});

function isValidColorType(colorType: string): colorType is ColorMode {
  return validColors.has(colorType as ColorMode);
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colorMode, setColorModeState] = React.useState<ColorMode>();

  React.useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      "--initial-color-mode"
    );
    if (isValidColorType(initialColorValue)) {
      setColorModeState(initialColorValue);
    }
  }, []);
  const setColorMode = (newValue: ColorMode) => {
    const root = window.document.documentElement;
    // 1. Update React color-mode state
    setColorModeState(newValue);
    // 2. Update localStorage
    localStorage.setItem("color-mode", newValue);
    // 3. Update each color
    // TODO: This is done in two places.  Abstract implementation
    Object.values(COLOR_PALETTE).forEach((color) => {
      root.style.setProperty(
        color.cssVariable,
        newValue === "dark" ? color.dark : color.light
      );
    });
  };
  const toggleColorMode = () => {
    switch (colorMode) {
      case "dark":
        setColorMode("light");
        break;
      case "light":
        setColorMode("dark");
        break;
      default:
        break;
    }
  };
  return (
    <ThemeContext.Provider
      value={{
        colorMode,
        setColorMode,
        isDarkMode: colorMode === "dark",
        toggleColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
