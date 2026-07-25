"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Variant = "dark" | "light";

const centerLinks: { href: string; label: string; external?: boolean }[][] = [
  [
    { href: "/browse-spaces", label: "Browse Spaces" },
    { href: "/list-a-space", label: "List a Space" },
  ],
  [
    { href: "/chefs", label: "Blanked Chefs" },
    { href: "/about", label: "About" },
    {
      href: "https://www.instagram.com/by.blanked/",
      label: "Instagram",
      external: true,
    },
  ],
  [
    { href: "/by-blanked", label: "by.Blanked" },
    { href: "/login", label: "Log In" },
  ],
];

export function NavGrid({
  variant,
  onNavigate,
}: {
  variant: Variant;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const border =
    variant === "dark" ? "border-[#F0F0EE]/70" : "border-divider";
  const text = variant === "dark" ? "text-[#F0F0EE]" : "text-ink";
  const bg =
    variant === "dark" ? "bg-zinc-500/20 backdrop-blur-[2px]" : "bg-white";

  const cell = `flex items-center justify-center whitespace-nowrap px-2 py-3 sm:px-4 text-[8px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-center transition-colors hover:text-accent`;
  const isActive = (href: string) =>
    href !== "/" && pathname.startsWith(href);

  return (
    <div className={`flex ${bg} ${text} border ${border}`}>
      <Link
        href="/"
        onClick={onNavigate}
        className={`${cell} shrink-0 border-r ${border}`}
      >
        Blanked<span className="text-accent">.</span>
      </Link>

      <div className="flex flex-1 flex-col">
        {centerLinks.map((row, i) => (
          <div
            key={i}
            className={`flex flex-1 ${i > 0 ? `border-t ${border}` : ""}`}
          >
            {row.map((link, j) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onNavigate}
                  className={`${cell} flex-1 ${
                    j > 0 ? `border-l ${border}` : ""
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onNavigate}
                  className={`${cell} flex-1 ${
                    j > 0 ? `border-l ${border}` : ""
                  } ${isActive(link.href) ? "text-accent" : ""}`}
                >
                  {link.href === "/by-blanked" ? (
                    <>
                      by<span className="text-accent">.</span>Blanked
                      <span className="text-accent">.</span>
                    </>
                  ) : link.href === "/chefs" ? (
                    <>
                      Blanked<span className="text-accent">.</span> Chefs
                    </>
                  ) : (
                    link.label
                  )}
                </Link>
              )
            )}
          </div>
        ))}
      </div>

      <Link
        href="/events"
        onClick={onNavigate}
        className={`${cell} shrink-0 border-l ${border} ${
          isActive("/events") ? "text-accent" : ""
        }`}
      >
        Events
      </Link>
    </div>
  );
}
