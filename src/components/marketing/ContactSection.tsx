"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import { Phone, Mail, MapPin, LockKeyhole } from "lucide-react";
import { COMPANY } from "@/lib/mockData";

export default function ContactSection() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    assetType: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill required fields (name, email, message).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error || "Enquiry failed. Please try again.");
        return;
      }
      toast.success("Request received. Our team will contact you shortly.");
      setForm({ fullName: "", email: "", phone: "", assetType: "", message: "" });
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="label-gold">Private Consultations</div>
          <h2 className="section-heading mt-2">
            Enquire discreetly, <span className="text-gradient-gold">move fast</span>
          </h2>
          <p className="section-subheading mt-4">
            Tell us what you need to secure. We’ll respond with a private, tailored intake process.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <ScrollReveal>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl border border-vault-gold/30 bg-vault-900/30 grid place-items-center">
                  <Phone className="h-4 w-4 text-vault-gold" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">{COMPANY.phone}</div>
                  <div className="text-xs text-white/60">Telephone line</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={80}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl border border-vault-gold/30 bg-vault-900/30 grid place-items-center">
                  <Mail className="h-4 w-4 text-vault-gold" />
                </div>
                <div>
                  <div className="break-all text-sm font-semibold text-white/90">{COMPANY.email}</div>
                  <div className="text-xs text-white/60">Secure email inbox</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={140}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl border border-vault-gold/30 bg-vault-900/30 grid place-items-center">
                  <MapPin className="h-4 w-4 text-vault-gold" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">London, EC2</div>
                  <div className="text-xs text-white/60">{COMPANY.address}</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={200}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl border border-vault-gold/30 bg-vault-900/30 grid place-items-center">
                  <LockKeyhole className="h-4 w-4 text-vault-gold" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">Discretion assured</div>
                  <div className="text-xs text-white/60">Private intake and response posture</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ScrollReveal>
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-white/10 bg-vault-950/30 p-6 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-white/70">Request a consultation</div>
                  <div className="mt-1 text-2xl font-semibold">Enquire Now</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                  <div className="text-xs text-white/60">Response window</div>
                  <div className="text-sm font-semibold text-vault-gold">Within 1 business day</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="text-sm text-white/70" htmlFor="fullName">
                    Full name <span className="text-vault-gold">*</span>
                  </label>
                  <input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="mt-2 input-dark"
                    placeholder="e.g., Amelia Carter"
                    required
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="text-sm text-white/70" htmlFor="email">
                    Email <span className="text-vault-gold">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="mt-2 input-dark"
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="text-sm text-white/70" htmlFor="phone">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="mt-2 input-dark"
                    placeholder="+44 ..."
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="text-sm text-white/70" htmlFor="assetType">
                    Asset type (optional)
                  </label>
                  <input
                    id="assetType"
                    value={form.assetType}
                    onChange={(e) => setForm((p) => ({ ...p, assetType: e.target.value }))}
                    className="mt-2 input-dark"
                    placeholder="Gold / Diamonds / Jewellery..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-white/70" htmlFor="message">
                    Message <span className="text-vault-gold">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="mt-2 input-dark min-h-[130px]"
                    placeholder="Tell us what you’d like to secure and your preferred timeline."
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-white/60">
                  By submitting, you agree to a discreet follow-up regarding your request.
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full sm:w-auto disabled:opacity-60 disabled:hover:shadow-none"
                >
                  {submitting ? "Sending..." : "Send enquiry"}
                </button>
              </div>
            </form>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-2">
          <ScrollReveal delayMs={120}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="text-sm font-semibold">London facility</div>
              <div className="mt-1 text-sm text-white/70">{COMPANY.address}</div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                {/* Placeholder map embed */}
                <iframe
                  title="Iron Vault Security location"
                  src={COMPANY.mapEmbedUrl}
                  className="h-64 w-full"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 text-xs text-white/55">
                Access requests are reviewed privately. Facility visitation is arranged only after verification.
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
