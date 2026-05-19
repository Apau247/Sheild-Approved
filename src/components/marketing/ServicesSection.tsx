"use client";

import Image from "next/image";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import { SERVICES } from "@/lib/mockData";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function ServicesSection() {
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="label-gold">Services</div>
          <h2 className="section-heading mt-2">
            Protection engineered for <span className="text-gradient-gold">elite assets</span>
          </h2>
          <p className="section-subheading mt-4">
            Vaulting facilities, secure intake, transit custody, and concierge-grade asset protection—built for
            discretion, control, and continuity.
          </p>
        </div>

        <div className="hidden md:block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
            <Sparkles className="h-4 w-4 text-vault-gold" />
            Secure by design
          </div>
          <div className="mt-1 text-xs text-white/60">
            From biometric entry to custody documentation.
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, idx) => (
          <ScrollReveal key={s.id} delayMs={idx * 80}>
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <div className="relative h-44">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.1)_0%,rgba(10,10,10,0.92)_100%)]" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80">
                  <ShieldCheck className="h-3.5 w-3.5 text-vault-gold" />
                  Custody-grade
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.description}</p>

                <ul className="mt-4 space-y-2">
                  {s.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/75">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-vault-gold" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between">
                  <div className="text-xs text-white/55">Discreet intake &amp; monitored custody</div>
                  <div className="h-9 w-9 rounded-xl border border-white/10 bg-black/20 grid place-items-center transition-all group-hover:border-gold-500/40">
                    <span className="text-vault-gold text-sm font-semibold">→</span>
                  </div>
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
