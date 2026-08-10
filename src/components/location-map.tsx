"use client";

import dynamic from "next/dynamic";

const LocationMapInner = dynamic(() => import("./location-map-inner"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-divider" />,
});

export function LocationMap({
  suburb,
  seed,
}: {
  suburb: string;
  seed: string;
}) {
  return <LocationMapInner suburb={suburb} seed={seed} />;
}
