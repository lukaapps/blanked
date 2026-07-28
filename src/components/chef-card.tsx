import Image from "next/image";
import Link from "next/link";
import type { Chef } from "@/lib/types";

export function ChefCard({ chef, large = false }: { chef: Chef; large?: boolean }) {
  return (
    <Link href={`/talent/${chef.slug}`} className="group block">
      <div
        className={`relative w-full overflow-hidden bg-divider ${
          large ? "aspect-[3/4]" : "aspect-square"
        }`}
      >
        <Image
          src={chef.portrait}
          alt={chef.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-base font-semibold">{chef.name}</h3>
        <p className="text-sm text-accent">{chef.role}</p>
        {large && (
          <p className="mt-3 border-l-2 border-accent pl-3 text-sm italic text-ink/70">
            &ldquo;{chef.quote}&rdquo;
          </p>
        )}
      </div>
    </Link>
  );
}
