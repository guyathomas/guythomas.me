import { darkMode } from "./DarkMode"

export type ColorPaletteType =
  | "primary"
  | "secondary"
  | "blackOrWhite"
  | "whiteOrBlack"
  | "interactive"
  | "interactiveActive"
  | "backgroundPrimary"
  | "backgroundSecondary"
  | "backgroundTertiary"
  | "backgroundSky"
  | "strokePrimary"

type ColorType = {
  color: string
  light: string
  dark: string
  cssVariable: string
}

function getColor(this: ColorType): string {
  return `var(${this.cssVariable}, ${
    darkMode.enabled ? this.dark : this.light
  })`
}

export const COLOR_PALETTE: { [key in ColorPaletteType]: ColorType } = {
  backgroundSky: {
    dark: "rgba(33,58,68,1)",
    light: "rgba(222,237,243,1)",
    cssVariable: "--theme-background-sky",
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
    dark: "rgba(247,247,247,1)",
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
  backgroundPrimary: {
    dark: "rgba(45,46,46,1)",
    light: "rgba(255,255,255,1)",
    cssVariable: "--theme-background-primary",
    get color(): string {
      return getColor.call(this)
    },
  },
  backgroundSecondary: {
    dark: "rgba(43,44,44,1)",
    light: "rgba(251,251,251,1)",
    cssVariable: "--theme-background-secondary",
    get color(): string {
      return getColor.call(this)
    },
  },
  backgroundTertiary: {
    dark: "rgba(41,42,42,1)",
    light: "rgba(248,248,248,1)",
    cssVariable: "--theme-background-tertiary",
    get color(): string {
      return getColor.call(this)
    },
  },
  strokePrimary: {
    dark: "rgba(64,66,66,1)",
    light: "rgba(236,236,236,1)",
    cssVariable: "--theme-stroke-primary",
    get color(): string {
      return getColor.call(this)
    },
  },
}
