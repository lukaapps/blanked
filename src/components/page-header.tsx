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
        <h1 className="text-5xl font-bold uppercase tracking-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-3 text-sm font-semibold text-ink/40">
          {caption}
        </p>
      </div>
      {action}
    </div>
  );
}
