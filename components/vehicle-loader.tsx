'use client'

import { useEffect, useState } from 'react'
import { Bike, Car, CarFront, CarTaxiFront, Truck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const vehicles: { name: string; icon: LucideIcon }[] = [
  { name: 'Motorcycle and scooter', icon: Bike },
  { name: 'Auto rickshaw', icon: CarTaxiFront },
  { name: 'Sedan car', icon: CarFront },
  { name: 'SUV and Jeep', icon: Car },
  { name: 'Heavy tow truck', icon: Truck },
]

export default function VehicleLoader({ message }: { message: string | null }) {
  const [activeVehicle, setActiveVehicle] = useState(0)

  useEffect(() => {
    if (!message) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => {
      setActiveVehicle((index) => (index + 1) % vehicles.length)
    }, 500)
    return () => window.clearInterval(interval)
  }, [message])

  if (!message) return null

  const ActiveIcon = vehicles[activeVehicle].icon

  return <div className="vehicle-loader fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#090b10] px-6 text-center" role="status" aria-live="polite" aria-label={message}>
    <div aria-hidden="true" className="vehicle-loader-ambient absolute inset-0" />
    <div aria-hidden="true" className="vehicle-loader-grid absolute inset-0 opacity-30" />
    <div className="relative flex w-full max-w-sm flex-col items-center">
      <div className="mb-8 flex items-center gap-3">
        <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-[15px] border border-amber-300/30 bg-gradient-to-br from-amber-300/15 to-orange-500/10 text-amber-200 shadow-[0_0_28px_rgba(251,146,60,0.16)]"><span className="text-sm font-black tracking-[-0.08em]">AZ</span></span>
        <div className="text-left">
          <p className="text-[15px] font-extrabold tracking-[-0.04em] text-white">AutoZync<span className="text-amber-300">.</span></p>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">Mobility network</p>
        </div>
      </div>

      <div className="vehicle-loader-stage relative mb-7 flex size-44 items-center justify-center sm:size-48">
        <span aria-hidden="true" className="vehicle-loader-orbit absolute inset-0 rounded-full border border-amber-200/[0.12]" />
        <span aria-hidden="true" className="vehicle-loader-orbit vehicle-loader-orbit-delayed absolute inset-3 rounded-full border border-orange-300/[0.14]" />
        <span aria-hidden="true" className="absolute inset-7 rounded-full border border-white/[0.06] bg-[radial-gradient(circle_at_50%_40%,rgba(255,175,70,0.1),rgba(10,12,17,0)_68%)]" />
        <span aria-hidden="true" className="vehicle-loader-sweep absolute inset-0 rounded-full" />
        <span className="vehicle-loader-icon relative flex size-[6.25rem] items-center justify-center rounded-[28px] border border-amber-100/20 bg-gradient-to-br from-[#30271c] via-[#181914] to-[#111318] text-amber-200 shadow-[0_0_48px_rgba(255,156,42,0.18),inset_0_1px_0_rgba(255,255,255,0.12)] sm:size-28" key={activeVehicle}>
          <ActiveIcon size={48} strokeWidth={1.35} aria-hidden="true" />
        </span>
        <span aria-hidden="true" className="absolute bottom-3 size-1.5 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.9)]" />
      </div>

      <p aria-hidden="true" className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-200/80">{vehicles[activeVehicle].name}</p>
      <p className="mt-3 max-w-[18rem] text-base font-semibold leading-relaxed text-white">{message}</p>
      <div aria-hidden="true" className="mt-7 flex items-center gap-2">
        {vehicles.map((vehicle, index) => <span key={vehicle.name} className={`h-1 rounded-full transition-[width,background-color] duration-300 ${index === activeVehicle ? 'w-7 bg-amber-300' : 'w-1.5 bg-white/20'}`} />)}
      </div>
      <p className="mt-6 text-[10px] font-medium tracking-[0.035em] text-slate-500">AutoZync • Ready for all vehicles A to Z</p>
    </div>
  </div>
}
