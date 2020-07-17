import { DarkMode } from "./DarkMode"

export type ColorPaletteType =
  | "primary"
  | "secondary"
  | "placeholder"
  | "positive"
  | "negative"
  | "interactive"
  | "interactiveActive"
  | "primaryInverse"
  | "backgroundPrimary"
  | "backgroundSecondary"
  | "backgroundBrand"
  | "elevationOverlay"
  | "strokePrimary"
  | "strokeSecondary"
  | "strokeTertiary"
  | "strokePrimaryInverse"
  | "strokeNegative"

type ColorType = {
  color: string
}

export const COLOR_PALETTE: { [key in ColorPaletteType]: ColorType } = {
  backgroundBrand: {
    get color() {
      return DarkMode.enabled ? "rgb(222,237,243,1)" : "rgb(222,237,243,1)"
    },
  },
  primary: {
    get color() {
      return DarkMode.enabled ? "rgba(255,255,255,1)" : "rgba(12,11,49,1)"
    },
  },
  secondary: {
    get color() {
      return DarkMode.enabled ? "rgba(255,255,255,0.7)" : "rgba(12,11,49,0.7)"
    },
  },
  placeholder: {
    get color() {
      return DarkMode.enabled ? "rgba(255,255,255,0.45)" : "rgba(12,11,49,0.45)"
    },
  },
  positive: {
    get color() {
      return DarkMode.enabled ? "rgba(80,174,139,1)" : "rgba(0,130,76,1)"
    },
  },
  negative: {
    get color() {
      return DarkMode.enabled ? "rgba(239,135,113,1)" : "rgba(219,54,21,1)"
    },
  },
  interactive: {
    get color() {
      return DarkMode.enabled ? "rgba(59,112,128,1)" : "rgba(59,112,128,1)"
    },
  },
  interactiveActive: {
    get color() {
      return DarkMode.enabled ? "rgb(11,57,84,1)" : "rgb(11,57,84,1)"
    },
  },
  primaryInverse: {
    get color() {
      return DarkMode.enabled ? "rgba(23,23,31,1)" : "rgba(255,255,255,1)"
    },
  },
  backgroundPrimary: {
    get color() {
      return DarkMode.enabled ? "rgba(23,23,31,1)" : "rgba(255,255,255,1)"
    },
  },
  backgroundSecondary: {
    get color() {
      return DarkMode.enabled ? "rgba(31,31,42,1)" : "rgba(244,244,250,1)"
    },
  },
  elevationOverlay: {
    get color() {
      return DarkMode.enabled ? "rgba(215,222,255,1)" : "rgba(255,255,255,0)"
    },
  },
  strokePrimary: {
    get color() {
      return DarkMode.enabled ? "rgba(255,255,255,1)" : "rgba(12,11,49,1)"
    },
  },
  strokeSecondary: {
    get color() {
      return DarkMode.enabled ? "rgba(255,255,255,0.45)" : "rgba(12,11,49,0.45)"
    },
  },
  strokeTertiary: {
    get color() {
      return DarkMode.enabled ? "rgba(255,255,255,0.16)" : "rgba(12,11,49,0.16)"
    },
  },
  strokePrimaryInverse: {
    get color() {
      return DarkMode.enabled ? "rgba(23,23,31,1)" : "rgba(255,255,255,1)"
    },
  },
  strokeNegative: {
    get color() {
      return DarkMode.enabled ? "rgba(239,135,113,1)" : "rgba(219,54,21,1)"
    },
  },
}
