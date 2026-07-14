"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type RevealSectionProps = {
  children: ReactNode;
  /** Optional selector for staggered child targets; defaults to the wrapper itself. */
  targets?: string;
  y?: number;
  delay?: number;
  stagger?: number;
  className?: string;
  style?: CSSProperties;
};

/** Client wrapper that fades + slides its (server-rendered) children up on scroll enter.
 *  Content stays fully visible in server HTML — gsap.from() hides it only after
 *  hydration, so there is no flash of invisible content and no layout shift. */
export default function RevealSection({
  children,
  targets,
  y = 24,
  delay = 0,
  stagger = 0.1,
  className,
  style,
}: RevealSectionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = scope.current;
        if (!el) return;
        gsap.from(targets ? el.querySelectorAll(targets) : el, {
          autoAlpha: 0,
          y,
          duration: 0.7,
          delay,
          ease: "power2.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className} style={style}>
      {children}
    </div>
  );
}
