export default function Mark({ size = 18, color = "var(--accent)" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="1" opacity="0.4" />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1" opacity="0.7" />
      <circle cx="12" cy="12" r="2.25" fill={color} />
    </svg>
  );
}
