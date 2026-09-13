"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : ["/products/img-000.jpg"];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-marble-100 shadow-pedestal">
        <Image
          src={safeImages[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {safeImages.length > 1 && (
        <div className="mt-4 flex gap-3">
          {safeImages.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                i === active ? "border-gold-500" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
