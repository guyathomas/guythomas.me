import { MOBILE_MEDIA_QUERY } from "typography-breakpoint-constants"
import { COLOR_PALETTE } from "~constants"
const theme = {
  title: "guythomas.me",
  baseFontSize: "16px",
  baseLineHeight: 1.75,
  scaleRatio: 5 / 2,
  googleFonts: [
    {
      name: "Open Sans",
      styles: ["700"],
    },
    {
      name: "Work Sans",
      styles: ["400", "400i", "700", "700i", "900", "900i"],
    },
  ],
  headerFontFamily: ["Work Sans", "serif"],
  bodyFontFamily: ["Work Sans", "serif"],
  bodyColor: COLOR_PALETTE.primary.color,
  headerWeight: 300,
  bodyWeight: 400,
  boldWeight: 700,
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
    h1: {
      fontFamily: ["Open Sans", "sans-serif"].join(","),
    },
    blockquote: {
      ...scale(1 / 5),
      color: COLOR_PALETTE.secondary.color,
      fontStyle: "italic",
      paddingLeft: rhythm(13 / 16),
      marginLeft: rhythm(-1),
      borderLeft: `${rhythm(3 / 16)} solid ${COLOR_PALETTE.strokePrimary}`
        .color,
    },
    "blockquote > :last-child": {
      marginBottom: 0,
    },
    "blockquote cite": {
      ...adjustFontSizeTo(options.baseFontSize),
      color: options.bodyColor,
      fontWeight: options.bodyWeight,
    },
    "blockquote cite:before": {
      content: '"— "',
    },
    ul: {
      listStyle: "disc",
    },
    "ul,ol": {
      marginLeft: 0,
      listStylePosition: "inside",
    },
    [MOBILE_MEDIA_QUERY]: {
      "ul,ol": {
        marginLeft: rhythm(1),
      },
      blockquote: {
        marginLeft: rhythm(-3 / 4),
        marginRight: 0,
        paddingLeft: rhythm(9 / 16),
      },
    },
    "h1,h2,h3,h4,h5,h6": {
      marginTop: rhythm(2),
      lineHeight: "initial",
    },
    h4: {
      letterSpacing: "0.140625em",
      textTransform: "uppercase",
    },
    h6: {
      fontStyle: "italic",
    },
    a: {
      color: COLOR_PALETTE.interactive.color,
      textDecoration: "none",
    },
    "a:hover,a:active": {
      boxShadow: "none",
      color: COLOR_PALETTE.interactiveActive.color,
    },
    "mark,ins": {
      background: "#007acc",
      color: "white",
      padding: `${rhythm(1 / 16)} ${rhythm(1 / 8)}`,
      textDecoration: "none",
    },
  }),
}

export default theme
