'use client';

import Image from 'next/image';
import { useState } from 'react';

const FALLBACK =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200';

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const photos = images.length > 0 ? images : [FALLBACK];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={photos[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
      </div>

      {photos.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {photos.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active ? 'border-brand-600' : 'border-transparent'
              }`}
            >
              <Image src={src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
