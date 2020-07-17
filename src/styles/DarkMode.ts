const DM_MEDIA_QUERY = "(prefers-color-scheme: dark)"

let DARK_MODE: boolean = false

export const DarkMode = {
  get mediaQuery() {
    return matchMedia(DM_MEDIA_QUERY)
  },

  get supported() {
    return this.mediaQuery.media === DM_MEDIA_QUERY
  },

  get enabled() {
    // return true
    return DARK_MODE
  },

  set enable(val: boolean) {
    DARK_MODE = val
  },

  observe(callback: (darkMode: boolean) => void) {
    this.mediaQuery.addListener((mql) => callback(mql.matches))
  },

  unobserve(callback: (darkMode: boolean) => void) {
    this.mediaQuery.removeListener((mql) => callback(mql.matches))
  },
}
