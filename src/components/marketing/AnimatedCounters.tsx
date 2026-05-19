"use client";

import { STATS } from "@/lib/mockData";
import AnimatedNumber from "@/components/marketing/AnimatedNumber";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import { ShieldCheck, Boxes, PackageSearch, Clock } from "lucide-react";

const counterMeta = [
  { icon: ShieldCheck, label: STATS[0]?.label ?? "Assets Secured", suffix: STATS[0]?.suffix ?? "+" },
  {
    icon: Boxes,
    label: STATS[1]?.label ?? "Private Vaults",
    suffix: STATS[1]?.suffix ?? "+",
  },
  {
    icon: PackageSearch,
    label: STATS[2]?.label ?? "Tracked Deliveries",
    suffix: STATS[2]?.suffix ?? "+",
  },
  {
    icon: Clock,
    label: STATS[3]?.label ?? "Years of Excellence",
    suffix: STATS[3]?.suffix ?? "+",
  },
];

function getTargets() {
  const assets = STATS[0]?.value ?? 2500;
  const vaults = STATS[1]?.value ?? 1200;
  const deliveries = STATS[2]?.value ?? 300;
  const years = STATS[3]?.value ?? 15;

  return [
    { target: assets, suffix: counterMeta[0].suffix, label: counterMeta[0].label },
    { target: vaults, suffix: counterMeta[1].suffix, label: counterMeta[1].label },
    { target: deliveries, suffix: counterMeta[2].suffix, label: counterMeta[2].label },
    { target: years, suffix: counterMeta[3].suffix, label: counterMeta[3].label },
  ];
}

export default function AnimatedCounters() {
  const targets = getTargets();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {targets.map((t, idx) => {
        const Icon = counterMeta[idx]?.icon ?? ShieldCheck;
        return (
          <ScrollReveal key={t.label} delayMs={idx * 90}>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_30%_0%,rgba(212,175,55,0.22)_0%,rgba(10,10,10,0)_60%)]" />
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-white/70">{t.label}</div>
                <Icon className="h-5 w-5 text-vault-gold" />
              </div>
              <div className="mt-3 text-4xl font-semibold tracking-tight">
                <AnimatedNumber target={t.target} />
                <span className="ml-1 text-vault-gold/90">{t.suffix}</span>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
