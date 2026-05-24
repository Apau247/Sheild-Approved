'use client'

import { useEffect, useState } from 'react'
import { ShieldCheck, Package, Users } from 'lucide-react'

const counters = [
  { value: 1847, label: 'Enterprise clients secured', icon: Users },
  { value: 92, label: 'Verified Shield Vaults', icon: ShieldCheck },
  { value: 3294, label: 'Shipments routed safely', icon: Package },
]

function AnimatedCount({ target }: { target: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const duration = 1400
    const startTimestamp = performance.now()

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setValue(Math.floor(progress * target))

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setValue(target)
      }
    }

    requestAnimationFrame(step)
  }, [target])

  return <span className="text-4xl font-semibold text-white">{value.toLocaleString()}</span>
}

export default function CounterSection() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl sm:p-10">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.36em] text-emerald-300/80">Why people choose us</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Shield-grade trust built into every delivery.</h2>
        <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
          Trusted by enterprise teams who need secure routing, verified vault access, and transparent shipment visibility.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {counters.map((counter) => {
          const Icon = counter.icon
          return (
            <div key={counter.label} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-300">
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-6">
                <AnimatedCount target={counter.value} />
                <p className="mt-3 text-sm text-slate-400">{counter.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
