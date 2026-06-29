'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getUserByEmail } from '@/lib/data';
import type { User } from '@/lib/data';

interface AuthUser {
  email: string;
  name: string;
  role: string;
  vault: string;
  assets: number;
  holdingsValue: string;
}

export default function ClientPortalPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [fullUser, setFullUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ivsCurrentUser');
    if (!stored) { router.push('/login'); return; }
    const parsed: AuthUser = JSON.parse(stored);
    setAuthUser(parsed);
    const user = getUserByEmail(parsed.email);
    if (!user) { localStorage.removeItem('ivsCurrentUser'); router.push('/login'); return; }
    setFullUser(user);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ivsCurrentUser');
    router.push('/login');
  };

  if (!authUser || !fullUser) return null;

  const asset = fullUser.assetDetails;
  const logistics = fullUser.logistics;

  return (
    <div className="min-h-screen bg-[#05080f]">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#05080f]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15">
              <Image src="/logo.jpg" alt="Shield Approved" width={32} height={32} className="h-8 w-8 rounded-xl object-contain" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.35em] text-gold">Client Portal</span>
              <span className="block font-semibold">Shield Approved</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <a href="mailto:IronVaultSecurity@protonmail.com" className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:border-gold hover:text-[#f7d37a] sm:inline-flex">Request Support</a>
            <button onClick={handleLogout} className="rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-[#081113] sm:px-5">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="gold-panel rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="hidden sm:block">
                <Image src={fullUser.clientImage || '/logo.jpg'} alt="Client" width={80} height={80} className="h-20 w-20 rounded-2xl border border-gold/30 object-cover shadow-2xl" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gold">Verified session</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Welcome back, {fullUser.fullName}.</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Review your private vault assignment, registered holdings and secure movement details.</p>
                <div className="mt-4">
                  <span className="status-badge border-emerald-400/30 bg-emerald-400/10 text-emerald-400">Active</span>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-[#07101a]/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Vault</p>
                <p className="mt-3 text-2xl font-semibold text-white">{asset?.storageLocation?.split('—')[1]?.trim() || 'Vault L-01'}</p>
              </div>
              <div className="rounded-3xl bg-[#07101a]/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Holdings</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {asset ? `${asset.currency} ${(asset.consignmentValue / 1000000).toFixed(1)}M` : 'N/A'}
                </p>
              </div>
              <div className="rounded-3xl bg-[#07101a]/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Assets</p>
                <p className="mt-3 text-2xl font-semibold text-white">{asset ? '1' : '0'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-8" style={{ background: 'rgba(6,12,18,0.85)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 70px rgba(0,0,0,0.3)' }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gold">Protected holdings</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Asset register</h2>
              </div>
              <span className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-sm font-semibold text-[#f7d37a]">Updated today</span>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="px-3 py-3">Asset ID</th>
                    <th className="px-3 py-3">Asset Designation</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Quantity</th>
                    <th className="px-3 py-3">Valuation</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {asset ? (
                    <tr className="border-b border-white/10 even:bg-white/5 transition hover:bg-white/10">
                      <td className="px-3 py-4 font-mono text-gold">{asset.securityCode}</td>
                      <td className="px-3 py-4 font-semibold text-white">{fullUser.assetType} Consignment</td>
                      <td className="px-3 py-4">{asset.assetType}</td>
                      <td className="px-3 py-4">{asset.quantity}</td>
                      <td className="px-3 py-4 font-medium text-slate-100">{asset.currency} {asset.consignmentValue.toLocaleString()}</td>
                      <td className="px-3 py-4">
                        <span className="status-badge border-emerald-400/30 bg-emerald-400/10 text-emerald-400">{logistics?.status || 'Fortified'}</span>
                      </td>
                    </tr>
                  ) : (
                    <tr><td colSpan={6} className="px-3 py-10 text-center text-slate-500 italic">No registered assets found in this account.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-8" style={{ background: 'rgba(6,12,18,0.85)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 70px rgba(0,0,0,0.3)' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Secure shipment</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Track movement</h2>
            <p className="mt-4 text-slate-300">Use your secure shipment reference to review the latest monitored status.</p>
            <div className="mt-6 space-y-4">
              <input
                id="trackingInput"
                defaultValue={asset?.securityCode || ''}
                placeholder="Enter Shipment ID"
                className="w-full rounded-2xl border border-white/10 bg-[#081018] px-5 py-4 text-white outline-none focus:border-gold"
              />
              <button
                onClick={() => {
                  const id = (document.getElementById('trackingInput') as HTMLInputElement)?.value?.trim().toUpperCase();
                  const result = document.getElementById('trackingResult');
                  if (result && asset && asset.securityCode === id && logistics) {
                    result.innerHTML = `
                      <div class="flex items-center justify-between">
                        <p class="text-sm uppercase tracking-[0.35em] text-gold">${id}</p>
                        <span class="status-badge border-emerald-400/30 bg-emerald-400/10 text-emerald-400">${logistics.status}</span>
                      </div>
                      <h3 class="mt-4 text-2xl font-semibold text-white">Movement: ${logistics.transportMethod}</h3>
                      <div class="mt-4 grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-sm">
                        <div><p class="text-slate-400">Escort Configuration</p><p class="text-white">${logistics.vehicleType} (${logistics.numberOfVehicles} Units)</p></div>
                        <div><p class="text-slate-400">Security Clearance</p><p class="text-white">${logistics.securityLevel}</p></div>
                      </div>
                      <p class="mt-4 text-xs text-slate-500 italic">Live biometric telemetry active for this transit session.</p>
                    `;
                  } else if (result) {
                    result.innerHTML = `<div class="flex items-center gap-3 text-rose-300 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20"><p>No secure record found for <strong>${id}</strong>.</p></div>`;
                  }
                }}
                className="w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#081113]"
              >
                Track
              </button>
              <div id="trackingResult" className="rounded-3xl border border-gold/20 bg-gold/10 p-6 text-slate-200" />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-3">
          <article className="rounded-[2rem] p-7" style={{ background: 'rgba(6,12,18,0.85)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 70px rgba(0,0,0,0.3)' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Next appointment</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Private access review</h3>
            <p className="mt-3 text-slate-300">28 May 2026, 11:30 GMT at 45 Bankside Lane.</p>
          </article>
          <article className="rounded-[2rem] p-7" style={{ background: 'rgba(6,12,18,0.85)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 70px rgba(0,0,0,0.3)' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Insurance</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Coverage verified</h3>
            <p className="mt-3 text-slate-300">Policy records are current for registered holdings.</p>
          </article>
          <article className="rounded-[2rem] p-7" style={{ background: 'rgba(6,12,18,0.85)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 70px rgba(0,0,0,0.3)' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Client director</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Concierge support</h3>
            <p className="mt-3 break-words text-slate-300">IronVaultSecurity@protonmail.com<br />+44 20 7946 0958</p>
          </article>
        </section>
      </main>
    </div>
  );
}
