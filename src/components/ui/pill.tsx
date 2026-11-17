export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
      {children}
    </span>
  );
}

export function StatusTag({
  status,
}: {
  status: "Available" | "Selling Fast" | "Sold Out";
}) {
  const colors: Record<string, string> = {
    Available: "bg-white text-ink",
    "Selling Fast": "bg-accent text-white",
    "Sold Out": "bg-divider text-ink/60",
  };
  return (
    <span
      className={`inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${colors[status]}`}
    >
      {status}
    </span>
  );
}
