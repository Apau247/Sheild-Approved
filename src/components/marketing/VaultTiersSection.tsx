"use client";

import { useState } from "react";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import { STORAGE_TIERS } from "@/lib/mockData";
import { CheckCircle2 } from "lucide-react";

export default function VaultTiersSection() {
  const [activeId, setActiveId] = useState(STORAGE_TIERS.find((t) => t.popular)?.id ?? STORAGE_TIERS[0]?.id);

  const active = STORAGE_TIERS.find((t) => t.id === activeId) ?? STORAGE_TIERS[0];

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="label-gold">Vault Sizes</div>
          <h2 className="section-heading mt-2">
            Choose your tier, keep <span className="text-gradient-gold">perfect control</span>
          </h2>
          <p className="section-subheading mt-4">
            Storage designed for discretion—biometric access, custody documentation, and premium response posture.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:w-[420px]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-white/70">Selected tier</div>
              <div className="mt-1 text-lg font-semibold">{active?.label}</div>
              <div className="mt-1 text-xs text-white/55">
                {active?.size}
                {active?.period ? ` · ${active.period}` : ""}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/55">From</div>
              <div className="text-2xl font-semibold text-vault-gold">{active?.price}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="grid gap-3">
            {STORAGE_TIERS.map((t) => (
              <ScrollReveal key={t.id} delayMs={t.popular ? 0 : 40}>
                <button
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  className={[
                    "w-full text-left rounded-2xl border p-4 transition-all",
                    t.id === activeId
                      ? "border-gold-500/50 bg-gold-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/7",
                  ].join(" ")}
                  aria-pressed={t.id === activeId}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{t.label}</div>
                      <div className="mt-1 text-xs text-white/60">{t.description}</div>
                      <div className="mt-2 text-xs text-white/55">{t.size}</div>
                    </div>
                    {t.popular && (
                      <span className="inline-flex items-center rounded-full border border-vault-gold/30 bg-vault-gold/10 px-3 py-1 text-[11px] font-semibold text-vault-gold">
                        Most selected
                      </span>
                    )}
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-vault-950/30 p-6 backdrop-blur">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_10%_0%,rgba(212,175,55,0.22)_0%,rgba(10,10,10,0)_55%),radial-gradient(60%_40%_at_90%_20%,rgba(239,68,68,0.12)_0%,rgba(10,10,10,0)_60%)]" />
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="label-gold">Tier details</div>
                  <div className="mt-2 text-2xl font-semibold">{active?.label}</div>
                  <div className="mt-1 text-sm text-white/70">
                    {active?.size}
                    {active?.period ? ` · ${active.period}` : ""}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                  <div className="text-xs text-white/60">Pricing</div>
                  <div className="mt-1 text-2xl font-semibold text-vault-gold">{active?.price}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(active?.features ?? []).slice(0, 8).map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-white/75">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-vault-gold" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-white/70">
                    Need a custom protocol for institutional holdings?
                  </div>
                  <a
                    href="/request-access"
                    className="btn-gold sm:w-auto w-full justify-center"
                  >
                    Enquire Now
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
