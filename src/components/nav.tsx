"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const centerLinks: { href: string; label: string; external?: boolean }[] = [
  { href: "/browse-spaces", label: "Browse Spaces" },
  { href: "/list-a-space", label: "List a Space" },
  { href: "/about", label: "About" },
  {
    href: "https://www.instagram.com/by.blanked/",
    label: "Instagram",
    external: true,
  },
  { href: "/chefs", label: "Blanked Chefs" },
];

export function Nav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Home renders its own nav grid inside the fullscreen hero — no top bar there.
  if (pathname === "/") return null;

  const isActive = (href: string) => pathname.startsWith(href);
  const linkClass = (active: boolean) =>
    `whitespace-nowrap text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-colors hover:text-accent ${
      active ? "text-accent" : "text-ink/70"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-white">
      <div className="flex items-center py-4 pl-2 pr-4 sm:pr-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo-blanked.jpg?v=3"
            alt="Blanked"
            width={1107}
            height={184}
            priority
            className="h-5 w-auto sm:h-6"
          />
        </Link>

        <nav className="ml-12 flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-8">
          {centerLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={linkClass(isActive(link.href))}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="ml-3 grid shrink-0 flex-1 grid-cols-[1fr_auto] items-center gap-x-4">
          <Link
            href="/events"
            className={`justify-self-center ${linkClass(isActive("/events"))}`}
          >
            Events
          </Link>
          <Link
            href={loggedIn ? "/profile" : "/login"}
            className={`shrink-0 justify-self-end ${linkClass(
              isActive(loggedIn ? "/profile" : "/login")
            )}`}
          >
            {loggedIn ? "My Profile" : "Log In"}
          </Link>
        </div>
      </div>
    </header>
  );
}
