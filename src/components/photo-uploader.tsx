"use client";

import { useRef, useState } from "react";

const MAX_PHOTOS = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function PhotoUploader({
  photos,
  onChange,
  uploadFile,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
  uploadFile: (file: File) => Promise<string>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList) {
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) return;
    const files = Array.from(fileList).slice(0, remaining);
    setError(null);
    setBusy(true);
    const uploaded: string[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        setError("Photos must be under 5MB.");
        continue;
      }
      try {
        uploaded.push(await uploadFile(file));
      } catch {
        setError("One or more photos failed to upload.");
      }
    }
    if (uploaded.length) onChange([...photos, ...uploaded]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {photos.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="group relative aspect-square overflow-hidden bg-divider"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(photos.filter((_, idx) => idx !== i))}
              aria-label="Remove photo"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-ink/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex aspect-square flex-col items-center justify-center gap-1 border border-dashed border-divider text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/40 transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
          >
            {busy ? "…" : "+ Add"}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <p className="mt-2 text-[11px] text-ink/40">
        {photos.length}/{MAX_PHOTOS} photos
      </p>
      {error && <p className="mt-1 text-[11px] text-accent">{error}</p>}
    </div>
  );
}
