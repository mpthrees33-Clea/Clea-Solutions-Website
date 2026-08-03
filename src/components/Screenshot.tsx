import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

/**
 * Case-study screenshot figure. Static imports give intrinsic sizing and the
 * blur-up placeholder for free; the frame matches the .panel idiom.
 */
export default function Screenshot({
  src,
  alt,
  caption,
  label,
  sizes = "(max-width: 720px) 100vw, 1120px",
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  caption?: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const imgStyle: CSSProperties = {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: "6px",
    border: "1px solid var(--rule)",
  };
  return (
    <figure className="panel" style={{ padding: "0.75rem", margin: 0 }}>
      {label && (
        <div className="eyebrow" style={{ margin: "0.35rem 0.35rem 0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="dot-mark" aria-hidden="true" />
          {label}
        </div>
      )}
      <Image src={src} alt={alt} placeholder="blur" sizes={sizes} priority={priority} style={imgStyle} />
      {caption && (
        <figcaption
          className="mono"
          style={{
            fontSize: "0.72rem",
            color: "var(--ink-muted)",
            padding: "0.85rem 0.35rem 0.35rem",
            letterSpacing: "0.02em",
            lineHeight: 1.55,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
