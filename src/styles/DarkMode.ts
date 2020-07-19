const DM_MEDIA_QUERY = "(prefers-color-scheme: dark)"

export const DarkMode = {
  get mediaQuery(): MediaQueryList {
    // eslint-disable-next-line
    // @ts-ignore
    return global.matchMedia ? global.matchMedia(DM_MEDIA_QUERY) : {}
  },

  get supported(): boolean {
    return this.mediaQuery.media === DM_MEDIA_QUERY
  },

  get enabled(): boolean {
    if (typeof document === "undefined") {
      return !this.mediaQuery.matches
    }
    const classList = document.body.classList || []
    if (!classList.contains("dark-mode") && !classList.contains("light-mode")) {
      return !this.mediaQuery.matches
    }
    return classList.contains("dark-mode")
  },

  observe(callback: (darkMode: boolean) => void): void {
    this.mediaQuery.addListener((mql) => callback(mql.matches))
  },

  unobserve(callback: (darkMode: boolean) => void): void {
    this.mediaQuery.removeListener((mql) => callback(mql.matches))
  },
}
