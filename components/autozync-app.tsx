'use client'

import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  BatteryWarning,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Crosshair,
  Fuel,
  Headphones,
  MapPin,
  Mic,
  Minus,
  Navigation,
  Phone,
  Radio,
  Shield,
  ShieldCheck,
  Signal,
  Siren,
  Speaker,
  Star,
  Truck,
  Wrench,
  X,
  Zap,
  Volume2,
  VolumeX,
  Wallet,
  Waves,
  Wifi,
  ClipboardCheck,
  CircleOff,
  CircleDot,
  Plus,
  CarFront,
  Bike,
  Cog,
} from 'lucide-react'

type Role = 'customer' | 'partner'
type Tab = 'home' | 'sos' | 'deals' | 'profile'
type Service = 'Flatbed Towing' | 'Tyre Puncture' | 'On-Site Mechanic' | 'Battery Jumpstart'
type Offer = { name: string; price: string; note: string; icon: LucideIcon; color: string; discount?: string }

const services: { name: Service; description: string; icon: LucideIcon; price: string }[] = [
  { name: 'Flatbed Towing', description: 'Safe recovery, door to door', icon: Truck, price: 'from ₹899' },
  { name: 'Tyre Puncture', description: 'Mobile repair & air refill', icon: Wrench, price: 'from ₹299' },
  { name: 'On-Site Mechanic', description: 'Expert help where you are', icon: Cog, price: 'from ₹499' },
  { name: 'Battery Jumpstart', description: 'Jumpstart or EV quick charge', icon: BatteryCharging, price: 'from ₹399' },
]

const baseOffers: Offer[] = [
  { name: '9H Ceramic Coating', price: '₹7,999', note: 'Verified garage deal', icon: ShieldCheck, color: 'cyan' },
  { name: 'Self-Healing PPF', price: '20% OFF', note: 'Full body protection', icon: Shield, color: 'blue', discount: 'SAVE 20%' },
  { name: 'Monsoon 40-Point Check', price: '₹499', note: 'Flat rate · all vehicles', icon: ClipboardCheck, color: 'amber' },
]

const vehicles = [
  { id: 'van', title: 'Van #04', subtitle: 'Recovery truck', eta: '5 min', left: '20%', top: '24%', icon: Truck },
  { id: 'rajesh', title: 'Rajesh K.', subtitle: 'Mobile mechanic', eta: '8 min', left: '72%', top: '54%', icon: Wrench },
  { id: 'van2', title: 'Van #12', subtitle: 'Battery support', eta: '11 min', left: '35%', top: '76%', icon: BatteryCharging },
]

function GearMark({ small = false }: { small?: boolean }) {
  return (
    <div className={`relative flex shrink-0 items-center justify-center rounded-[15px] border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300 shadow-[0_0_22px_rgba(0,229,255,0.12)] ${small ? 'size-9 rounded-xl' : 'size-11'}`} aria-hidden="true">
      <Cog className={small ? 'size-[19px]' : 'size-[23px]'} strokeWidth={1.8} />
      <span className="absolute right-[7px] top-[7px] size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00e5ff]" />
    </div>
  )
}

function ModalFrame({ children, onClose, full = false, label }: { children: React.ReactNode; onClose: () => void; full?: boolean; label: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#03060b]/80 backdrop-blur-md sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" aria-label={label} className={`relative w-full overflow-y-auto border border-white/[0.08] bg-[#111a29] shadow-[0_24px_80px_rgba(0,0,0,0.55)] ${full ? 'h-[100dvh] max-w-[460px] rounded-none sm:h-[min(780px,92vh)] sm:rounded-[30px]' : 'max-h-[88dvh] max-w-[460px] rounded-t-[28px] sm:rounded-[28px]'}`}>
        {children}
      </section>
    </div>
  )
}

function IconButton({ children, label, onClick, className = '' }: { children: React.ReactNode; label: string; onClick: () => void; className?: string }) {
  return <button type="button" aria-label={label} onClick={onClick} className={`flex size-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.08] hover:text-cyan-200 active:scale-95 ${className}`}>{children}</button>
}

function MapSimulation({ onVehicle }: { onVehicle: (vehicle: typeof vehicles[number]) => void }) {
  return (
    <section aria-label="Nearby roadside assistance map" className="relative h-[176px] overflow-hidden rounded-[24px] border border-[#29364b] bg-[#111b2a] sm:h-[200px]">
      <div className="absolute inset-0 map-grid opacity-70" />
      <svg className="absolute inset-0 size-full" viewBox="0 0 440 224" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 49 C85 68 110 8 199 38 S327 81 458 32" fill="none" stroke="#263447" strokeWidth="13" />
        <path d="M-20 49 C85 68 110 8 199 38 S327 81 458 32" fill="none" stroke="#182537" strokeWidth="8" />
        <path d="M98 -15 C117 46 140 82 102 133 S98 180 155 244" fill="none" stroke="#263447" strokeWidth="11" />
        <path d="M98 -15 C117 46 140 82 102 133 S98 180 155 244" fill="none" stroke="#182537" strokeWidth="6" />
        <path d="M292 -10 C270 42 317 91 290 128 S270 178 318 240" fill="none" stroke="#263447" strokeWidth="10" />
        <path d="M292 -10 C270 42 317 91 290 128 S270 178 318 240" fill="none" stroke="#182537" strokeWidth="5" />
        <path d="M-15 172 C65 148 141 203 229 170 S353 137 462 182" fill="none" stroke="#263447" strokeWidth="11" />
        <path d="M-15 172 C65 148 141 203 229 170 S353 137 462 182" fill="none" stroke="#182537" strokeWidth="6" />
      </svg>
      <div className="absolute left-[12%] top-[15%] rounded-full border border-white/[0.06] bg-[#192638]/85 px-2 py-1 text-[9px] font-medium tracking-wide text-slate-500">EDAPPALLY TOLL</div>
      <div className="absolute right-[12%] top-[22%] rounded-full border border-white/[0.06] bg-[#192638]/85 px-2 py-1 text-[9px] font-medium tracking-wide text-slate-500">NH 66</div>
      <div className="absolute bottom-[13%] left-[25%] rounded-full border border-white/[0.06] bg-[#192638]/85 px-2 py-1 text-[9px] font-medium tracking-wide text-slate-500">PONEKKARA RD</div>
      {vehicles.map((vehicle) => {
        const VehicleIcon = vehicle.icon
        return (
          <button key={vehicle.id} type="button" onClick={() => onVehicle(vehicle)} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110" style={{ left: vehicle.left, top: vehicle.top }} aria-label={`${vehicle.title}, ${vehicle.eta} away`}>
            <span className="relative flex size-8 items-center justify-center rounded-full border border-cyan-300/35 bg-[#10283a] text-cyan-200 shadow-[0_0_18px_rgba(0,229,255,0.22)]"><VehicleIcon size={15} /><span className="absolute -right-1 -top-1 size-2 rounded-full border border-[#101a29] bg-emerald-400" /></span>
            <span className="mt-1 block whitespace-nowrap rounded-full border border-white/[0.08] bg-[#0b111c]/90 px-2 py-1 text-[9px] font-semibold text-slate-200 shadow-lg">{vehicle.eta} away</span>
          </button>
        )
      })}
      <div className="absolute left-[49%] top-[47%] z-20 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-[-12px] animate-ping rounded-full bg-cyan-400/15" />
        <span className="relative flex size-9 items-center justify-center rounded-full border-2 border-[#06111a] bg-cyan-300 text-[#06202c] shadow-[0_0_25px_rgba(0,229,255,0.55)]"><Navigation size={16} fill="currentColor" /></span>
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-[#0c1420]/90 px-2.5 py-1.5 text-[9px] font-medium text-slate-400"><span className="size-1.5 rounded-full bg-emerald-400" /> 3 responders nearby</div>
      <button type="button" aria-label="Recenter map" className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full border border-white/10 bg-[#0c1420]/90 text-slate-300"><Crosshair size={14} /></button>
    </section>
  )
}

export default function AutozyncApp() {
  const [role, setRole] = useState<Role>('customer')
  const [tab, setTab] = useState<Tab>('home')
  const [vehicleType, setVehicleType] = useState('Car')
  const [selectedService, setSelectedService] = useState<Service>('Flatbed Towing')
  const [modal, setModal] = useState<'voice' | 'call' | 'booking' | 'hire' | 'request' | null>(null)
  const [pickedVehicle, setPickedVehicle] = useState<typeof vehicles[number] | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [listening, setListening] = useState(false)
  const [callSeconds, setCallSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(true)
  const [online, setOnline] = useState(true)
  const [jobAccepted, setJobAccepted] = useState(false)
  const [jobStep, setJobStep] = useState(0)
  const [offerName, setOfferName] = useState('')
  const [offerDiscount, setOfferDiscount] = useState('')
  const [offerExpiry, setOfferExpiry] = useState('')
  const [customOffers, setCustomOffers] = useState<Offer[]>([])
  const [bookingSlot, setBookingSlot] = useState('10:30 AM')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (modal !== 'call') return
    const interval = window.setInterval(() => setCallSeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(interval)
  }, [modal])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const startCall = () => {
    setCallSeconds(0)
    setMuted(false)
    setModal('call')
  }

  const chooseVoiceCommand = (phrase: string) => {
    setSelectedService(phrase.includes('towing') ? 'Flatbed Towing' : phrase.includes('battery') ? 'Battery Jumpstart' : 'Tyre Puncture')
    setListening(false)
    setModal(null)
    setTab('sos')
    notify(`Service selected: ${phrase.includes('towing') ? 'Flatbed Towing' : phrase.includes('battery') ? 'Battery Jumpstart' : 'Tyre Puncture'}`)
  }

  const openBooking = (offer: Offer) => {
    setSelectedOffer(offer)
    setModal('booking')
  }

  const publishOffer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!offerName.trim() || !offerDiscount.trim() || !offerExpiry) return
    const offer: Offer = { name: offerName.trim(), price: `${offerDiscount}% OFF`, note: 'New partner offer', icon: Star, color: 'blue', discount: `${offerDiscount}% OFF` }
    setCustomOffers((current) => [offer, ...current])
    setOfferName('')
    setOfferDiscount('')
    setOfferExpiry('')
    notify('Your offer is live in Garage Deals')
  }

  const allOffers = [...customOffers, ...baseOffers]
  const displayedCallName = role === 'customer' ? 'Rajesh K.' : 'Customer · Swift Dzire'
  const formattedDuration = `${String(Math.floor(callSeconds / 60)).padStart(2, '0')}:${String(callSeconds % 60).padStart(2, '0')}`

  const goToTab = (nextTab: Tab) => {
    setTab(nextTab)
    document.querySelector('.scroll-panel')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-[100dvh] bg-[#080c13] text-slate-100 sm:flex sm:justify-center sm:bg-[radial-gradient(ellipse_at_50%_0%,#122439_0%,#080c13_58%)]">
      <div className="app-shell relative flex h-[100dvh] min-h-[100dvh] w-full max-w-[460px] flex-col overflow-hidden border-x border-white/[0.055] bg-[#0a0f18] shadow-[0_0_90px_rgba(0,0,0,0.42)]">
        <div className="relative z-30 flex h-[52px] shrink-0 items-center justify-center border-b border-white/[0.055] bg-[#0e1521] px-3">
          <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#151f2e] p-1 text-[10px]">
            <span className="px-1.5 font-medium text-slate-500">Viewing as</span>
            <button type="button" onClick={() => { setRole('customer'); setTab('home') }} className={`rounded-full px-3 py-1.5 font-semibold transition ${role === 'customer' ? 'bg-cyan-300 text-[#07131c] shadow-[0_2px_12px_rgba(0,229,255,0.23)]' : 'text-slate-400 hover:text-white'}`}>Customer</button>
            <button type="button" onClick={() => { setRole('partner'); setTab('home') }} className={`rounded-full px-3 py-1.5 font-semibold transition ${role === 'partner' ? 'bg-cyan-300 text-[#07131c] shadow-[0_2px_12px_rgba(0,229,255,0.23)]' : 'text-slate-400 hover:text-white'}`}>Garage Partner</button>
          </div>
          <span className="absolute right-3 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600"><span className="size-1.5 rounded-full bg-emerald-400" /> Live</span>
        </div>

        <main className="scroll-panel flex-1 overflow-y-auto overscroll-contain pb-5 scrollbar-none">
          {role === 'customer' ? (
            <>
              <header className="flex items-center justify-between px-5 pb-3 pt-4">
                <div className="flex items-center gap-3"><GearMark /><div><div className="text-[17px] font-bold tracking-[-0.04em] text-white">autozync<span className="text-cyan-300">.</span></div><div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">Mobility, in sync</div></div></div>
                <div className="flex items-center gap-2"><div className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-[#121b29] px-2.5 py-2 text-[10px] font-medium text-slate-300"><MapPin size={12} className="text-cyan-300" /><span>Edappally, Kochi</span><span className="ml-0.5 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[8px] font-bold text-emerald-300">GPS</span></div><IconButton label="Notifications" onClick={() => notify('You are all caught up')}><Bell size={16} /></IconButton></div>
              </header>

              {(tab === 'home' || tab === 'sos') && <div className="px-4">
                <div className="mb-2 flex items-center justify-between"><div><p className="eyebrow">LIVE RECOVERY NETWORK</p><h1 className="mt-1 text-[15px] font-semibold tracking-tight">Help is close by<span className="text-cyan-300">.</span></h1></div><span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500"><span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00e5ff]" /> Live map</span></div>
                <MapSimulation onVehicle={(vehicle) => { setPickedVehicle(vehicle); setModal('hire') }} />
              </div>}

              {(tab === 'home' || tab === 'sos') && <section className="px-4 pt-5">
                <div className="relative overflow-hidden rounded-[25px] border border-cyan-300/20 bg-[linear-gradient(140deg,#142c3b_0%,#10202e_54%,#151f31_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]">
                  <div className="pointer-events-none absolute -right-7 -top-10 size-40 rounded-full border border-cyan-300/[0.08]" /><div className="pointer-events-none absolute -right-1 -top-4 size-28 rounded-full border border-cyan-300/[0.07]" />
                  <div className="relative flex items-start justify-between"><div><div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.17em] text-cyan-200"><Siren size={12} /> 24/7 roadside response</div><h2 className="mt-2 text-[19px] font-bold tracking-[-0.04em] text-white">Quick Breakdown SOS</h2><p className="mt-1 max-w-[240px] text-[11px] leading-relaxed text-slate-400">Tell us what happened. A verified pro is already nearby.</p></div><button type="button" onClick={() => { setListening(true); setModal('voice') }} aria-label="Open voice assistant" className="voice-glow relative flex size-[52px] shrink-0 items-center justify-center rounded-2xl border border-cyan-200/30 bg-cyan-300 text-[#08202a] shadow-[0_0_26px_rgba(0,229,255,0.2)] transition hover:scale-105 active:scale-95"><Mic size={21} /></button></div>
                  <div className="relative mt-4 flex rounded-xl border border-white/[0.07] bg-[#09131e]/55 p-1">
                    {['Car', 'Bike', 'Commercial'].map((type) => <button type="button" key={type} onClick={() => setVehicleType(type)} className={`flex-1 rounded-lg py-2 text-[10px] font-semibold transition ${vehicleType === type ? 'bg-[#203449] text-cyan-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>{type}</button>)}
                  </div>
                  <div className="relative mt-4 grid grid-cols-2 gap-2">
                    {services.map((service) => { const ServiceIcon = service.icon; const active = selectedService === service.name; return <button type="button" key={service.name} onClick={() => setSelectedService(service.name)} className={`group rounded-[15px] border p-3 text-left transition duration-200 ${active ? 'border-cyan-300/45 bg-cyan-300/[0.11] shadow-[0_0_18px_rgba(0,229,255,0.08)]' : 'border-white/[0.07] bg-[#101b28]/80 hover:border-cyan-300/25 hover:bg-[#152638]'}`}><div className="flex items-start justify-between"><span className={`flex size-8 items-center justify-center rounded-[10px] ${active ? 'bg-cyan-300 text-[#09202b]' : 'bg-[#213246] text-cyan-200'}`}><ServiceIcon size={16} /></span>{active && <Check size={13} className="text-cyan-200" />}</div><span className="mt-2.5 block text-[11px] font-semibold leading-tight text-slate-100">{service.name === 'Tyre Puncture' ? 'Tyre Puncture / Air' : service.name === 'Battery Jumpstart' ? 'Battery / EV Charge' : service.name}</span><span className="mt-1 block text-[9px] text-slate-500">{service.price}</span></button> })}
                  </div>
                  <button type="button" onClick={() => setModal('request')} className="relative mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 text-[12px] font-bold text-[#07141d] shadow-[0_8px_24px_rgba(0,229,255,0.18)] transition hover:bg-cyan-200 active:scale-[0.99]"><Siren size={15} /> Request {selectedService}<ArrowRight size={14} /></button>
                </div>
              </section>}

              {(tab === 'home' || tab === 'sos') && <section className="px-4 pt-4">
                <div className="rounded-[22px] border border-[#2a3850] bg-[#141e2d] p-4">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Navigation size={17} /></div><div><div className="text-[12px] font-semibold text-white">Mechanic assigned</div><div className="mt-0.5 text-[10px] text-slate-400">Rajesh K. <span className="text-amber-300">★ 4.9</span></div></div></div><div className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-2.5 py-1.5 text-[9px] font-semibold text-cyan-200">EN ROUTE · 6 MIN</div></div>
                  <div className="my-3.5 h-px bg-white/[0.06]" />
                  <button type="button" onClick={startCall} className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/[0.09] py-3 text-[11px] font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.16]"><ShieldCheck size={15} /> Call via Autozync <span className="text-cyan-300/60">·</span> Encrypted &amp; Masked</button>
                  <p className="mt-2 flex items-center justify-center gap-1 text-[9px] text-slate-500"><Shield size={10} className="text-emerald-400" /> Your phone number stays 100% private</p>
                </div>
              </section>}

              {(tab === 'home' || tab === 'deals') && <section className="pt-5">
                <div className="flex items-end justify-between px-5"><div><p className="eyebrow">CURATED FOR YOUR RIDE</p><h2 className="mt-1 text-[16px] font-semibold tracking-tight">Garage deals</h2></div><button type="button" onClick={() => goToTab('deals')} className="flex items-center gap-1 text-[10px] font-semibold text-cyan-300">View all <ChevronRight size={13} /></button></div>
                <div className="no-scrollbar mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
                  {allOffers.map((offer, index) => { const OfferIcon = offer.icon; return <button type="button" key={`${offer.name}-${index}`} onClick={() => openBooking(offer)} className={`relative min-w-[218px] snap-start overflow-hidden rounded-[20px] border border-white/[0.075] bg-[linear-gradient(140deg,#182536,#111a28)] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/25`}><span className={`absolute -right-6 -top-6 size-24 rounded-full blur-2xl ${offer.color === 'amber' ? 'bg-amber-400/10' : 'bg-cyan-300/10'}`} />{offer.discount && <span className="absolute right-3 top-3 rounded-full border border-cyan-300/20 bg-cyan-300/[0.1] px-2 py-1 text-[8px] font-bold tracking-wide text-cyan-200">{offer.discount}</span>}<span className="relative flex size-9 items-center justify-center rounded-xl border border-white/[0.07] bg-[#203147] text-cyan-200"><OfferIcon size={17} /></span><span className="relative mt-3 block text-[12px] font-semibold text-slate-100">{offer.name}</span><span className="relative mt-1 block text-[9px] text-slate-500">{offer.note}</span><span className="relative mt-3 flex items-center justify-between"><span className="text-[16px] font-bold tracking-tight text-white">{offer.price}</span><span className="flex size-7 items-center justify-center rounded-full bg-white/[0.07] text-cyan-200"><ArrowRight size={13} /></span></span></button> })}
                </div>
              </section>}

              {tab === 'profile' && <section className="px-4 pt-3"><p className="eyebrow">YOUR AUTOZYNC</p><h1 className="mt-1 text-[22px] font-bold tracking-tight">Profile &amp; vehicles</h1><div className="mt-5 rounded-[22px] border border-[#29364a] bg-[#141e2d] p-4"><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200"><CarFront size={22} /></div><div><div className="text-sm font-semibold">My vehicles</div><div className="mt-1 text-[10px] text-slate-500">Manage vehicles for faster support</div></div><ChevronRight className="ml-auto text-slate-500" size={17} /></div><div className="mt-4 rounded-xl border border-white/[0.06] bg-[#101826] p-3"><div className="flex items-center gap-2 text-[11px] font-semibold"><CarFront size={14} className="text-cyan-300" /> Hyundai Creta · KL 07 CX 2481</div><div className="mt-1 pl-6 text-[9px] text-slate-500">2022 · Petrol · {vehicleType} assistance</div></div></div><div className="mt-3 grid grid-cols-2 gap-3">{[{ icon: Wallet, title: 'Payments', subtitle: 'Saved methods' }, { icon: CircleHelp, title: 'Help center', subtitle: 'We are here 24/7' }].map(({ icon: ItemIcon, title, subtitle }) => <button key={title} type="button" onClick={() => notify(`${title} is ready`)} className="rounded-[18px] border border-white/[0.07] bg-[#141e2d] p-4 text-left"><ItemIcon size={17} className="text-cyan-300" /><div className="mt-3 text-[11px] font-semibold">{title}</div><div className="mt-1 text-[9px] text-slate-500">{subtitle}</div></button>)}</div></section>}
            </>
          ) : (
            <>
              <header className="px-5 pb-4 pt-5">
                <div className="flex items-start justify-between"><div className="flex items-center gap-3"><GearMark /><div><div className="flex items-center gap-1.5 text-[15px] font-bold tracking-tight">Star Auto Care <BadgeCheck size={14} className="text-cyan-300" /></div><div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500"><MapPin size={11} /> Edappally, Kochi · Verified partner</div></div></div><IconButton label="Partner notifications" onClick={() => notify('No new partner notifications')}><Bell size={16} /></IconButton></div>
                <button type="button" onClick={() => setOnline((value) => !value)} className={`mt-4 flex w-full items-center justify-between rounded-[15px] border px-3.5 py-3 transition ${online ? 'border-emerald-400/15 bg-emerald-400/[0.07]' : 'border-white/[0.08] bg-[#141c29]'}`}><span className="flex items-center gap-2 text-[11px] font-semibold"><span className={`relative flex size-2 rounded-full ${online ? 'bg-emerald-400' : 'bg-slate-600'}`}>{online && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />}</span>{online ? 'Online · Ready for jobs' : 'Offline · Not taking jobs'}</span><span className={`relative h-[21px] w-[37px] rounded-full transition ${online ? 'bg-emerald-400/70' : 'bg-slate-700'}`}><span className={`absolute top-[3px] size-[15px] rounded-full bg-white transition-all ${online ? 'left-[19px]' : 'left-[3px]'}`} /></span></button>
              </header>

              {tab === 'home' && <>
                <section className="px-4"><div className="grid grid-cols-3 gap-2.5">{[{ icon: Wallet, label: "Today's earnings", value: '₹4,850', sub: '+12% this week' }, { icon: CheckCircle2, label: 'Jobs done', value: '04', sub: 'Today' }, { icon: Star, label: 'Partner rating', value: '4.9', sub: '128 reviews' }].map(({ icon: MetricIcon, label, value, sub }) => <div key={label} className="rounded-[18px] border border-white/[0.07] bg-[#141e2c] p-3"><span className="flex size-7 items-center justify-center rounded-lg bg-cyan-300/[0.09] text-cyan-200"><MetricIcon size={14} /></span><div className="mt-3 text-[16px] font-bold tracking-tight text-white">{value}</div><div className="mt-0.5 truncate text-[9px] font-medium text-slate-400">{label}</div><div className="mt-1 text-[8px] text-slate-600">{sub}</div></div>)}</div></section>
                {!jobAccepted && <section className="px-4 pt-5"><div className="mb-3 flex items-center justify-between"><div><p className="eyebrow">DISPATCH RADAR</p><h1 className="mt-1 text-[17px] font-semibold tracking-tight">Incoming job</h1></div><span className="flex items-center gap-1.5 rounded-full border border-amber-300/15 bg-amber-300/[0.08] px-2.5 py-1.5 text-[9px] font-semibold text-amber-200"><span className="size-1.5 animate-pulse rounded-full bg-amber-300" /> NEW REQUEST</span></div>
                  <div className="relative overflow-hidden rounded-[23px] border border-amber-300/20 bg-[linear-gradient(145deg,#292416,#1a1d24_60%,#15202b)] p-4"><div className="absolute -right-8 -top-8 size-32 rounded-full bg-amber-400/[0.06] blur-2xl"/><div className="relative flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-[14px] border border-amber-200/10 bg-amber-300/[0.1] text-amber-200"><CarFront size={22} /></div><div><div className="text-[14px] font-semibold text-white">Swift Dzire</div><div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><BatteryWarning size={12} className="text-amber-300" /> Flat tyre &amp; battery issue</div></div></div><div className="relative mt-4 grid grid-cols-3 gap-2 rounded-[13px] border border-white/[0.06] bg-black/15 p-3"><div><div className="text-[8px] uppercase tracking-wider text-slate-500">Distance</div><div className="mt-1 text-[11px] font-semibold">2.1 km</div><div className="text-[8px] text-slate-500">near Bypass</div></div><div className="border-x border-white/[0.07] px-3"><div className="text-[8px] uppercase tracking-wider text-slate-500">Payout</div><div className="mt-1 text-[14px] font-bold text-emerald-300">₹650</div><div className="text-[8px] text-slate-500">estimated</div></div><div className="pl-1"><div className="text-[8px] uppercase tracking-wider text-slate-500">Response</div><div className="mt-1 flex items-center gap-1 text-[11px] font-semibold"><Clock3 size={11} className="text-cyan-300" /> 25s</div><div className="text-[8px] text-slate-500">to accept</div></div></div><div className="relative mt-3 flex gap-2"><button type="button" disabled={!online} onClick={() => { setJobAccepted(true); setJobStep(0); goToTab('home') }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 text-[11px] font-bold text-[#07141d] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"><Check size={15} /> Accept job</button><button type="button" onClick={() => notify('Job declined · Looking for another partner')} className="rounded-xl border border-white/[0.09] bg-white/[0.035] px-5 text-[11px] font-semibold text-slate-300 transition hover:bg-white/[0.08]">Decline</button></div></div>
                </section>}

                {jobAccepted && <section className="px-4 pt-5"><div className="flex items-center justify-between"><div><p className="eyebrow">ACTIVE DISPATCH</p><h1 className="mt-1 text-[17px] font-semibold tracking-tight">Job in progress</h1></div><span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.08] px-2.5 py-1.5 text-[9px] font-bold text-cyan-200">JOB #AZ-2847</span></div><div className="mt-3 rounded-[22px] border border-[#29364a] bg-[#141e2d] p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><CarFront size={19} /></span><div><div className="text-[12px] font-semibold">Swift Dzire</div><div className="mt-1 text-[9px] text-slate-500">Flat tyre &amp; battery · ₹650</div></div></div><span className="text-[9px] font-semibold text-emerald-300">2.1 km</span></div><div className="mt-5">{['Accepted', 'En Route', 'Arrived at Spot', 'Completed'].map((step, index) => <button key={step} type="button" onClick={() => { if (index <= jobStep + 1) { setJobStep(index); if (index === 3) notify('Job completed · ₹650 added to earnings') } }} className="flex w-full items-center gap-3 text-left"><span className={`relative flex size-6 shrink-0 items-center justify-center rounded-full border ${index <= jobStep ? 'border-cyan-300 bg-cyan-300 text-[#07141d]' : 'border-slate-700 bg-[#101725] text-slate-600'}`}>{index < jobStep ? <Check size={12} /> : <span className="text-[9px] font-bold">{index + 1}</span>}{index < 3 && <span className={`absolute left-[10px] top-6 h-[19px] w-px ${index < jobStep ? 'bg-cyan-300/55' : 'bg-slate-700'}`} />}</span><span className={`py-2.5 text-[10px] font-semibold ${index === jobStep ? 'text-white' : index < jobStep ? 'text-cyan-200' : 'text-slate-600'}`}>{step}</span><span className="ml-auto">{index === jobStep && <span className="rounded-full bg-cyan-300/10 px-2 py-1 text-[8px] font-bold text-cyan-200">CURRENT</span>}</span></button>)}</div><button type="button" onClick={startCall} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] py-3 text-[10px] font-semibold text-cyan-100"><ShieldCheck size={14} /> Call Customer via Masked Relay</button><button type="button" onClick={() => { setJobAccepted(false); setJobStep(0); notify('Job closed') }} className="mt-2 w-full py-2 text-[9px] font-medium text-slate-500">Close job</button></div></section>}
              </>
              }

              {tab === 'sos' && <section className="px-4 pt-2"><div className="rounded-[22px] border border-[#29364a] bg-[#141e2d] p-4"><p className="eyebrow">SERVICE ACTIVITY</p><h2 className="mt-1 text-[17px] font-semibold">Dispatch history</h2><div className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#101725] p-3"><span className="flex size-9 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300"><CheckCircle2 size={17} /></span><div><div className="text-[11px] font-semibold">Battery jumpstart · completed</div><div className="mt-1 text-[9px] text-slate-500">Today, 9:18 AM · 4.8 km away</div></div><span className="ml-auto text-[10px] font-semibold text-slate-300">₹450</span></div><div className="mt-2 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#101725] p-3"><span className="flex size-9 items-center justify-center rounded-xl bg-blue-300/10 text-blue-300"><Truck size={17} /></span><div><div className="text-[11px] font-semibold">Flatbed towing · completed</div><div className="mt-1 text-[9px] text-slate-500">12 Aug · 3.2 km away</div></div><span className="ml-auto text-[10px] font-semibold text-slate-300">₹1,200</span></div></div></section>}

              {tab === 'deals' && <section className="px-4 pt-2"><p className="eyebrow">PARTNER MARKETPLACE</p><h1 className="mt-1 text-[21px] font-bold tracking-tight">Garage deals</h1><p className="mt-1 text-[10px] text-slate-500">Offers customers can book directly through Autozync.</p><div className="mt-4 flex flex-col gap-3">{allOffers.map((offer, index) => { const DealIcon = offer.icon; return <div key={`${offer.name}-${index}`} className="flex items-center gap-3 rounded-[18px] border border-white/[0.07] bg-[#141e2c] p-3"><span className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/[0.09] text-cyan-200"><DealIcon size={18} /></span><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">{offer.name}</div><div className="mt-1 truncate text-[9px] text-slate-500">{offer.note}</div></div><span className="text-[12px] font-bold text-cyan-200">{offer.price}</span></div> })}</div></section>}

              {tab === 'profile' && <section className="px-4 pt-2"><p className="eyebrow">PARTNER HUB</p><h1 className="mt-1 text-[21px] font-bold tracking-tight">Grow with Autozync</h1><div className="mt-4 rounded-[22px] border border-[#29364a] bg-[#141e2d] p-4"><span className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><Activity size={19} /></span><div className="mt-3 text-[13px] font-semibold">Your partner performance</div><p className="mt-1 text-[10px] leading-relaxed text-slate-500">Your verified workshop is visible to drivers within 15 km. Keep your availability updated to receive the best-fit jobs.</p><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#101725] p-3"><div className="text-[8px] uppercase tracking-wider text-slate-500">This month</div><div className="mt-1 text-[15px] font-bold">₹32,400</div></div><div className="rounded-xl bg-[#101725] p-3"><div className="text-[8px] uppercase tracking-wider text-slate-500">Response rate</div><div className="mt-1 text-[15px] font-bold">96%</div></div></div></div></section>}

              <section className="px-4 pt-5"><div className="mb-3 flex items-center justify-between"><div><p className="eyebrow">MARKETPLACE</p><h2 className="mt-1 text-[15px] font-semibold">Garage offers</h2></div><span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2 py-1 text-[8px] font-bold text-emerald-200">CUSTOMER VISIBLE</span></div><form onSubmit={publishOffer} className="rounded-[20px] border border-[#29364a] bg-[#141e2d] p-4"><div className="mb-3 flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200"><Plus size={16} /></span><div className="text-[11px] font-semibold">Post new special offer</div></div><label className="mb-1.5 block text-[9px] font-medium text-slate-500" htmlFor="offer-name">Service name</label><input id="offer-name" value={offerName} onChange={(event) => setOfferName(event.target.value)} required placeholder="e.g. Full body ceramic coating" className="mb-3 w-full rounded-xl border border-white/[0.08] bg-[#0e1622] px-3 py-2.5 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50"/><div className="grid grid-cols-2 gap-3"><div><label className="mb-1.5 block text-[9px] font-medium text-slate-500" htmlFor="offer-discount">Discount (%)</label><input id="offer-discount" type="number" min="1" max="90" value={offerDiscount} onChange={(event) => setOfferDiscount(event.target.value)} required placeholder="20" className="w-full rounded-xl border border-white/[0.08] bg-[#0e1622] px-3 py-2.5 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50"/></div><div><label className="mb-1.5 block text-[9px] font-medium text-slate-500" htmlFor="offer-expiry">Expiry date</label><input id="offer-expiry" type="date" value={offerExpiry} onChange={(event) => setOfferExpiry(event.target.value)} required className="w-full rounded-xl border border-white/[0.08] bg-[#0e1622] px-3 py-2.5 text-[10px] text-slate-300 outline-none focus:border-cyan-300/50"/></div></div><button type="submit" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 text-[10px] font-bold text-[#07141d] transition hover:bg-cyan-200"><Plus size={14} /> Publish offer</button></form><div className="mt-3 flex flex-col gap-2">{customOffers.map((offer, index) => <div key={`${offer.name}-${index}`} className="flex items-center gap-3 rounded-[16px] border border-cyan-300/15 bg-cyan-300/[0.045] p-3"><span className="flex size-8 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200"><Star size={15} /></span><div className="min-w-0 flex-1"><div className="truncate text-[10px] font-semibold">{offer.name}</div><div className="mt-0.5 text-[8px] text-slate-500">Live in customer Garage Deals</div></div><span className="text-[10px] font-bold text-cyan-200">{offer.price}</span></div>)}</div></section>
            </>
          )}
        </main>

        <nav aria-label="Main navigation" className="z-20 grid h-[70px] shrink-0 grid-cols-4 border-t border-white/[0.06] bg-[#0c131e]/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-xl">
          {[{ id: 'home' as const, label: 'Home', icon: role === 'customer' ? Navigation : Activity }, { id: 'sos' as const, label: role === 'customer' ? 'Active SOS' : 'Dispatch', icon: role === 'customer' ? Siren : Radio }, { id: 'deals' as const, label: role === 'customer' ? 'Garage deals' : 'Marketplace', icon: role === 'customer' ? Star : Plus }, { id: 'profile' as const, label: 'Profile', icon: role === 'customer' ? CarFront : Cog }].map(({ id, label, icon: TabIcon }) => <button key={id} type="button" onClick={() => goToTab(id)} aria-current={tab === id ? 'page' : undefined} className={`flex flex-col items-center justify-center gap-1 rounded-xl transition ${tab === id ? 'text-cyan-200' : 'text-slate-600 hover:text-slate-300'}`}><span className={`flex size-7 items-center justify-center rounded-[10px] ${tab === id ? 'bg-cyan-300/[0.1]' : ''}`}><TabIcon size={16} strokeWidth={tab === id ? 2.2 : 1.7} /></span><span className="text-[8px] font-semibold">{label}</span></button>)}
        </nav>

        {toast && <div role="status" className="absolute bottom-[80px] left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-300/20 bg-[#172536] px-4 py-2.5 text-[10px] font-medium text-cyan-100 shadow-xl animate-toast">{toast}</div>}

        {modal === 'voice' && <ModalFrame label="Voice assistant" onClose={() => { setModal(null); setListening(false) }}><div className="flex items-center justify-between px-5 pt-5"><div className="flex items-center gap-2 text-[11px] font-semibold"><span className="flex size-8 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><Waves size={16} /></span> Autozync voice assist</div><IconButton label="Close voice assistant" onClick={() => { setModal(null); setListening(false) }}><X size={16} /></IconButton></div><div className="px-6 pb-7 pt-7 text-center"><div className="relative mx-auto flex size-[114px] items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-300/[0.045]"><span className="absolute inset-2 animate-pulse rounded-full border border-cyan-300/20"/><span className="absolute inset-5 rounded-full border border-cyan-300/15"/><button type="button" onClick={() => setListening((value) => !value)} aria-label={listening ? 'Stop listening' : 'Start listening'} className="relative flex size-[68px] items-center justify-center rounded-full bg-cyan-300 text-[#08202a] shadow-[0_0_30px_rgba(0,229,255,0.26)]"><Mic size={25} /></button></div><div className="mt-5 text-[17px] font-semibold">{listening ? 'Listening…' : 'Tap to speak'}</div><p className="mx-auto mt-2 max-w-[270px] text-[11px] leading-relaxed text-slate-500">Try saying 'I have a flat tyre' or 'Need towing'</p><div className="voice-bars mt-5 flex h-8 items-center justify-center gap-1" aria-hidden="true">{Array.from({ length: 25 }, (_, index) => <span key={index} style={{ animationDelay: `${index * 45}ms` }} />)}</div><p className="mt-5 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">Try a quick command</p><div className="mt-2 grid grid-cols-1 gap-2">{['I have a flat tyre', 'Need towing', 'Battery is dead'].map((phrase) => <button key={phrase} type="button" onClick={() => chooseVoiceCommand(phrase.toLowerCase())} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3 text-left text-[10px] font-medium text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.06]"><span className="flex items-center gap-2"><Mic size={13} className="text-cyan-300" /> {phrase}</span><ArrowRight size={13} className="text-slate-600" /></button>)}</div></div></ModalFrame>}

        {modal === 'call' && <ModalFrame full label="Secure relay call" onClose={() => setModal(null)}><div className="flex h-full flex-col items-center bg-[radial-gradient(ellipse_at_50%_28%,#162c41_0%,#101a28_36%,#0b111b_78%)] px-6 pb-8 pt-5"><div className="flex w-full items-center justify-between"><IconButton label="Close call" onClick={() => setModal(null)}><ArrowLeft size={17} /></IconButton><div className="flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1.5 text-[9px] font-semibold text-emerald-200"><ShieldCheck size={12} /> SECURE RELAY</div><div className="size-10" /></div><div className="mt-14 flex flex-col items-center"><div className="relative flex size-[120px] items-center justify-center rounded-full border border-cyan-300/20 bg-[#172a3c] shadow-[0_0_45px_rgba(0,229,255,0.12)]"><span className="absolute inset-2 animate-pulse rounded-full border border-cyan-300/15"/><div className="flex size-[78px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-300/20 to-blue-400/10 text-cyan-200"><Headphones size={34} strokeWidth={1.5} /></div><span className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full border-2 border-[#142336] bg-emerald-400 text-[#06150d]"><Check size={13} /></span></div><div className="mt-7 text-[20px] font-semibold tracking-tight">{displayedCallName}</div><div className="mt-1 text-[11px] text-slate-400">{role === 'customer' ? 'Roadside technician' : 'Customer · Swift Dzire'}</div><div className="mt-2 flex items-center gap-1 text-[10px] text-cyan-200"><span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> Autozync Secure Relay…</div><div className="mt-6 font-mono text-[18px] tracking-[0.14em] text-slate-200">{formattedDuration}</div><div className="mt-2 flex items-center gap-1 text-[9px] text-slate-500"><LockGlyph /> Number masking enabled</div></div><div className="mt-auto flex w-full items-center justify-center gap-5 pb-7 pt-12"><button type="button" onClick={() => setMuted((value) => !value)} className={`flex size-[58px] flex-col items-center justify-center gap-1 rounded-[20px] border transition ${muted ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100' : 'border-white/[0.08] bg-white/[0.04] text-slate-300'}`}>{muted ? <VolumeX size={18} /> : <Mic size={18} />}<span className="text-[8px]">{muted ? 'Muted' : 'Mute'}</span></button><button type="button" onClick={() => setModal(null)} aria-label="End call" className="flex size-[70px] items-center justify-center rounded-[24px] bg-[#f0444c] text-white shadow-[0_8px_28px_rgba(240,68,76,0.25)] transition hover:scale-105 hover:bg-red-400 active:scale-95"><Phone size={24} className="rotate-[135deg]" fill="currentColor" /></button><button type="button" onClick={() => setSpeaker((value) => !value)} className={`flex size-[58px] flex-col items-center justify-center gap-1 rounded-[20px] border transition ${speaker ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100' : 'border-white/[0.08] bg-white/[0.04] text-slate-300'}`}>{speaker ? <Volume2 size={18} /> : <Speaker size={18} />}<span className="text-[8px]">Speaker</span></button></div><div className="text-center text-[8px] text-slate-600">Your personal number is never shared with the other caller.</div></div></ModalFrame>}

        {modal === 'booking' && selectedOffer && <ModalFrame label={`Book ${selectedOffer.name}`} onClose={() => setModal(null)}><div className="flex items-center justify-between px-5 pt-5"><div><p className="eyebrow">VERIFIED GARAGE DEAL</p><h2 className="mt-1 text-[16px] font-semibold">Book a service slot</h2></div><IconButton label="Close booking" onClick={() => setModal(null)}><X size={16} /></IconButton></div><div className="px-5 pb-6 pt-4"><div className="flex items-center gap-3 rounded-[16px] border border-cyan-300/15 bg-cyan-300/[0.055] p-3"><span className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><selectedOffer.icon size={18} /></span><div className="min-w-0 flex-1"><div className="text-[11px] font-semibold">{selectedOffer.name}</div><div className="mt-1 text-[9px] text-slate-500">{selectedOffer.note}</div></div><span className="text-[13px] font-bold text-cyan-200">{selectedOffer.price}</span></div><div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-slate-300"><CalendarDays size={14} className="text-cyan-300" /> Choose a time · Today</div><div className="mt-3 grid grid-cols-3 gap-2">{['10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '06:00 PM'].map((slot) => <button key={slot} type="button" onClick={() => setBookingSlot(slot)} className={`rounded-xl border py-2.5 text-[9px] font-semibold transition ${bookingSlot === slot ? 'border-cyan-300/45 bg-cyan-300/[0.1] text-cyan-100' : 'border-white/[0.07] bg-white/[0.025] text-slate-400 hover:border-white/20'}`}>{slot}</button>)}</div><div className="mt-4 flex items-center gap-2 rounded-xl bg-[#0d1521] p-3 text-[9px] text-slate-500"><MapPin size={13} className="text-cyan-300" /> Star Auto Care · 1.4 km away · Edappally</div><button type="button" onClick={() => { setModal(null); notify(`Slot requested for ${bookingSlot}`) }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 text-[11px] font-bold text-[#07141d]"><Check size={14} /> Request this slot</button></div></ModalFrame>}

        {modal === 'hire' && pickedVehicle && <ModalFrame label={`Hire ${pickedVehicle.title}`} onClose={() => setModal(null)}><div className="flex items-center justify-between px-5 pt-5"><div><p className="eyebrow">NEARBY RESPONDER</p><h2 className="mt-1 text-[16px] font-semibold">Quick hire summary</h2></div><IconButton label="Close" onClick={() => setModal(null)}><X size={16} /></IconButton></div><div className="px-5 pb-6 pt-4"><div className="flex items-center gap-3 rounded-[16px] border border-white/[0.07] bg-[#0e1724] p-3.5"><span className="flex size-11 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><pickedVehicle.icon size={19} /></span><div className="flex-1"><div className="text-[12px] font-semibold">{pickedVehicle.title}</div><div className="mt-1 text-[9px] text-slate-500">{pickedVehicle.subtitle} · Verified</div></div><span className="rounded-full bg-emerald-300/[0.08] px-2 py-1 text-[9px] font-semibold text-emerald-200">★ 4.9</span></div><div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.06] px-3.5 py-3"><span className="text-[10px] text-slate-400">Estimated arrival</span><span className="flex items-center gap-1.5 text-[11px] font-semibold text-white"><Clock3 size={13} className="text-cyan-300" /> {pickedVehicle.eta}</span></div><button type="button" onClick={() => { setSelectedService(pickedVehicle.id === 'van' ? 'Flatbed Towing' : pickedVehicle.id === 'van2' ? 'Battery Jumpstart' : 'On-Site Mechanic'); setModal('request') }} className="mt-4 w-full rounded-xl bg-cyan-300 py-3 text-[11px] font-bold text-[#07141d]">Request this responder</button></div></ModalFrame>}

        {modal === 'request' && <ModalFrame label="Confirm roadside assistance" onClose={() => setModal(null)}><div className="flex items-center justify-between px-5 pt-5"><div><p className="eyebrow">CONFIRM YOUR REQUEST</p><h2 className="mt-1 text-[16px] font-semibold">A pro is on the way</h2></div><IconButton label="Close" onClick={() => setModal(null)}><X size={16} /></IconButton></div><div className="px-5 pb-6 pt-4"><div className="rounded-[17px] border border-cyan-300/15 bg-cyan-300/[0.055] p-4"><div className="flex items-center gap-2 text-[11px] font-semibold text-white"><span className="flex size-8 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200"><Siren size={16} /></span>{selectedService}</div><div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[9px]"><span className="text-slate-500">Vehicle</span><span className="font-semibold text-slate-200">{vehicleType} · Hyundai Creta</span></div><div className="mt-2 flex items-center justify-between text-[9px]"><span className="text-slate-500">Nearest arrival</span><span className="font-semibold text-cyan-200">About 6 minutes</span></div><div className="mt-2 flex items-center justify-between text-[9px]"><span className="text-slate-500">Pickup location</span><span className="font-semibold text-slate-200">Edappally, Kochi</span></div></div><button type="button" onClick={() => { setModal(null); setTab('sos'); notify(`${selectedService} request confirmed · Rajesh is on the way`) }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 text-[11px] font-bold text-[#07141d]"><ShieldCheck size={15} /> Confirm request</button><p className="mt-2 text-center text-[8px] text-slate-600">No charge until your service is complete.</p></div></ModalFrame>}
      </div>
    </div>
  )
}

function LockGlyph() {
  return <Shield size={10} className="text-emerald-400" />
}
