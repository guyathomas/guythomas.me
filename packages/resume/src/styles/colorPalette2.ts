import { darkMode } from "./DarkMode"

function getColor(this: ColorType): string {
  return `var(${this.cssVariable}, ${
    darkMode.enabled ? this.dark : this.light
  })`
}

export type ColorPaletteType =
  | "colorText"
  | "colorBackground"
  | "colorBlurredBackground"
  | "colorPrimary"
  | "colorSecondary"
  | "colorTertiary"
  | "colorDecorative"
  | "colorMuted"
  | "colorMutedBackground"
  | "colorInfo"
  | "colorSuccess"
  | "colorSuccessBackground"
  | "colorError"
  | "colorErrorBackground"
  | "colorAlert"
  | "colorAlertBackground"
  | "colorVenn0"
  | "colorVenn1"
  | "colorGray100"
  | "colorGray200"
  | "colorGray300"
  | "colorGray400"
  | "colorGray500"
  | "colorGray600"
  | "colorGray700"
  | "colorGray900"
  | "colorGray1000"
  | "colorSubtleBackground"
  | "colorSubtleFloating"
  | "colorHomepageLight"
  | "colorHomepageDark"
  | "colorHomepageBg"
  | "syntaxBg"
  | "syntaxHighlight"
  | "syntaxTxt"
  | "syntaxComment"
  | "syntaxProp"
  | "syntaxBool"
  | "syntaxVal"
  | "syntaxStr"
  | "syntaxName"
  | "syntaxDel"
  | "syntaxRegex"
  | "syntaxFn"
  | "prefersDark"
  | "scrollbarWidth"

type ColorType = {
  color: string
  light: string
  dark: string
  cssVariable: string
}

export const COLOR_PALETTE: { [key in ColorPaletteType]: ColorType } = {
  colorText: {
    dark: "hsl(0deg, 0%, 100%)",
    cssVariable: "--color-text",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(222deg, 22%, 5%)",
  },
  colorBackground: {
    dark: "hsl(210deg, 30%, 8%)",
    cssVariable: "--color-background",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(0deg, 0%, 100%)",
  },
  colorBlurredBackground: {
    dark: "hsla(210deg, 30%, 8%, 0.85)",
    cssVariable: "--color-blurred-background",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsla(0deg, 0%, 100%, 0.85)",
  },
  colorPrimary: {
    dark: "hsl(333deg, 100%, 52%)",
    cssVariable: "--color-primary",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(245deg, 100%, 60%)",
  },
  colorSecondary: {
    dark: "hsl(230deg, 92%, 63%)",
    cssVariable: "--color-secondary",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(333deg, 100%, 45%)",
  },
  colorTertiary: {
    dark: "hsl(53deg, 100%, 50%)",
    cssVariable: "--color-tertiary",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(255deg, 85%, 30%)",
  },
  colorDecorative: {
    dark: "hsl(200deg, 50%, 60%)",
    cssVariable: "--color-decorative",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(200deg, 75%, 65%)",
  },
  colorMuted: {
    dark: "hsl(210deg, 38%, 15%)",
    cssVariable: "--color-muted",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(210deg, 55%, 92%)",
  },
  colorMutedBackground: {
    dark: "hsla(210deg, 38%, 15%, 0.85)",
    cssVariable: "--color-muted-background",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsla(210deg, 55%, 92%, 0.85)",
  },
  colorInfo: {
    dark: "hsl(230deg, 92%, 63%)",
    cssVariable: "--color-info",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(245deg, 100%, 60%)",
  },
  colorSuccess: {
    dark: "hsl(160deg, 100%, 40%)",
    cssVariable: "--color-success",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(160deg, 100%, 40%)",
  },
  colorSuccessBackground: {
    dark: "hsla(160deg, 100%, 40%, 0.1)",
    cssVariable: "--color-success-background",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsla(160deg, 100%, 40%, 0.1)",
  },
  colorError: {
    dark: "hsl(340deg, 95%, 60%)",
    cssVariable: "--color-error",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(340deg, 95%, 50%)",
  },
  colorErrorBackground: {
    dark: "hsla(340deg, 95%, 43%, 0.1)",
    cssVariable: "--color-error-background",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsla(340deg, 95%, 43%, 0.1)",
  },
  colorAlert: {
    dark: "hsl(30deg, 100%, 50%)",
    cssVariable: "--color-alert",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(37deg, 100%, 50%)",
  },
  colorAlertBackground: {
    dark: "hsla(38deg, 100%, 50%, 0.1)",
    cssVariable: "--color-alert-background",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsla(52deg, 100%, 50%, 0.25)",
  },
  colorVenn0: {
    dark: "hsl(250deg, 100%, 50%)",
    cssVariable: "--color-venn-0",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(190deg, 100%, 65%)",
  },
  colorVenn1: {
    dark: "hsl(175deg, 100%, 50%)",
    cssVariable: "--color-venn-1",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(340deg, 100%, 65%)",
  },
  colorGray100: {
    dark: "hsl(210deg, 15%, 20%)",
    cssVariable: "--color-gray-100",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 25%, 95%)",
  },
  colorGray200: {
    dark: "hsl(210deg, 15%, 25%)",
    cssVariable: "--color-gray-200",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 16%, 90%)",
  },
  colorGray300: {
    dark: "hsl(210deg, 10%, 40%)",
    cssVariable: "--color-gray-300",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 8%, 80%)",
  },
  colorGray400: {
    dark: "hsl(210deg, 9%, 45%)",
    cssVariable: "--color-gray-400",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 8%, 70%)",
  },
  colorGray500: {
    dark: "hsl(210deg, 8%, 50%)",
    cssVariable: "--color-gray-500",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 7%, 60%)",
  },
  colorGray600: {
    dark: "hsl(210deg, 12%, 55%)",
    cssVariable: "--color-gray-600",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 15%, 50%)",
  },
  colorGray700: {
    dark: "hsl(210deg, 14%, 66%)",
    cssVariable: "--color-gray-700",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 12%, 40%)",
  },
  colorGray900: {
    dark: "hsl(210deg, 25%, 88%)",
    cssVariable: "--color-gray-900",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 25%, 20%)",
  },
  colorGray1000: {
    dark: "hsl(210deg, 25%, 96%)",
    cssVariable: "--color-gray-1000",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 15%, 15%)",
  },
  colorSubtleBackground: {
    dark: "hsl(210deg, 30%, 8%)",
    cssVariable: "--color-subtle-background",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 25%, 95%)",
  },
  colorSubtleFloating: {
    dark: "hsl(210deg, 22%, 15%)",
    cssVariable: "--color-subtle-floating",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(0deg, 0%, 100%)",
  },
  colorHomepageLight: {
    dark: "hsla(200deg, 100%, 85%, 0)",
    cssVariable: "--color-homepage-light",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(204deg, 67%, 85%)",
  },
  colorHomepageDark: {
    dark: "hsla(200deg, 100%, 85%, 0.1)",
    cssVariable: "--color-homepage-dark",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(202deg, 71%, 90%)",
  },
  colorHomepageBg: {
    dark: "hsl(210deg, 30%, 8%)",
    cssVariable: "--color-homepage-bg",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(204deg, 67%, 85%)",
  },
  syntaxBg: {
    dark: "hsl(210deg, 30%, 12%)",
    cssVariable: "--syntax-bg",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 25%, 97%)",
  },
  syntaxHighlight: {
    dark: "hsl(210deg, 30%, 18%)",
    cssVariable: "--syntax-highlight",
    get color(): string {
      return getColor.call(this)
    },
    light: "hsl(225deg, 25%, 93%)",
  },
  syntaxTxt: {
    dark: "#FFF",
    cssVariable: "--syntax-txt",
    get color(): string {
      return getColor.call(this)
    },
    light: "#2A2A2A",
  },
  syntaxComment: {
    dark: "#6c8998",
    cssVariable: "--syntax-comment",
    get color(): string {
      return getColor.call(this)
    },
    light: "#467790",
  },
  syntaxProp: {
    dark: "#FF39A8",
    cssVariable: "--syntax-prop",
    get color(): string {
      return getColor.call(this)
    },
    light: "#da0079",
  },
  syntaxBool: {
    dark: "#FFD600",
    cssVariable: "--syntax-bool",
    get color(): string {
      return getColor.call(this)
    },
    light: "#bf00b8",
  },
  syntaxVal: {
    dark: "#61747D",
    cssVariable: "--syntax-val",
    get color(): string {
      return getColor.call(this)
    },
    light: "#78909C",
  },
  syntaxStr: {
    dark: "rgb(155, 109, 255)",
    cssVariable: "--syntax-str",
    get color(): string {
      return getColor.call(this)
    },
    light: "#651fff",
  },
  syntaxName: {
    dark: "#C653FF",
    cssVariable: "--syntax-name",
    get color(): string {
      return getColor.call(this)
    },
    light: "#AA00FF",
  },
  syntaxDel: {
    dark: "#FF5555",
    cssVariable: "--syntax-del",
    get color(): string {
      return getColor.call(this)
    },
    light: "rgb(255, 85, 85)",
  },
  syntaxRegex: {
    dark: "#ffd700",
    cssVariable: "--syntax-regex",
    get color(): string {
      return getColor.call(this)
    },
    light: "#3600d6",
  },
  syntaxFn: {
    dark: "rgb(0, 190, 255)",
    cssVariable: "--syntax-fn",
    get color(): string {
      return getColor.call(this)
    },
    light: "#3D5AFE",
  },
  prefersDark: {
    dark: "true",
    cssVariable: "--prefers-dark",
    get color(): string {
      return getColor.call(this)
    },
    light: "false",
  },
  scrollbarWidth: {
    dark: "12px;",
    cssVariable: "--scrollbar-width",
    get color(): string {
      return getColor.call(this)
    },
    light: "12px;",
  },
}
