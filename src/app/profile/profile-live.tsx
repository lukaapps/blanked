"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import type { BookingStatus } from "@/lib/database.types";

const sectionLabel =
  "text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40";

const statusColor = (status: string) =>
  ["confirmed", "accepted", "Live"].includes(status)
    ? "text-green-700"
    : ["pending", "Pending Review"].includes(status)
    ? "text-amber-600"
    : ["declined", "cancelled"].includes(status)
    ? "text-accent"
    : "text-ink/35";

export type ProfileData = {
  id: string;
  name: string;
  email: string;
  accountType: "chef" | "landlord" | "customer";
  photoUrl: string | null;
  visibleToLandlords: boolean;
};

export type ChefBooking = {
  id: string;
  spaceName: string;
  spaceSlug: string;
  dates: string;
  status: BookingStatus;
};

export type SavedSpace = {
  slug: string;
  name: string;
  suburb: string;
  image: string;
};

export type SavedEvent = {
  slug: string;
  name: string;
  suburb: string;
  date: string;
  image: string;
};

export type MyEvent = {
  slug: string;
  name: string;
  suburb: string;
  date: string;
  image: string;
  status: string;
};

export type LandlordSpace = {
  id: string;
  slug: string;
  name: string;
  status: string;
  dailyRate: number | null;
  requestCount: number;
};

export type LandlordRequest = {
  id: string;
  chefName: string;
  spaceName: string;
  dates: string;
  message: string;
  status: BookingStatus;
};

function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/35 transition-colors hover:text-accent"
    >
      Log out
    </button>
  );
}

function ProfileHeaderCard({
  profile,
}: {
  profile: ProfileData;
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-6 bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden bg-divider">
          {profile.photoUrl ? (
            <Image src={profile.photoUrl} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <span className="text-xl font-semibold text-ink/40">
              {profile.name.charAt(0) || "?"}
            </span>
          )}
        </div>
        <div>
          <p className="text-xl font-medium tracking-tight">{profile.name}</p>
          <span className="mt-1 inline-block bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
            {profile.accountType === "chef"
              ? "Talent / Brand"
              : profile.accountType === "landlord"
              ? "Landlord"
              : "Customer"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ButtonLink href="/profile/edit" variant="primary">
          Edit Profile
        </ButtonLink>
        <SignOutButton />
      </div>
    </div>
  );
}

const chefTabs = [
  { key: "bookings", label: "My Bookings" },
  { key: "spaces", label: "Saved Spaces" },
  { key: "events", label: "My Events" },
] as const;
type ChefTabKey = (typeof chefTabs)[number]["key"];

export function ChefProfileLive({
  profile,
  bookings,
  savedSpaces,
  myEvents,
}: {
  profile: ProfileData;
  bookings: ChefBooking[];
  savedSpaces: SavedSpace[];
  myEvents: MyEvent[];
}) {
  const [visible, setVisible] = useState(profile.visibleToLandlords);
  const [tab, setTab] = useState<ChefTabKey>("bookings");

  async function toggleVisibility() {
    const next = !visible;
    setVisible(next);
    await createClient()
      .from("profiles")
      .update({ visible_to_landlords: next })
      .eq("id", profile.id);
  }

  return (
    <div className="px-6 pb-24 pt-20">
      <PageHeader
        title="My Profile"
        caption="Manage your bookings and public profile"
      />
      <ProfileHeaderCard profile={profile} />

      <div className="mt-10 flex flex-wrap gap-2">
        {chefTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
              tab === t.key
                ? "bg-[#442220] text-white"
                : "bg-white text-ink/50 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "bookings" && (
        <div className="mt-8">
          {bookings.length === 0 ? (
            <p className="text-sm text-ink/50">
              No booking requests yet —{" "}
              <Link href="/browse-spaces" className="text-accent hover:underline">
                browse spaces
              </Link>{" "}
              to send your first one.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 bg-white px-6 py-5"
                >
                  <div>
                    <p className="font-medium">{b.spaceName}</p>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                      {b.dates}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${statusColor(b.status)}`}
                    >
                      {b.status}
                    </span>
                    <Link
                      href={`/browse-spaces/${b.spaceSlug}`}
                      className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "spaces" && (
        <div className="mt-8">
          {savedSpaces.length === 0 ? (
            <p className="text-sm text-ink/50">
              Nothing saved yet. Tap the heart on any space to keep it here.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {savedSpaces.map((space) => (
                <Link
                  key={space.slug}
                  href={`/browse-spaces/${space.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider">
                    {space.image && (
                      <Image
                        src={space.image}
                        alt={space.name}
                        fill
                        sizes="25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium">{space.name}</p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                    {space.suburb}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "events" && (
        <div className="mt-8">
          {myEvents.length === 0 ? (
            <p className="text-sm text-ink/50">
              No events linked to your profile yet. The Blanked team adds
              these once your event is confirmed.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {myEvents.map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider">
                    {event.image && (
                      <Image
                        src={event.image}
                        alt={event.name}
                        fill
                        sizes="25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium">{event.name}</p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                    {event.suburb} · {event.date}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-12 flex items-center justify-between bg-white p-6">
        <div>
          <p className="text-sm font-medium">
            Make my profile visible to landlords
          </p>
          <p className="mt-0.5 text-sm text-ink/50">
            Appears in the Blanked Talent directory when on.
          </p>
        </div>
        <button
          onClick={toggleVisibility}
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

export function LandlordProfileLive({
  profile,
  spaces,
  requests,
}: {
  profile: ProfileData;
  spaces: LandlordSpace[];
  requests: LandlordRequest[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function respond(id: string, status: "accepted" | "declined") {
    setBusy(id);
    await createClient()
      .from("booking_requests")
      .update({ status })
      .eq("id", id);
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-20">
      <PageHeader
        title="My Profile"
        caption="Manage your spaces and listings"
        action={
          <ButtonLink href="/list-a-space" variant="secondary">
            + List a Space
          </ButtonLink>
        }
      />
      <ProfileHeaderCard profile={profile} />

      <div className="mt-12">
        <p className={sectionLabel}>My spaces</p>
        {spaces.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">
            No spaces listed yet —{" "}
            <Link href="/list-a-space" className="text-accent hover:underline">
              list your first space
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-1">
            {spaces.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 bg-white px-6 py-5"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                    {s.dailyRate ? `$${s.dailyRate.toLocaleString()}/day · ` : ""}
                    {s.requestCount} request{s.requestCount === 1 ? "" : "s"}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${statusColor(
                    s.status === "pending" ? "Pending Review" : s.status
                  )}`}
                >
                  {s.status === "pending" ? "Pending Review" : s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <p className={sectionLabel}>Booking requests</p>
        {requests.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">
            No incoming requests yet. We&rsquo;ll email you when hospitality
            talent wants your space.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-1">
            {requests.map((r) => (
              <div key={r.id} className="bg-white px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">
                    {r.chefName}{" "}
                    <span className="font-normal text-ink/45">
                      → {r.spaceName}
                    </span>
                  </p>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${statusColor(r.status)}`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                  {r.dates}
                </p>
                {r.message && (
                  <p className="mt-2 text-sm text-ink/60">
                    &ldquo;{r.message}&rdquo;
                  </p>
                )}
                {r.status === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="secondary"
                      className="px-5 py-2.5"
                      disabled={busy === r.id}
                      onClick={() => respond(r.id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="primary"
                      className="px-5 py-2.5"
                      disabled={busy === r.id}
                      onClick={() => respond(r.id, "declined")}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CustomerProfileLive({
  profile,
  savedEvents,
}: {
  profile: ProfileData;
  savedEvents: SavedEvent[];
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-20">
      <PageHeader
        title="My Profile"
        caption="Manage your saved events"
        action={
          <ButtonLink href="/events" variant="secondary">
            Browse Events
          </ButtonLink>
        }
      />
      <ProfileHeaderCard profile={profile} />

      <div className="mt-12">
        <p className={sectionLabel}>Saved events</p>
        {savedEvents.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">
            Nothing saved yet. Tap the heart on any event to keep it here.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {savedEvents.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider">
                  {event.image && (
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium">{event.name}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                  {event.suburb} · {event.date}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
