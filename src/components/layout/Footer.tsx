"use client";

import Link from "next/link";
import { COMPANY } from "@/lib/mockData";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-vault-950/30">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-vault-gold/40 bg-vault-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt={`${COMPANY.name} logo`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide text-vault-gold">
                  {COMPANY.name.toUpperCase()}
                </div>
                <div className="text-xs text-white/60">
                  Fortified storage for gold, gems &amp; legacy
                </div>
              </div>
            </div>
            <div className="text-sm text-white/70">
              {COMPANY.address}
            </div>
            <div className="text-sm text-white/70">
              <span className="text-vault-gold">Phone:</span>{" "}
              {COMPANY.phone}
            </div>
            <div className="break-all text-sm text-white/70">
              <span className="text-vault-gold">Email:</span>{" "}
              {COMPANY.email}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-white/70">
              <Link href="/privacy" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold rounded">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold rounded">
                Terms
              </Link>
              <Link href="/about" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold rounded">
                About
              </Link>
              <Link href="/services" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold rounded">
                Services
              </Link>
              <Link href="/request-access" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold rounded">
                Request Access
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/80">
                <span className="text-vault-gold">Status:</span> Secure operations &amp; monitored facilities.
              </div>
              <div className="mt-2 text-xs text-white/55">
                © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
