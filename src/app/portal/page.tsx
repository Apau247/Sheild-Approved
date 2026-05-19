"use client";

import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import AuthGate from "@/components/auth/AuthGate";
import { useAuth } from "@/context/AuthContext";
import {
  MOCK_ASSETS,
  MOCK_SHIPMENTS,
  STATS,
  COMPANY,
  type AssetRecord,
  type ShipmentRecord,
} from "@/lib/mockData";
import {
  ShieldCheck,
  PlusCircle,
  PackageSearch,
  Shield,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(d);
  } catch {
    return iso;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useAnimatedNumber(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = clamp((now - start) / durationMs, 0, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

export default function PortalPage() {
  return (
    <AuthGate fallbackPath="/login">
      <PortalContent />
    </AuthGate>
  );
}

function PortalContent() {
  const { user } = useAuth();

  const [assets, setAssets] = useState<AssetRecord[]>(MOCK_ASSETS);
  const [shipments, setShipments] = useState<ShipmentRecord[]>(MOCK_SHIPMENTS);

  const [addOpen, setAddOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);

  const nextAssetId = useMemo(() => {
    const last = assets[0]?.id ?? "AST-000";
    const num = Number(String(last).split("-")[1] ?? 0);
    return `AST-${String(num + 1).padStart(3, "0")}`;
  }, [assets]);

  const targets = [
    // Make counters feel realistic based on current mock lists.
    {
      label: STATS[0].label,
      value: 2500 + assets.length * 3,
      suffix: "+",
    },
    {
      label: STATS[1].label,
      value: 1200,
      suffix: "+",
    },
    {
      label: STATS[2].label,
      value: 300 + shipments.length * 2,
      suffix: "+",
    },
    {
      label: STATS[3].label,
      value: 16, // slightly higher for “now”
      suffix: "+",
    },
  ];

  const c1 = useAnimatedNumber(targets[0].value);
  const c2 = useAnimatedNumber(targets[1].value);
  const c3 = useAnimatedNumber(targets[2].value);
  const c4 = useAnimatedNumber(targets[3].value);

  const [assetForm, setAssetForm] = useState({
    assetName: "",
    type: "",
    quantity: "",
    vault: "Vault A-04",
    value: "",
  });

  const [shipmentForm, setShipmentForm] = useState({
    shipmentId: "",
  });

  function onAddAssetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!assetForm.assetName.trim() || !assetForm.type.trim() || !assetForm.quantity.trim()) {
      toast.error("Please fill required asset fields.");
      return;
    }

    const record: AssetRecord = {
      id: nextAssetId,
      client: user?.name ?? "Client",
      assetName: assetForm.assetName.trim(),
      type: assetForm.type.trim(),
      quantity: assetForm.quantity.trim(),
      vault: assetForm.vault,
      status: "Awaiting Intake",
      addedDate: new Date().toISOString().slice(0, 10),
      value: assetForm.value.trim() || undefined,
    };

    setAssets((prev) => [record, ...prev]);
    setAddOpen(false);
    toast.success("Asset intake request created. Awaiting secure verification.");
    setAssetForm({ assetName: "", type: "", quantity: "", vault: "Vault A-04", value: "" });
  }

  function findShipment(id: string) {
    const s = shipments.find((x) => x.id.toLowerCase() === id.toLowerCase());
    return s ?? null;
  }

  function mockProgressTick() {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.status === "Delivered") return s;
        const nextProgress = clamp(s.progress + (s.progress < 80 ? 8 : 5), 0, 100);
        const nextStatus: ShipmentRecord["status"] =
          nextProgress >= 100 ? "Delivered" : s.status === "Pending" ? "Processing" : s.status;
        return {
          ...s,
          progress: nextProgress,
          status: nextStatus,
        };
      })
    );
  }

  useEffect(() => {
    const t = window.setInterval(() => {
      // “realistic” periodic updates
      mockProgressTick();
    }, 7000);

    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onTrackSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!shipmentForm.shipmentId.trim()) {
      toast.error("Enter a shipment ID.");
      return;
    }
    const s = findShipment(shipmentForm.shipmentId.trim());
    if (!s) {
      toast.error("Shipment not found in mock records.");
      return;
    }
    setTrackingOpen(true);
  }

  const displayedShipment = useMemo(() => {
    const s = shipments.find((x) => x.id.toLowerCase() === shipmentForm.shipmentId.trim().toLowerCase());
    return s ?? shipments[0];
  }, [shipments, shipmentForm.shipmentId]);

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[radial-gradient(70%_60%_at_20%_0%,rgba(212,175,55,0.18)_0%,rgba(10,10,10,0)_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-vault-gold/20 bg-white/5 px-3 py-1 text-xs text-white/80">
              <ShieldCheck className="h-3.5 w-3.5 text-vault-gold" />
              Secure client portal
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}. Your assets are protected.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Live tracking, verified intake requests, and secure shipment monitoring—powered by mock data now, Supabase-ready later.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-vault-gold/30 bg-vault-gold/10 px-4 py-2 text-sm text-vault-gold hover:bg-vault-gold/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
            >
              <PlusCircle className="h-4 w-4" />
              Add Asset
            </button>

            <button
              onClick={() => setTrackingOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
            >
              <PackageSearch className="h-4 w-4" />
              Track Shipment
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, val: c1, suffix: targets[0].suffix, label: targets[0].label },
            { icon: TrendingUp, val: c2, suffix: targets[1].suffix, label: targets[1].label },
            { icon: PackageSearch, val: c3, suffix: targets[2].suffix, label: targets[2].label },
            { icon: RefreshCcw, val: c4, suffix: targets[3].suffix, label: targets[3].label },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-white/70">{s.label}</div>
                  <Icon className="h-5 w-5 text-vault-gold" />
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-tight">
                  {s.val}
                  <span className="text-vault-gold/90">{s.suffix}</span>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Mock Assets</h2>
                <p className="mt-1 text-sm text-white/70">
                  Asset intake and storage status updates. Adding an asset will update the list instantly.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                {assets.length} records
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-xs text-white/60">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">ID</th>
                    <th className="px-3 py-2 text-left font-medium">Asset</th>
                    <th className="px-3 py-2 text-left font-medium">Vault</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                    <th className="px-3 py-2 text-left font-medium">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {assets.slice(0, 6).map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-3 text-white/80">{a.id}</td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-white/90">{a.assetName}</div>
                        <div className="text-xs text-white/60">{a.type} · {a.quantity}</div>
                      </td>
                      <td className="px-3 py-3 text-white/80">{a.vault}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center rounded-full border border-vault-gold/20 bg-vault-gold/10 px-2 py-1 text-xs text-vault-gold">
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-white/70">{formatDate(a.addedDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Shipment Tracker</h2>
            <p className="mt-1 text-sm text-white/70">
              Live mock progress updates every few seconds.
            </p>

            <form className="mt-4 flex gap-3" onSubmit={onTrackSubmit}>
              <label className="sr-only" htmlFor="shipmentId">
                Shipment ID
              </label>
              <input
                id="shipmentId"
                value={shipmentForm.shipmentId}
                onChange={(e) => setShipmentForm((p) => ({ ...p, shipmentId: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
                placeholder="e.g., IVS-78432"
              />
              <button
                type="submit"
                className="rounded-xl border border-vault-gold/30 bg-vault-gold/10 px-4 py-2 text-sm text-vault-gold hover:bg-vault-gold/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
              >
                Track
              </button>
            </form>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">{displayedShipment?.id}</div>
                <div className="text-xs text-white/70">
                  ETA: <span className="text-white/85">{displayedShipment?.eta}</span>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/70">Progress</div>
                  <div className="text-sm font-semibold text-vault-gold">
                    {displayedShipment?.progress}%
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-vault-gold/70 to-vault-gold"
                    style={{ width: `${displayedShipment?.progress ?? 0}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                    {displayedShipment?.status}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                    {displayedShipment?.origin} → {displayedShipment?.destination}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-sm text-white/70">
                <span className="text-vault-gold">Contents:</span> {displayedShipment?.contents}
              </div>
            </div>
          </div>
        </section>

        {/* Add Asset Modal */}
        {addOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 p-4" role="dialog" aria-modal="true">
            <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-vault-950/95 p-6 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-white/70">Secure intake request</div>
                  <h3 className="mt-1 text-xl font-semibold">Add an Asset</h3>
                </div>
                <button
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                  onClick={() => setAddOpen(false)}
                >
                  Close
                </button>
              </div>

              <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={onAddAssetSubmit}>
                <div className="sm:col-span-2">
                  <label className="text-sm text-white/70" htmlFor="assetName">
                    Asset name <span className="text-vault-gold">*</span>
                  </label>
                  <input
                    id="assetName"
                    value={assetForm.assetName}
                    onChange={(e) => setAssetForm((p) => ({ ...p, assetName: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
                    placeholder="Gold Bars"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70" htmlFor="type">
                    Type <span className="text-vault-gold">*</span>
                  </label>
                  <input
                    id="type"
                    value={assetForm.type}
                    onChange={(e) => setAssetForm((p) => ({ ...p, type: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
                    placeholder="Precious Metal"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70" htmlFor="quantity">
                    Quantity <span className="text-vault-gold">*</span>
                  </label>
                  <input
                    id="quantity"
                    value={assetForm.quantity}
                    onChange={(e) => setAssetForm((p) => ({ ...p, quantity: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
                    placeholder="12 bars / 150kg"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70" htmlFor="vault">
                    Vault location
                  </label>
                  <select
                    id="vault"
                    value={assetForm.vault}
                    onChange={(e) => setAssetForm((p) => ({ ...p, vault: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
                  >
                    {["Vault A-04", "Vault A-09", "Vault B-03", "Vault B-11", "Vault C-07", "Vault D-01"].map((v) => (
                      <option key={v} value={v} className="bg-vault-950">
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/70" htmlFor="value">
                    Estimated value (optional)
                  </label>
                  <input
                    id="value"
                    value={assetForm.value}
                    onChange={(e) => setAssetForm((p) => ({ ...p, value: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
                    placeholder="£4,200,000"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <div className="text-xs text-white/60">
                    Mock ID: <span className="text-white/85">{nextAssetId}</span>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl border border-vault-gold/30 bg-vault-gold/10 px-4 py-2 text-sm text-vault-gold hover:bg-vault-gold/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
                  >
                    Create Intake Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tracking Modal */}
        {trackingOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 p-4" role="dialog" aria-modal="true">
            <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-vault-950/95 p-6 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-white/70">Secure shipment monitoring</div>
                  <h3 className="mt-1 text-xl font-semibold">Shipment Details</h3>
                </div>
                <button
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                  onClick={() => setTrackingOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-medium">{displayedShipment?.id}</div>
                  <div className="mt-1 text-sm text-white/70">{displayedShipment?.contents}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-vault-gold/20 bg-vault-gold/10 px-3 py-1 text-xs text-vault-gold">
                      {displayedShipment?.status}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      ETA: {displayedShipment?.eta}
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-vault-gold/70 to-vault-gold"
                      style={{ width: `${displayedShipment?.progress ?? 0}%` }}
                    />
                  </div>

                  <div className="mt-3 text-xs text-white/60">
                    Route: <span className="text-white/85">{displayedShipment?.origin}</span> →{" "}
                    <span className="text-white/85">{displayedShipment?.destination}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Live Updates</div>
                  <p className="mt-1 text-sm text-white/70">
                    Progress increments are simulated to match a realistic operations cadence.
                  </p>

                  <div className="mt-4 space-y-3">
                    {[
                      {
                        title: "Secure handover confirmed",
                        desc: "Encrypted custody logs written and verified.",
                        when: "Just now",
                      },
                      {
                        title: "Route monitoring active",
                        desc: "GPS + anomaly detection heartbeat signals received.",
                        when: "2 min ago",
                      },
                      {
                        title: "Vault intake window scheduled",
                        desc: "Intake team and biometric access prepared.",
                        when: "Next window",
                      },
                    ].map((x) => (
                      <div key={x.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-white/90">{x.title}</div>
                          <div className="text-xs text-white/60">{x.when}</div>
                        </div>
                        <div className="mt-1 text-sm text-white/70">{x.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-white/55">
                {COMPANY.name} · Secure custody protocol (mock)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
