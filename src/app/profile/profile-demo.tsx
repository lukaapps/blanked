"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { spaces, chefs } from "@/lib/mock-data";

type AccountType = "chef" | "landlord";

const mockChef = {
  name: "Mia Thornton",
  photo: chefs[0].portrait,
  bookings: [
    { space: "The Loft at Flinders Lane", dates: "12–13 Aug 2026", status: "Confirmed" },
    { space: "Smith Street Kitchen", dates: "2 Sep 2026", status: "Pending" },
    { space: "Gertrude Street Bistro", dates: "18–24 Jul 2026", status: "Completed" },
  ],
  savedSlugs: [spaces[1].slug, spaces[4].slug],
};

const mockLandlord = {
  name: "Richmond Rooftop Pty Ltd",
  photo: spaces[5].images[0],
  mySpaces: [
    { name: "Richmond Rooftop", status: "Live", requests: 4, dailyRate: 2500 },
    { name: "St Kilda Beach House", status: "Pending Review", requests: 0, dailyRate: 1200 },
  ],
  requests: [
    { chef: "Mia Thornton", space: "Richmond Rooftop", dates: "26 Jul 2026", message: "Launching a two-week residency — keen to lock in the date.", status: "Pending" },
    { chef: "Jordan Reyes", space: "Richmond Rooftop", dates: "9 Aug 2026", message: "Late-night noodle pop-up, low-key setup.", status: "Accepted" },
  ],
};

const sectionLabel =
  "text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40";

export function ProfileDemo() {
  const [accountType, setAccountType] = useState<AccountType>("chef");
  const [visible, setVisible] = useState(true);

  const savedSpaces = spaces.filter((s) => mockChef.savedSlugs.includes(s.slug));

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-20">
      <PageHeader
        title="My Profile"
        caption={
          accountType === "chef"
            ? "Manage your bookings and public profile"
            : "Manage your spaces and listings"
        }
        action={
          accountType === "landlord" ? (
            <ButtonLink href="/list-a-space" variant="secondary">
              + List a Space
            </ButtonLink>
          ) : undefined
        }
      />

      <div className="mt-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/35">
        <span>Demo view:</span>
        <button
          onClick={() => setAccountType("chef")}
          className={accountType === "chef" ? "text-accent" : "hover:text-ink"}
        >
          Chef
        </button>
        <span>/</span>
        <button
          onClick={() => setAccountType("landlord")}
          className={accountType === "landlord" ? "text-accent" : "hover:text-ink"}
        >
          Landlord
        </button>
      </div>

      {accountType === "chef" ? (
        <ChefView
          visible={visible}
          setVisible={setVisible}
          savedSpaces={savedSpaces}
        />
      ) : (
        <LandlordView />
      )}
    </div>
  );
}

function ChefView({
  visible,
  setVisible,
  savedSpaces,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
  savedSpaces: typeof spaces;
}) {
  return (
    <div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden bg-divider">
            <Image src={mockChef.photo} alt="" fill sizes="64px" className="object-cover" />
          </div>
          <div>
            <p className="text-xl font-medium tracking-tight">{mockChef.name}</p>
            <span className="mt-1 inline-block bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
              Chef
            </span>
          </div>
        </div>
        <Button variant="primary">Edit Profile</Button>
      </div>

      <div className="mt-12">
        <p className={sectionLabel}>My bookings</p>
        <div className="mt-4 flex flex-col gap-1">
          {mockChef.bookings.map((b) => (
            <div
              key={b.space}
              className="flex items-center justify-between bg-white px-6 py-5"
            >
              <div>
                <p className="font-medium">{b.space}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                  {b.dates}
                </p>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                  b.status === "Confirmed"
                    ? "text-green-700"
                    : b.status === "Pending"
                    ? "text-amber-600"
                    : "text-ink/35"
                }`}
              >
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <p className={sectionLabel}>Saved spaces</p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {savedSpaces.map((space) => (
            <Link key={space.slug} href={`/browse-spaces/${space.slug}`} className="group block">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider">
                <Image
                  src={space.images[0]}
                  alt={space.name}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-sm font-medium">{space.name}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                {space.suburb}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between bg-white p-6">
        <div>
          <p className="text-sm font-medium">Make my profile visible to landlords</p>
          <p className="mt-0.5 text-sm text-ink/50">
            Appears in the Blanked Chefs directory when on.
          </p>
        </div>
        <button
          onClick={() => setVisible(!visible)}
          className={`h-7 w-12 shrink-0 border border-ink transition-colors ${
            visible ? "bg-ink" : "bg-transparent"
          }`}
          aria-label="Toggle profile visibility"
        >
          <span
            className={`block h-5 w-5 bg-background transition-transform ${
              visible ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function LandlordView() {
  return (
    <div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden bg-divider">
            <Image src={mockLandlord.photo} alt="" fill sizes="64px" className="object-cover" />
          </div>
          <div>
            <p className="text-xl font-medium tracking-tight">{mockLandlord.name}</p>
            <span className="mt-1 inline-block bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
              Landlord
            </span>
          </div>
        </div>
        <Button variant="primary">Edit Profile</Button>
      </div>

      <div className="mt-12">
        <p className={sectionLabel}>My spaces</p>
        <div className="mt-4 flex flex-col gap-1">
          {mockLandlord.mySpaces.map((s) => (
            <div
              key={s.name}
              className="flex flex-wrap items-center justify-between gap-2 bg-white px-6 py-5"
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                  ${s.dailyRate.toLocaleString()}/day · {s.requests} requests
                </p>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                  s.status === "Live" ? "text-green-700" : "text-amber-600"
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <p className={sectionLabel}>Booking requests</p>
        <div className="mt-4 flex flex-col gap-1">
          {mockLandlord.requests.map((r) => (
            <div key={r.chef + r.dates} className="bg-white px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  {r.chef} <span className="font-normal text-ink/45">→ {r.space}</span>
                </p>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    r.status === "Accepted" ? "text-green-700" : "text-amber-600"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                {r.dates}
              </p>
              <p className="mt-2 text-sm text-ink/60">&ldquo;{r.message}&rdquo;</p>
              {r.status === "Pending" && (
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" className="px-5 py-2.5">Accept</Button>
                  <Button variant="primary" className="px-5 py-2.5">Decline</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
