"use client";

import { useState, useSyncExternalStore } from "react";
import { DotSlot } from "@/components/brand-dot";

// For client-rendered pages (forms). The random pick happens after mount so
// server and client markup match. Place once, at the bottom of the page.
const subscribe = () => () => {};

export function ClientDotSlot() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!mounted) return null;
  return <ClientDotPick />;
}

function ClientDotPick() {
  const [chosen] = useState(() => Math.floor(Math.random() * 1));
  return <DotSlot at={0} chosen={chosen} />;
}
