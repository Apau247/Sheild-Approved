'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { users } from '@/lib/data';
import type { User } from '@/lib/data';

interface AuthUser {
  email: string;
  name: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [clients, setClients] = useState<User[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('ivsCurrentUser');
    if (!stored) { router.push('/login'); return; }
    const parsed: AuthUser = JSON.parse(stored);
    if (parsed.role !== 'admin') { router.push('/client-portal'); return; }
    setAuthUser(parsed);
    setClients(users.filter(u => u.role === 'client'));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ivsCurrentUser');
    router.push('/login');
  };

  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-[#020609]">
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 border-r border-white/5 p-6 space-y-10 hidden lg:block">
          <div className="font-bold uppercase tracking-widest text-lg text-white">COMMAND <span className="text-gold">CENTER</span></div>
          <nav className="space-y-4">
            <a href="#" className="block p-3 rounded-xl bg-gold/10 text-gold font-bold">DASHBOARD</a>
            <a href="#" className="block p-3 rounded-xl text-slate-500 hover:text-white transition">ASSETS</a>
            <a href="#" className="block p-3 rounded-xl text-slate-500 hover:text-white transition">VAULT FEED</a>
            <a href="#" className="block p-3 rounded-xl text-slate-500 hover:text-white transition">ALERTS</a>
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl text-white">System <span className="text-gold">Overview</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white font-bold">{authUser.name}</p>
                <p className="text-[10px] text-emerald-500">LEVEL 5 ACCESS</p>
              </div>
              <div className="h-12 w-12 rounded-full border-2 border-gold p-1">
                <Image src="/logo.jpg" alt="User" width={48} height={48} className="rounded-full" />
              </div>
              <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-white ml-4 uppercase tracking-widest">Logout</button>
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
              <div className="relative rounded-2xl border border-white/10 overflow-hidden">
                <div className="absolute top-4 left-4 z-20 text-[10px] font-mono text-white">CAM_01 / NORTH_VAULT</div>
                <div className="absolute top-4 right-4 z-20"><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" /><span className="text-[10px] text-white">REC</span></div>
                <Image src="https://picsum.photos/seed/vault-feed-1/600/400" alt="Camera feed" width={600} height={400} className="opacity-50 grayscale hover:grayscale-0 transition-all duration-700 w-full h-full object-cover" />
              </div>
              <div className="relative rounded-2xl border border-white/10 overflow-hidden">
                <div className="absolute top-4 left-4 z-20 text-[10px] font-mono text-white">CAM_02 / ENTRANCE</div>
                <Image src="https://picsum.photos/seed/vault-feed-2/600/400" alt="Camera feed" width={600} height={400} className="opacity-50 grayscale w-full h-full object-cover" />
              </div>
            </div>
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <h4 className="text-sm font-bold text-white tracking-widest">THREAT ANALYSIS</h4>
              <div className="space-y-4">
                {[
                  { label: 'Motion Detection', value: 'CLEAR', color: 'text-emerald-500' },
                  { label: 'Network Integrity', value: '100%', color: 'text-emerald-500' },
                  { label: 'Atmospheric Pressure', value: 'STABLE', color: 'text-white' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <span className={`text-xs ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                <p className="text-[10px] text-red-500 font-bold">SYSTEM ALERT</p>
                <p className="text-xs text-white mt-1">Unscheduled maintenance detected in Block C.</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-lg text-white mb-6">Secured <span className="text-gold">Assets</span></h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="pb-4">Asset ID</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Location</th>
                    <th className="pb-4">Valuation</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-300">
                  {clients.filter(c => c.assetDetails).map((client) => (
                    <tr key={client.id} className="border-b border-white/5">
                      <td className="py-4 font-mono">{client.assetDetails!.securityCode}</td>
                      <td className="py-4">{client.assetDetails!.assetType}</td>
                      <td className="py-4">{client.assetDetails!.storageLocation}</td>
                      <td className="py-4 font-bold text-white">{client.assetDetails!.currency} {client.assetDetails!.consignmentValue.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 ${client.logistics?.status === 'Secured and Monitored' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'} text-[10px] rounded-md font-bold`}>
                          {client.logistics?.status?.toUpperCase() || 'FORTIFIED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
