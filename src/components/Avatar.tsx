"use client";

const FALLBACK_DATA =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%233f3f46' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2371717a' font-size='14'%3E?%3C/text%3E%3C/svg%3E";

export function Avatar({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const el = e.currentTarget;
        el.onerror = null;
        if (!el.src.startsWith("data:")) {
          el.src = FALLBACK_DATA;
        }
      }}
    />
  );
}
