"use client";

import Image from "next/image";
import Link from "next/link";
import type { Space } from "@/lib/types";
import { RatingBadge } from "@/components/rating";

export function SpaceCard({ space }: { space: Space }) {
  return (
    <Link href={`/browse-spaces/${space.slug}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden bg-divider">
        <Image
          src={space.images[0]}
          alt={space.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
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
      <p className="mt-2 text-right text-2xl font-light tracking-tight">
        ${space.dailyRate.toLocaleString()}
        <span className="text-sm font-normal text-ink/45">/day</span>
      </p>
    </Link>
  );
}
