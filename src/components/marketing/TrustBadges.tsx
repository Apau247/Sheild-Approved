import {
  ShieldCheck,
  Fingerprint,
  Siren,
  BadgeCheck,
  FileText,
} from "lucide-react";
import ScrollReveal from "@/components/marketing/ScrollReveal";

const badges = [
  {
    icon: Fingerprint,
    title: "Biometric Access",
    desc: "Verified entry with multi-factor validation.",
  },
  {
    icon: Siren,
    title: "Armed Response Ready",
    desc: "Escalation posture built for rapid intervention.",
  },
  {
    icon: FileText,
    title: "Insurance & Documentation",
    desc: "Custody-grade records with coverage support.",
  },
  {
    icon: BadgeCheck,
    title: "LBMA-aligned Vaulting",
    desc: "Standards for construction & chain-of-custody.",
  },
  {
    icon: ShieldCheck,
    title: "24/7 Monitoring",
    desc: "Operational surveillance and anomaly detection.",
  },
];

export default function TrustBadges() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {badges.map((b, idx) => {
        const Icon = b.icon;
        return (
          <ScrollReveal key={b.title} delayMs={idx * 70}>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all duration-300 hover:border-gold-500/40 hover:bg-white/7">
              <div className="flex items-start gap-4">
                <div className="relative h-11 w-11 flex items-center justify-center rounded-xl border border-vault-gold/30 bg-vault-900/40">
                  <Icon className="h-5 w-5 text-vault-gold" />
                  <div className="absolute inset-0 rounded-xl bg-[radial-gradient(60%_60%_at_50%_0%,rgba(212,175,55,0.35)_0%,rgba(10,10,10,0)_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div>
                  <div className="text-sm font-semibold tracking-tight">{b.title}</div>
                  <div className="mt-1 text-xs text-white/65 leading-relaxed">{b.desc}</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
