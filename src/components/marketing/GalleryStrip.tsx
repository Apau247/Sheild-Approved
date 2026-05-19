"use client";

import Image from "next/image";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import { GALLERY_IMAGES } from "@/lib/mockData";

export default function GalleryStrip() {
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="label-gold">Facility Gallery</div>
          <h2 className="section-heading mt-2">
            Luxury custody, <span className="text-gradient-gold">securely visual</span>
          </h2>
          <p className="section-subheading mt-4">
            High-end placeholders showcasing vault suites, access controls, and secure interiors.
          </p>
        </div>

        <div className="hidden md:block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <div className="text-sm font-semibold text-white/80">Discretion-first environments</div>
          <div className="mt-1 text-xs text-white/60">Cinematic lighting · Controlled access · Monitored custody</div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_IMAGES.slice(0, 6).map((img, idx) => (
          <ScrollReveal key={img.src} delayMs={idx * 60}>
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="relative h-56">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 384px"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.1)_0%,rgba(10,10,10,0.92)_100%)]" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="text-sm font-semibold text-white/90">{img.caption}</div>
                <div className="mt-1 inline-flex items-center gap-2 text-xs text-white/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-vault-gold" />
                  Verified facility imagery
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
