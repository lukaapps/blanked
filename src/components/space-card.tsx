"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Space } from "@/lib/types";
import { Pill } from "@/components/ui/pill";
import { RatingBadge } from "@/components/rating";

export function SpaceCard({ space }: { space: Space }) {
  const [saved, setSaved] = useState(false);

  return (
    <Link href={`/browse-spaces/${space.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider">
        <Image
          src={space.images[0]}
          alt={space.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Pill>{space.type}</Pill>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setSaved((v) => !v);
          }}
          aria-label="Save space"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-background/80"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={saved ? "#CA0000" : "none"}
            stroke={saved ? "#CA0000" : "#111111"}
            strokeWidth="1.5"
          >
            <path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.3 5 5.8 5c1.9 0 3.4 1 4.2 2.4C10.8 6 12.3 5 14.2 5c3.5 0 5.3 3.4 3.8 6.9C19.5 16.4 12 21 12 21z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium">{space.name}</h3>
          <p className="mt-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
            {space.suburb}
            <span className="text-ink/20">|</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            {space.capacity}
          </p>
          {space.reviews.length > 0 && (
            <p className="mt-1.5 text-xs">
              <RatingBadge reviews={space.reviews} />
            </p>
          )}
        </div>
      </div>
      <p className="mt-2 text-right text-2xl font-medium tracking-tight">
        ${space.dailyRate.toLocaleString()}
        <span className="text-sm font-normal text-ink/45">/day</span>
      </p>
    </Link>
  );
}
