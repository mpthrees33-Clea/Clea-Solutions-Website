"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Re-measures ScrollTrigger positions once web fonts finish loading,
 *  so trigger points aren't computed against fallback-font metrics. */
export default function ScrollSetup() {
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
