import { DarkMode } from "./DarkMode"

export type ColorPaletteType =
  | "primary"
  | "secondary"
  | "blackOrWhite"
  | "whiteOrBlack"
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
  light: string
  dark: string
  cssVariable: string
}

function getColor(this: ColorType): string {
  return `var(${this.cssVariable}, ${
    DarkMode.enabled ? this.dark : this.light
  })`
}

export const COLOR_PALETTE: { [key in ColorPaletteType]: ColorType } = {
  backgroundBrand: {
    dark: "rgba(33,58,68,1)",
    light: "rgba(222,237,243,1)",
    cssVariable: "--theme-background-brand",
    get color(): string {
      return getColor.call(this)
    },
  },
  blackOrWhite: {
    dark: "rgba(0,0,0,1)",
    light: "rgba(255,255,255,1)",
    cssVariable: "--theme-black-or-white",
    get color(): string {
      return getColor.call(this)
    },
  },
  whiteOrBlack: {
    dark: "rgba(255,255,255,1)",
    light: "rgba(0,0,0,1)",
    cssVariable: "--theme-white-or-black",
    get color(): string {
      return getColor.call(this)
    },
  },
  primary: {
    dark: "rgba(255,255,255,1)",
    light: "rgba(12,11,49,1)",
    cssVariable: "--theme-primary",
    get color(): string {
      return getColor.call(this)
    },
  },
  secondary: {
    dark: "rgba(255,255,255,0.7)",
    light: "rgba(12,11,49,0.7)",
    cssVariable: "--theme-secondary",
    get color(): string {
      return getColor.call(this)
    },
  },
  placeholder: {
    dark: "rgba(255,255,255,0.45)",
    light: "rgba(12,11,49,0.45)",
    cssVariable: "--theme-placeholder",
    get color(): string {
      return getColor.call(this)
    },
  },
  positive: {
    dark: "rgba(80,174,139,1)",
    light: "rgba(0,130,76,1)",
    cssVariable: "--theme-positive",
    get color(): string {
      return getColor.call(this)
    },
  },
  negative: {
    dark: "rgba(239,135,113,1)",
    light: "rgba(219,54,21,1)",
    cssVariable: "--theme-negative",
    get color(): string {
      return getColor.call(this)
    },
  },
  interactive: {
    dark: "rgba(129,183,199,1)",
    light: "rgba(59,112,128,1)",
    cssVariable: "--theme-interactive",
    get color(): string {
      return getColor.call(this)
    },
  },
  interactiveActive: {
    dark: "rgb(166,200,210,1)",
    light: "rgb(11,57,84,1)",
    cssVariable: "--theme-interactive-active",
    get color(): string {
      return getColor.call(this)
    },
  },
  primaryInverse: {
    dark: "rgba(23,23,31,1)",
    light: "rgba(255,255,255,1)",
    cssVariable: "--theme-primary-inverse",
    get color(): string {
      return getColor.call(this)
    },
  },
  backgroundPrimary: {
    dark: "rgba(23,23,31,1)",
    light: "rgba(255,255,255,1)",
    cssVariable: "--theme-background-primary",
    get color(): string {
      return getColor.call(this)
    },
  },
  backgroundSecondary: {
    dark: "rgba(31,31,42,1)",
    light: "rgba(244,244,250,1)",
    cssVariable: "--theme-background-secondary",
    get color(): string {
      return getColor.call(this)
    },
  },
  elevationOverlay: {
    dark: "rgba(215,222,255,1)",
    light: "rgba(255,255,255,0)",
    cssVariable: "--theme-elevation-overlay",
    get color(): string {
      return getColor.call(this)
    },
  },
  strokePrimary: {
    dark: "rgba(255,255,255,1)",
    light: "rgba(12,11,49,1)",
    cssVariable: "--theme-stroke-primary",
    get color(): string {
      return getColor.call(this)
    },
  },
  strokeSecondary: {
    dark: "rgba(255,255,255,0.45)",
    light: "rgba(12,11,49,0.45)",
    cssVariable: "--theme-stroke-secondary",
    get color(): string {
      return getColor.call(this)
    },
  },
  strokeTertiary: {
    dark: "rgba(255,255,255,0.16)",
    light: "rgba(12,11,49,0.16)",
    cssVariable: "--theme-stroke-tertiary",
    get color(): string {
      return getColor.call(this)
    },
  },
  strokePrimaryInverse: {
    dark: "rgba(23,23,31,1)",
    light: "rgba(255,255,255,1)",
    cssVariable: "--theme-stroke-primary-inverse",
    get color(): string {
      return getColor.call(this)
    },
  },
  strokeNegative: {
    dark: "rgba(239,135,113,1)",
    light: "rgba(219,54,21,1)",
    cssVariable: "--theme-stroke-negative",
    get color(): string {
      return getColor.call(this)
    },
  },
}
