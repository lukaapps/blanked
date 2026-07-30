export function RedDot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-2.5 w-2.5 rounded-full bg-accent ${className}`}
    />
  );
}

export function PageHeader({
  title,
  caption,
  action,
}: {
  title: string;
  caption: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          {caption}
        </p>
      </div>
      {action}
    </div>
  );
}
