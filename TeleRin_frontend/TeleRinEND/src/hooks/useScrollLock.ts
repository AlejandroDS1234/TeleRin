import { useEffect } from "react";

export default function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const prevent = (e: Event) => {
      e.preventDefault();
    };

    const preventKey = (e: KeyboardEvent) => {
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Space", "Home", "End"];
      if (keys.includes(e.code)) e.preventDefault();
    };

    window.addEventListener("wheel", prevent, { passive: false } as any);
    window.addEventListener("touchmove", prevent, { passive: false } as any);
    window.addEventListener("keydown", preventKey as any, { passive: false } as any);

    return () => {
      window.removeEventListener("wheel", prevent as any);
      window.removeEventListener("touchmove", prevent as any);
      window.removeEventListener("keydown", preventKey as any);
    };
  }, [active]);
}
