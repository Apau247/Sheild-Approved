import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/marketing/ScrollReveal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-noise" />
      <div className="absolute inset-0 -z-10">
        {/* Cinematic vault/london hero image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero1.avif"
            alt="Secure vault facility with London skyline"
            fill
            priority
            className="object-cover opacity-60"
          />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.55)_45%,rgba(10,10,10,0.85)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_10%_0%,rgba(212,175,55,0.20)_0%,rgba(10,10,10,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_90%_15%,rgba(239,68,68,0.10)_0%,rgba(10,10,10,0)_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-20 md:pb-20 md:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-white/80 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-vault-gold" />
                Biometric access · 24/7 monitoring · London-based custody
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={80}>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Luxury high-security vault storage for
                <span className="block text-gradient-gold mt-2">Gold, Diamonds &amp; Valuable Assets</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delayMs={140}>
              <p className="max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
                Iron Vault Security provides discreet, institutional-grade protection with biometric access control, armed response
                readiness, and custody-grade chain-of-verification.
              </p>
            </ScrollReveal>

            <ScrollReveal delayMs={200}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/request-access"
                  className="btn-gold"
                  aria-label="Book a Private Consultation"
                >
                  Book a Private Consultation
                </Link>
                <Link
                  href="/request-access"
                  className="btn-outline-gold"
                  aria-label="Enquire Now"
                >
                  Enquire Now
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-vault-gold" />
                  London · EC2
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-vault-gold" />
                  LBMA-aligned vaulting standards
                </span>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="lg:justify-self-end" delayMs={120}>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-vault-950/40 backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_0%,rgba(212,175,55,0.20)_0%,rgba(10,10,10,0)_50%)]" />
              <div className="relative p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="label-gold">Secure Intake</div>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Concierge custody, engineered to perform
                    </h2>
                  </div>
                  <div className="hidden sm:block h-12 w-12 rounded-xl border border-white/10 bg-white/5" />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { title: "Biometric Access", desc: "Multi-factor validation for every entry." },
                    { title: "Armed Response Readiness", desc: "Operational posture built for urgent escalation." },
                    { title: "Insurance & Documentation", desc: "Clear custody records with coverage support." },
                    { title: "London Facility", desc: "Discreet vault handling within the City." },
                  ].map((x) => (
                    <div
                      key={x.title}
                      className="rounded-xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="text-sm font-semibold text-white/90">{x.title}</div>
                      <div className="mt-1 text-xs text-white/60">{x.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-white/60">Discretion-first process</div>
                    <div className="text-sm font-semibold text-vault-gold">Verified on intake</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
