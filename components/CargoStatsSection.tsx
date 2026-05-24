'use client'

import { motion } from 'framer-motion'
import { Globe, Package, MapPin, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

function AnimatedCount({ target }: { target: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1400
    const startTimestamp = performance.now()

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const nextValue = Math.floor(progress * target)
      setValue(nextValue)

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

const cargoStats = [
  {
    value: 1256,
    label: 'Delivered shipments',
    icon: Package,
  },
  {
    value: 18,
    label: 'Global hubs secured',
    icon: Globe,
  },
  {
    value: 2873,
    label: 'Routes monitored',
    icon: MapPin,
  },
  {
    value: 347,
    label: 'Critical alerts resolved',
    icon: ShieldCheck,
  },
]

export default function CargoStatsSection() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl sm:p-10">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.36em] text-emerald-300/80">Cargo dashboard</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Cargo & delivery tracking at a glance</h2>
        <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
          See the real shipment performance that powers secure deliveries, global routing, and fast response for Shield-protected cargo.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cargoStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-300">
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-6">
                <AnimatedCount target={stat.value} />
                <p className="mt-3 text-sm text-slate-400">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
