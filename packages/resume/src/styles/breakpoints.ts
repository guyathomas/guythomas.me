type BreakpointLabel = "xs" | "sm" | "md" | "lg" | "xl" | "max"

type Breakpoints = {
  [key in BreakpointLabel]: number
}

export const BREAKPOINTS: Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  max: 1440,
}
