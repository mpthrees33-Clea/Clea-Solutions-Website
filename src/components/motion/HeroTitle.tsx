"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/** H1 with a staggered word reveal on load. Splitting waits for fonts so word
 *  boxes aren't measured against fallback metrics; reduced motion shows static text. */
export default function HeroTitle({
  children,
  className = "display display-xl",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let split: SplitText | undefined;
      document.fonts.ready.then(() => {
        if (!el.isConnected) return;
        split = SplitText.create(el, { type: "words", aria: "auto" });
        gsap.from(split.words, {
          yPercent: 60,
          autoAlpha: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: "power3.out",
        });
      });
      return () => split?.revert();
    });
  });

  return (
    <h1 ref={ref} id={id} className={className}>
      {children}
    </h1>
  );
}
