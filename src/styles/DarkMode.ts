const DM_MEDIA_QUERY = "(prefers-color-scheme: dark)"

let DARK_MODE = false

export const DarkMode = {
  get mediaQuery(): MediaQueryList {
    return matchMedia(DM_MEDIA_QUERY)
  },

  get supported(): boolean {
    return this.mediaQuery.media === DM_MEDIA_QUERY
  },

  get enabled(): boolean {
    return DARK_MODE
  },

  set enable(val: boolean) {
    DARK_MODE = val
  },

  observe(callback: (darkMode: boolean) => void): void {
    this.mediaQuery.addListener((mql) => callback(mql.matches))
  },

  unobserve(callback: (darkMode: boolean) => void): void {
    this.mediaQuery.removeListener((mql) => callback(mql.matches))
  },
}
