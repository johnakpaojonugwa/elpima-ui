import { useEffect, useState } from "react";

const BREAKPOINT = 1124;

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() =>
    typeof window === "undefined" ? false : window.innerWidth <= BREAKPOINT,
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const collapsed = window.innerWidth <= BREAKPOINT;
      setIsCollapsed(collapsed);
      if (!collapsed) setIsMobileOpen(false);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { isCollapsed, isMobileOpen, setIsMobileOpen };
}

