const DM_MEDIA_QUERY = "(prefers-color-scheme: dark)";

type MQCallback = (event: MediaQueryListEvent) => void;
type DarkModeListener = (darkMode: boolean) => void;
type Unobserve = () => void;

class DarkMode {
  private get mediaQuery(): MediaQueryList | undefined {
    return global.matchMedia ? global.matchMedia(DM_MEDIA_QUERY) : undefined;
  }
  public get enabled(): boolean {
    if (typeof document === "undefined") {
      return !this.mediaQuery?.matches;
    }
    const classList = document.body.classList;
    if (!classList.contains("dark-mode") && !classList.contains("light-mode")) {
      return !this.mediaQuery?.matches;
    }
    return classList.contains("dark-mode");
  }

  public observe(callback: DarkModeListener): Unobserve {
    const changeListener: MQCallback = (event) => {
      callback(event.matches);
    };
    this.mediaQuery?.addEventListener("change", changeListener);
    return () => {
      this.mediaQuery?.removeEventListener("change", changeListener);
    };
  }
}

export const darkMode = new DarkMode();
