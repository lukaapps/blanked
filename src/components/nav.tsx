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
  { href: "/talent", label: "Talent" },
  { href: "/events", label: "Events" },
];

export function Nav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  // Home renders its own nav grid inside the fullscreen hero — no top bar there.
  if (pathname === "/") return null;

  const isActive = (href: string) => pathname.startsWith(href);
  const linkClass = (active: boolean) =>
    `whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-accent ${
      active ? "text-accent" : "text-ink/70"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-divider bg-white">
        <div className="flex items-center justify-between py-4 pl-2 pr-4 sm:pr-6">
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

          <nav className="ml-12 hidden flex-1 items-center gap-x-8 lg:flex">
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
            <Link
              href="/by-blanked"
              className={`whitespace-nowrap text-[11px] font-semibold tracking-[0.2em] transition-colors hover:text-accent ${
                isActive("/by-blanked") ? "text-accent" : "text-ink/70"
              }`}
            >
              by<span className="text-accent">.</span>BLANKED
              <span className="text-accent">.</span>
            </Link>

            <Link
              href={loggedIn ? "/profile" : "/login"}
              className={`ml-auto shrink-0 ${linkClass(
                isActive(loggedIn ? "/profile" : "/login")
              )}`}
            >
              {loggedIn ? "My Profile" : "Log In"}
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center text-ink lg:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-divider py-4 pl-6 pr-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 items-center justify-center text-ink"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
            {centerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-divider py-4 text-sm font-semibold uppercase tracking-[0.15em] text-ink/70 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`border-b border-divider py-4 text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:text-accent ${
                    isActive(link.href) ? "text-accent" : "text-ink/70"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/by-blanked"
              className={`border-b border-divider py-4 text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:text-accent ${
                isActive("/by-blanked") ? "text-accent" : "text-ink/70"
              }`}
            >
              by<span className="text-accent">.</span>BLANKED
              <span className="text-accent">.</span>
            </Link>

            <Link
              href={loggedIn ? "/profile" : "/login"}
              className="mt-6 bg-[#442220] py-4 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90"
            >
              {loggedIn ? "My Profile" : "Log In"}
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
