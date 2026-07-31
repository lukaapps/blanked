"use client";

import { useRouter } from "next/navigation";

export function BackButton({
  fallbackHref,
  ariaLabel,
  className,
}: {
  fallbackHref: string;
  ariaLabel: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className={className}
    >
      ←
    </button>
  );
}
