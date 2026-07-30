"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { compressImage } from "@/services/image";
import { MAX_PHOTOS } from "@/constants";
import type { PhotoAsset } from "@/types";
import { useToast } from "@/components/ui/toast";

interface Props {
  photos: PhotoAsset[];
  onChange: (p: PhotoAsset[]) => void;
}

export function PhotoUpload({ photos, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      toast.warning(`Maximum ${MAX_PHOTOS} photos allowed.`);
      return;
    }
    setBusy(true);
    try {
      const picked = Array.from(files).slice(0, remaining);
      const compressed = await Promise.all(picked.map(compressImage));
      onChange([...photos, ...compressed]);
    } catch {
      toast.error("Could not process one or more images.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {photos.map((p) => (
          <div key={p.id} className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.dataUrl} alt={p.name} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(photos.filter((x) => x.id !== p.id))}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1"
              aria-label="Remove photo"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-brand hover:text-brand"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
            <span className="text-[10px]">Add</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-gray-400">Up to {MAX_PHOTOS} photos · auto-compressed</p>
    </div>
  );
}
