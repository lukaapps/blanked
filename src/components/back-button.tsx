"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function BackButton({
  fallbackHref,
  ariaLabel,
  className,
  children,
}: {
  fallbackHref: string;
  ariaLabel: string;
  className?: string;
  children?: ReactNode;
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
      {children ?? "←"}
    </button>
  );
}
