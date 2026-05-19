"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/marketing/ScrollReveal";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-14 md:py-18">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_70%_at_10%_10%,rgba(212,175,55,0.18)_0%,rgba(10,10,10,0)_55%),radial-gradient(60%_60%_at_90%_30%,rgba(239,68,68,0.10)_0%,rgba(10,10,10,0)_60%)]" />
      <div className="mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-vault-950/30 backdrop-blur p-6 md:p-10">
            <div className="absolute inset-0 -z-10 bg-noise opacity-40" />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                  <ShieldCheck className="h-4 w-4 text-vault-gold" />
                  Premium vault custody · London, UK
                </div>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  A private consultation for{" "}
                  <span className="text-gradient-gold block mt-2">serious assets</span>
                </h2>

                <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
                  Share your requirements discreetly. We’ll propose a secure intake plan and the right vault protocol for your tier.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/request-access" className="btn-gold">
                  <Sparkles className="h-4 w-4" />
                  Book a Private Consultation
                </Link>
                <Link href="/request-access" className="btn-outline-gold">
                  Enquire Now
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { k: "Discretion-first intake", v: "Verified & confidential" },
                { k: "Custody-grade documentation", v: "Chain-of-custody records" },
                { k: "Premium response posture", v: "Armed escalation readiness" },
              ].map((x) => (
                <div key={x.k} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white/85">{x.k}</div>
                  <div className="mt-1 text-xs text-white/60">{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
