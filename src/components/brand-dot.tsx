// Standalone brand dot: 10px, brand red, one per page.
//
// It only ever sits in a grey gap between sections, never on a photo or text.
// Each page places a few <DotSlot> markers in its gaps and picks one at random
// with pickDotSlot(). Horizontally the dot is also random (see X_POSITIONS),
// unless a position is passed. It scrolls with the page content.
// Pages are statically rendered, so the spot is fixed per build unless the
// page is made dynamic.
const X_POSITIONS = [
  "left-[27px]",
  "left-1/4",
  "left-1/2",
  "left-3/4",
  "right-[27px]",
];

function randomIndex(count: number): number {
  return Math.floor(Math.random() * count);
}

export function pickDotSlot(count: number): number {
  return randomIndex(count);
}

export function DotSlot({
  at,
  chosen,
  position,
}: {
  at: number;
  chosen: number;
  position?: string;
}) {
  if (at !== chosen) return <div className="relative h-0" />;
  const x = position ?? X_POSITIONS[randomIndex(X_POSITIONS.length)];
  return (
    <div className="relative h-0">
      <span
        aria-hidden="true"
        className={`absolute top-10 block h-[10px] w-[10px] rounded-full bg-accent ${x}`}
      />
    </div>
  );
}
