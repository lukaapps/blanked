"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NavGrid } from "@/components/nav-grid";

type HeroImage = { src: string; crop?: string };

export function HomeHero({ images }: { images: HeroImage[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      {images.map(({ src, crop }, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover ${crop ?? "object-center"} transition-opacity duration-1000 ${
            i === index ? "opacity-60" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          <NavGrid variant="dark" />
        </div>
        <p className="mt-6 text-sm font-semibold tracking-[0.3em] text-[#F0F0EE]/80">
          Find your pop-up space in Melbourne
        </p>
      </div>
    </div>
  );
}
