"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Home is a single full-screen carousel, like the Base44 reference — no footer.
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-divider">
      <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div>
          <div className="text-xl font-bold uppercase tracking-wide">
            Blanked
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink/60">
            Melbourne&rsquo;s marketplace for short-term hospitality space.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink/50">
              Explore
            </span>
            <Link href="/browse-spaces" className="text-sm hover:text-accent">
              Browse Spaces
            </Link>
            <Link href="/events" className="text-sm hover:text-accent">
              Events
            </Link>
            <Link href="/chefs" className="text-sm hover:text-accent">
              Blanked Chefs
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink/50">
              Blanked
            </span>
            <Link href="/about" className="text-sm hover:text-accent">
              About
            </Link>
            <Link href="/list-a-space" className="text-sm hover:text-accent">
              List a Space
            </Link>
            <Link href="/profile" className="text-sm hover:text-accent">
              My Profile
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink/50">
              Connect
            </span>
            <a
              href="https://www.instagram.com/by.blanked/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-accent"
            >
              Instagram
            </a>
            <a href="mailto:hello@blanked.melbourne" className="text-sm hover:text-accent">
              hello@blanked.melbourne
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-divider px-6 py-6 text-center text-xs uppercase tracking-widest text-ink/40">
        © {new Date().getFullYear()} Blanked. All rights reserved.
      </div>
    </footer>
  );
}
