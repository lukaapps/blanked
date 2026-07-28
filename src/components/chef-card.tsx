import Image from "next/image";
import Link from "next/link";
import type { Chef } from "@/lib/types";

export function ChefCard({ chef, large = false }: { chef: Chef; large?: boolean }) {
  if (large) {
    return (
      <Link href={`/talent/${chef.slug}`} className="group block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-divider">
          <Image
            src={chef.portrait}
            alt={chef.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-normal text-ink">{chef.name}</h3>
          <p className="text-xs font-normal text-ink/60">{chef.role}</p>
          <p className="mt-3 border-l-2 border-accent pl-3 text-sm italic text-ink/70">
            &ldquo;{chef.quote}&rdquo;
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/talent/${chef.slug}`} className="group block">
      <div className="h-64 overflow-hidden bg-divider sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={chef.portrait}
          alt={chef.name}
          className="h-full w-auto object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-normal text-ink">{chef.name}</h3>
        <p className="text-xs font-normal text-ink/60">{chef.role}</p>
      </div>
    </Link>
  );
}
