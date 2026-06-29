'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authenticateUser } from '@/lib/data';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticateUser(email, password);
    if (!user) {
      setMessage({ text: 'Login failed. Please check your issued credentials.', success: false });
      return;
    }
    localStorage.setItem('ivsCurrentUser', JSON.stringify({
      email: user.email,
      name: user.fullName,
      role: user.role,
      vault: user.assetDetails?.storageLocation || 'Secure Facility L-01',
      assets: user.id.startsWith('client') ? 1 : 18,
      holdingsValue: user.assetDetails ? `${user.assetDetails.currency} ${user.assetDetails.consignmentValue.toLocaleString()}` : 'N/A',
      authenticatedAt: new Date().toISOString(),
    }));
    setMessage({ text: 'Login successful. Redirecting...', success: true });
    setTimeout(() => {
      router.push(user.role === 'admin' ? '/admin' : '/client-portal');
    }, 650);
  };

  return (
    <main className="min-h-screen" style={{ backgroundImage: 'linear-gradient(120deg, rgba(3,7,12,0.88), rgba(3,7,12,0.62)), url(https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="grid w-full gap-10 lg:grid-cols-[0.95fr_0.75fr] lg:items-center">
          <div className="max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-3 text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15">
                <Image src="/logo.jpg" alt="Shield Approved" width={36} height={36} className="h-9 w-9 rounded-xl object-contain" />
              </span>
              <span>
                <span className="block text-sm uppercase tracking-[0.35em] text-gold">Shield Approved</span>
                <span className="block text-xl font-semibold">Shield Approved</span>
              </span>
            </Link>
            <p className="mt-10 text-xs uppercase tracking-[0.28em] text-gold sm:mt-12 sm:text-sm sm:tracking-[0.35em]">Secure client access</p>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">Private vault access for approved clients.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Access protected asset records, secure movement updates and appointment details through the Shield Approved client portal.</p>
          </div>
          <div className="rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-10" style={{ background: 'rgba(6,12,18,0.86)', border: '1px solid rgba(212,175,55,0.24)', boxShadow: '0 30px 90px rgba(0,0,0,0.42), 0 0 80px rgba(212,175,55,0.12)', backdropFilter: 'blur(18px)' }}>
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-white">Secure Vault Access</h2>
              <p className="mt-3 text-slate-400">Enter your issued credentials to continue.</p>
            </div>
            {message && (
              <p className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${message.success ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/30 bg-rose-400/10 text-rose-200'}`}>
                {message.text}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-slate-200">Email Address</label>
                <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#081018] px-5 py-4 text-white outline-none focus:border-gold" />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-semibold text-slate-200">Password</label>
                <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#081018] px-5 py-4 text-white outline-none focus:border-gold" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                <label className="inline-flex items-center gap-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-[#081018] accent-gold" />
                  <span>Remember this device</span>
                </label>
                <a href="mailto:IronVaultSecurity@protonmail.com?subject=Password%20Assistance" className="text-[#f7d37a] hover:text-white">Forgot password?</a>
              </div>
              <button type="submit" className="w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#081113] transition hover:shadow-[0_20px_55px_rgba(212,175,55,0.28)]">Access Vault</button>
            </form>
            <p className="mt-8 text-center text-sm text-slate-400">Need access? <a href="mailto:IronVaultSecurity@protonmail.com" className="font-semibold text-[#f7d37a] hover:text-white">Request a confidential review</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}
