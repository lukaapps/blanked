import type { Review } from "@/lib/types";

export function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  return (
    Math.round(
      (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
    ) / 10
  );
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#111111" : "none"}
      stroke="#111111"
      strokeWidth="1.5"
    >
      <path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3z" />
    </svg>
  );
}

export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= Math.round(value)} size={size} />
      ))}
    </span>
  );
}

export function RatingBadge({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const avg = averageRating(reviews);
  return (
    <span className="inline-flex items-center gap-1">
      <Star filled size={12} />
      <span className="font-semibold text-ink">{avg.toFixed(1)}</span>
      <span className="text-ink/40">({reviews.length})</span>
    </span>
  );
}
