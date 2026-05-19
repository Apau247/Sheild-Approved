"use client";

import Image from "next/image";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import { TESTIMONIALS } from "@/lib/mockData";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="label-gold">Testimonials</div>
          <h2 className="section-heading mt-2">
            Discretion, performance, <span className="text-gradient-gold">confidence</span>
          </h2>
          <p className="section-subheading mt-4">
            Trusted by private clients and institutions who require a vault partner built for trust—at every step.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
            <Quote className="h-4 w-4 text-vault-gold" />
            Real-world client sentiments
          </div>
          <div className="mt-1 text-xs text-white/60">Mock testimonials from curated profiles</div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t, idx) => (
          <ScrollReveal key={t.id} delayMs={idx * 70}>
            <article className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:border-gold-500/35">
              <div className="flex items-start justify-between gap-4">
                <div className="text-xs text-vault-gold/90 font-semibold tracking-wide">
                  Verified custody
                </div>
                <div className="h-9 w-9 rounded-xl border border-white/10 bg-black/20 grid place-items-center">
                  <Quote className="h-4 w-4 text-vault-gold" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-white/75">{t.quote}</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-black/20">
                  <Image src={t.image} alt={`Testimonial from ${t.author}`} fill className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">{t.author}</div>
                  <div className="text-xs text-white/55">{t.role}</div>
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
