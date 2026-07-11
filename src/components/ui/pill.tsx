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
    Available: "bg-green-700",
    "Selling Fast": "bg-amber-600",
    "Sold Out": "bg-zinc-500",
  };
  return (
    <span
      className={`inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white ${colors[status]}`}
    >
      {status}
    </span>
  );
}
