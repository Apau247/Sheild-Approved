'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: 'Your enrolment request has been submitted. Our team will contact you within 24 hours.', success: true });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <main className="min-h-screen" style={{ backgroundImage: 'linear-gradient(120deg, rgba(3,7,12,0.88), rgba(3,7,12,0.62)), url(/images/hero5.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="grid w-full gap-10 lg:grid-cols-[0.95fr_0.75fr] lg:items-center">
          <div className="max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-3 text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15">
                <Image src="/images/logo.png" alt="Iron Vault Security" width={36} height={36} className="h-9 w-9 rounded-xl object-contain" />
              </span>
              <span>
                <span className="block text-sm uppercase tracking-[0.35em] text-gold">Shield Approved</span>
                <span className="block text-xl font-semibold">Iron Vault Security</span>
              </span>
            </Link>
            <p className="mt-10 text-xs uppercase tracking-[0.28em] text-gold sm:mt-12 sm:text-sm sm:tracking-[0.35em]">Secure enrolment</p>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">Request a confidential review for private vault access.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Submit your details below. Our client director team will respond within 24 hours with a secure consultation schedule.</p>
          </div>
          <div className="rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-10" style={{ background: 'rgba(6,12,18,0.86)', border: '1px solid rgba(212,175,55,0.24)', boxShadow: '0 30px 90px rgba(0,0,0,0.42), 0 0 80px rgba(212,175,55,0.12)', backdropFilter: 'blur(18px)' }}>
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-white">Enrolment Request</h2>
              <p className="mt-3 text-slate-400">All submissions are encrypted in transit.</p>
            </div>
            {message && (
              <p className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${message.success ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/30 bg-rose-400/10 text-rose-200'}`}>
                {message.text}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fullName" className="text-sm font-semibold text-slate-200">Full Name</label>
                  <input id="fullName" type="text" required placeholder="Your full name" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#081018] px-5 py-4 text-white outline-none focus:border-gold" />
                </div>
                <div>
                  <label htmlFor="company" className="text-sm font-semibold text-slate-200">Company / Family Office</label>
                  <input id="company" type="text" required placeholder="Company or family office" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#081018] px-5 py-4 text-white outline-none focus:border-gold" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-slate-200">Email Address</label>
                <input id="email" type="email" required placeholder="Enter your email" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#081018] px-5 py-4 text-white outline-none focus:border-gold" />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-semibold text-slate-200">Phone Number</label>
                <input id="phone" type="tel" required placeholder="International format" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#081018] px-5 py-4 text-white outline-none focus:border-gold" />
              </div>
              <div>
                <label htmlFor="country" className="text-sm font-semibold text-slate-200">Country of Residence</label>
                <input id="country" type="text" required placeholder="Country" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#081018] px-5 py-4 text-white outline-none focus:border-gold" />
              </div>
              <div>
                <label htmlFor="serviceInterest" className="text-sm font-semibold text-slate-200">Service Interest</label>
                <select id="serviceInterest" required className="mt-3 w-full rounded-2xl border border-white/10 bg-[#081018] px-5 py-4 text-white outline-none focus:border-gold">
                  <option value="" disabled selected>Select a service</option>
                  <option value="Private Vault Storage">Private Vault Storage</option>
                  <option value="Diamond and Jewellery Storage">Diamond and Jewellery Storage</option>
                  <option value="Precious Metals Storage">Precious Metals Storage</option>
                  <option value="Secure Cargo Delivery">Secure Cargo Delivery</option>
                  <option value="Luxury Watch Storage">Luxury Watch Storage</option>
                  <option value="Elite Asset Protection">Elite Asset Protection</option>
                </select>
              </div>
              <button type="submit" className="w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#081113] transition hover:shadow-[0_20px_55px_rgba(212,175,55,0.28)]">Submit Enrolment</button>
            </form>
            <p className="mt-8 text-center text-sm text-slate-400">Already enrolled? <Link href="/login" className="font-semibold text-[#f7d37a] hover:text-white">Access your vault</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
