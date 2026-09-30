'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useAutozyncData } from '@/lib/autozync-data'
import type { InvoiceRow, ServiceRequestRow } from '@/lib/supabase/client'
import VehicleLoader from '@/components/vehicle-loader'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  BriefcaseBusiness,
  CalendarClock,
  CarFront,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Cog,
  Download,
  FileText,
  Filter,
  Globe2,
  History,
  Languages,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sun,
  Moon,
  Minus,
  ShoppingBag,
  ShoppingCart,
  Siren,
  Star,
  Store,
  Truck,
  UserRound,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

type Role = 'customer' | 'partner' | 'merchant'
type Tab = 'home' | 'sos' | 'parts' | 'garage' | 'jobs' | 'offers' | 'invoice' | 'catalog' | 'orders' | 'profile'
type Dialog = 'request' | 'responders' | 'vehicle' | 'estimate' | 'offer' | 'boost' | 'product' | 'checkout' | 'login' | 'invoice' | 'support' | 'privacy' | 'delete' | 'review' | null
type ThemeMode = 'system' | 'light' | 'dark'
type ThemeAppearance = 'light' | 'dark'
type Vehicle = { id: string; registration: string; model: string; year: string; fuel: string; kind: string }
type Deal = { id: number; name: string; detail: string; price: number; sponsored?: boolean }
type Product = { id: number; name: string; fitment: string; category: string; price: number; delivery: string; store: string }
type CartLine = { product: Product; quantity: number }
type LogEntry = { id: string; title: string; date: string; cost: number; vehicle: string }
type IconType = LucideIcon

const palette = {
  cyan: 'text-cyan-200',
  muted: 'text-slate-400',
  surface: 'border-white/[0.08] bg-[#131d2b]',
  input: 'w-full rounded-xl border border-white/[0.1] bg-[#0b131e] px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50',
}

const serviceOptions: { name: string; detail: string; price: string; icon: IconType }[] = [
  { name: 'Jump Start', detail: 'Battery boost at your location', price: 'From ₹399', icon: BatteryCharging },
  { name: 'Flat Tyre / Puncture', detail: 'Mobile tyre repair and air', price: 'From ₹299', icon: Cog },
  { name: 'Towing', detail: 'Flatbed or recovery support', price: 'From ₹899', icon: Truck },
  { name: 'Breakdown', detail: 'Verified mechanic at your location', price: 'From ₹499', icon: Wrench },
]

const garageDirectory = [
  { name: 'Kochi Quick Garage', distance: '1.2 km', distanceKm: 1.2, eta: '10 mins', rating: '4.8', reviews: '128 reviews', status: 'Open now', specialty: 'Jump starts · Roadside repair' },
  { name: 'Metro Towing & Rescue', distance: '2.5 km', distanceKm: 2.5, eta: '18 mins', rating: '4.9', reviews: '96 reviews', status: '24/7 service', specialty: 'Flatbed · Towing · Recovery' },
  { name: 'Edappally Tyre Point', distance: '3.1 km', distanceKm: 3.1, eta: '16 mins', rating: '4.8', reviews: '86 reviews', status: 'Open now', specialty: 'Tyres · Puncture · Alignment' },
  { name: 'QuickFix Roadside', distance: '4.4 km', distanceKm: 4.4, eta: '22 mins', rating: '4.7', reviews: '64 reviews', status: '24/7 service', specialty: 'Mobile mechanic · Breakdown' },
]

const reviewFeedbackOptions = ['Quick Arrival', 'Affordable', 'Professional', 'Delayed', 'Overcharged']

const seedDeals: Deal[] = [
  { id: 1, name: 'Full oil service', detail: 'Star Auto Care · 1.4 km', price: 1499, sponsored: true },
  { id: 2, name: 'Monsoon 40-point check', detail: 'All vehicles · Edappally', price: 499 },
  { id: 3, name: 'Ceramic coating', detail: 'Verified garage · Save 20%', price: 7999 },
]

const seedProducts: Product[] = [
  { id: 1, name: 'Bosch oil filter', fitment: 'Hyundai Creta · 2020–2024', category: 'Engine', price: 620, delivery: '2–3 days', store: 'AutoParts Hub' },
  { id: 2, name: 'Front brake pad set', fitment: 'Hyundai Creta · 2019–2023', category: 'Brakes', price: 1890, delivery: 'Tomorrow', store: 'DriveLine Spares' },
  { id: 3, name: 'LED headlamp pair', fitment: 'Universal · H7 fitment', category: 'Electrical', price: 2499, delivery: '2–3 days', store: 'AutoParts Hub' },
  { id: 4, name: 'Front strut assembly', fitment: 'Hyundai Creta · 2020–2024', category: 'Suspension', price: 4850, delivery: '3–4 days', store: 'Kochi Motor Store' },
]

const languageNames = ['English', 'മലയാളം', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'हिन्दी']
const languageCopy: Record<string, Record<string, string>> = {
  English: { home: 'Home', sos: 'SOS', parts: 'Parts', garage: 'My Garage', profile: 'Profile', help: 'Help is close by', emergency: 'Emergency SOS' },
  മലയാളം: { home: 'ഹോം', sos: 'സഹായം', parts: 'പാർട്സ്', garage: 'എന്റെ ഗാരേജ്', profile: 'പ്രൊഫൈൽ', help: 'സഹായം അടുത്തുണ്ട്', emergency: 'അടിയന്തര സഹായം' },
  தமிழ்: { home: 'முகப்பு', sos: 'உதவி', parts: 'உதிரிபாகங்கள்', garage: 'என் கேரேஜ்', profile: 'சுயவிவரம்', help: 'உதவி அருகில் உள்ளது', emergency: 'அவசர உதவி' },
  తెలుగు: { home: 'హోమ్', sos: 'సహాయం', parts: 'పార్ట్స్', garage: 'నా గ్యారేజ్', profile: 'ప్రొఫైల్', help: 'సహాయం దగ్గరలో ఉంది', emergency: 'అత్యవసర సహాయం' },
  ಕನ್ನಡ: { home: 'ಮುಖಪುಟ', sos: 'ಸಹಾಯ', parts: 'ಪಾರ್ಟ್ಸ್', garage: 'ನನ್ನ ಗ್ಯಾರೇಜ್', profile: 'ಪ್ರೊಫೈಲ್', help: 'ಸಹಾಯ ಹತ್ತಿರದಲ್ಲಿದೆ', emergency: 'ತುರ್ತು ಸಹಾಯ' },
  हिन्दी: { home: 'होम', sos: 'मदद', parts: 'पार्ट्स', garage: 'मेरी गैराज', profile: 'प्रोफ़ाइल', help: 'मदद पास में है', emergency: 'आपातकालीन मदद' },
}

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function BrandLogo() {
  const [imageFailed, setImageFailed] = useState(false)

  return <span aria-hidden="true" className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-300/30 bg-gradient-to-br from-amber-300/20 to-orange-500/10 text-amber-200 shadow-[0_0_22px_rgba(251,146,60,0.12)]">
    {!imageFailed ? <img src="/logo.png" alt="" className="size-full object-contain" onError={() => setImageFailed(true)} /> : <ShieldCheck size={21} strokeWidth={1.8} />}
    <span className="absolute bottom-[6px] right-[6px] size-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
  </span>
}

function IconAction({ icon: Icon, label, onClick, className = '' }: { icon: IconType; label: string; onClick: () => void; className?: string }) {
  return <button type="button" aria-label={label} onClick={onClick} className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 active:scale-95', className)}><Icon size={18} /></button>
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={cx('rounded-[22px] border border-white/[0.08] bg-[#131d2b] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]', className)}>{children}</section>
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="mb-3 flex items-end justify-between gap-3"><div>{eyebrow && <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>}<h2 className="mt-1 text-lg font-bold tracking-tight text-white">{title}</h2></div>{action}</div>
}

function PrimaryButton({ children, onClick, type = 'button', disabled = false, className = '' }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; className?: string }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={cx('flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-[#07141d] transition hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45', className)}>{children}</button>
}

function ModalFrame({ title, close, children, wide = false }: { title: string; close: () => void; children: ReactNode; wide?: boolean }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><section role="dialog" aria-modal="true" aria-label={title} className={cx('max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#101927] shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:rounded-[28px]', wide ? 'max-w-[540px]' : 'max-w-[460px]')}><div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#101927]/95 px-5 py-4 backdrop-blur"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Autozync</p><h2 className="mt-1 text-lg font-bold text-white">{title}</h2></div><IconAction icon={X} label={`Close ${title}`} onClick={close} /></div><div className="p-5">{children}</div></section></div>
}

function FormField({ label, value, onChange, placeholder, type = 'text', required = false, min, max, options, autoComplete, minLength }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean; min?: string; max?: string; options?: string[]; autoComplete?: string; minLength?: number }) {
  return <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">{label}{options ? <select required={required} value={value} onChange={(event) => onChange(event.target.value)} className={palette.input}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input required={required} type={type} min={min} max={max} minLength={minLength} autoComplete={autoComplete} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={palette.input} />}</label>
}

function NearbyRadar({ onLocate }: { onLocate: () => void }) {
  return <Panel className="relative overflow-hidden border-[#283a4b] bg-[radial-gradient(ellipse_at_50%_45%,#173043_0%,#111b28_60%,#101722_100%)] p-0"><div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(75,110,133,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(75,110,133,.13) 1px, transparent 1px)', backgroundSize: '25px 25px' }} /><div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/[0.09]"><span className="absolute inset-8 rounded-full border border-cyan-200/[0.1]" /><span className="absolute inset-16 rounded-full border border-cyan-200/[0.11]" /><span className="absolute inset-[92px] rounded-full border border-cyan-200/[0.12]" /></div><div className="relative flex min-h-[176px] items-center justify-center"><div className="absolute left-[17%] top-[20%] flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#192638] text-emerald-200"><Truck size={16} /></div><div className="absolute right-[19%] top-[27%] flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#192638] text-cyan-200"><Wrench size={16} /></div><div className="absolute bottom-[19%] right-[29%] flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#192638] text-amber-200"><BatteryCharging size={16} /></div><span className="relative flex size-12 items-center justify-center rounded-full border-[3px] border-[#0e1a26] bg-cyan-300 text-[#06202b] shadow-[0_0_30px_rgba(0,229,255,.3)]"><Navigation size={19} fill="currentColor" /></span><span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0c1420]/90 px-3 py-2 text-[10px] font-semibold text-slate-200"><span className="size-2 rounded-full bg-emerald-400" /> 4 verified responders nearby</span><button type="button" onClick={onLocate} className="absolute bottom-3 right-3 flex min-h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-[#0c1420]/90 px-3 text-[10px] font-semibold text-slate-300"><MapPin size={14} /> Locate me</button></div></Panel>
}

function GarageCard({ garage, onCall, onMessage }: { garage: typeof garageDirectory[number]; onCall: (garageName: string) => void; onMessage: (garageName: string) => void }) {
  return <Panel className="p-4"><div className="flex items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/[0.09] text-cyan-200"><Store size={20} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1.5"><h3 className="text-sm font-bold text-white">{garage.name}</h3><BadgeCheck size={15} className="text-cyan-300" aria-label="Verified partner" /></div><div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400"><span className="flex items-center gap-1 text-amber-200"><Star size={12} fill="currentColor" /> {garage.rating}</span><span>{garage.reviews}</span><span>· {garage.distance}</span></div><div className="mt-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-emerald-300/[0.09] px-2.5 py-1 text-[10px] font-semibold text-emerald-200">{garage.status}</span><span className="text-[10px] text-slate-500">{garage.specialty}</span></div></div></div><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => onCall(garage.name)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-xs font-bold text-cyan-100"><Phone size={15} /> Call garage</button><button type="button" onClick={() => onMessage(garage.name)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] text-xs font-bold text-emerald-100"><MessageCircle size={15} /> Simulate WhatsApp</button></div><div className="mt-3 flex items-center justify-between rounded-xl bg-[#0b131e] px-3 py-2.5 text-[10px]"><span className="text-slate-500">Transparent rate</span><span className="font-semibold text-slate-200">₹250 call-out + ₹18/km</span></div></Panel>
}

function PartnerRoadsideJobs({ requests, garageName, busyRequestId, onAction }: { requests: ServiceRequestRow[]; garageName: string; busyRequestId: string | null; onAction: (request: ServiceRequestRow) => void }) {
  return <div className="flex flex-col gap-3">
    {requests.length === 0 ? <Panel className="py-8 text-center"><Truck size={25} className="mx-auto text-slate-500" /><p className="mt-3 text-sm font-bold">No roadside requests yet</p><p className="mt-1 text-xs text-slate-400">New customer requests will appear here when your garage is approved and online.</p></Panel> : requests.map((request) => {
      const actionLabel = request.status === 'open' ? 'Accept job' : request.status === 'assigned' ? 'Mark en route' : request.status === 'en_route' ? 'Mark completed' : ''
      const statusLabel = request.status === 'open' ? 'New request' : request.status === 'assigned' ? 'Accepted' : request.status === 'en_route' ? 'En route' : request.status === 'completed' ? 'Completed' : request.status
      const statusTone = request.status === 'completed' ? 'green' : request.status === 'open' ? 'amber' : 'cyan'
      return <Panel key={request.id}>
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200">{request.service_name}</p><h2 className="mt-1 text-sm font-bold">{request.vehicle_model || request.vehicle_type || 'Vehicle details not provided'}</h2></div><StatusBadge tone={statusTone}>{statusLabel}</StatusBadge></div>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-400"><MapPin size={13} className="mt-0.5 shrink-0 text-cyan-200" />{request.location}</p>
        <p className="mt-2 text-[10px] text-slate-500">Requested {new Date(request.created_at).toLocaleString('en-IN')}</p>
        {request.status === 'assigned' && <p className="mt-2 text-[10px] text-slate-500">Assigned to {garageName || 'your garage'}</p>}
        {actionLabel && <button type="button" onClick={() => onAction(request)} disabled={busyRequestId !== null} className="mt-4 min-h-11 w-full rounded-xl bg-cyan-300 px-3 text-xs font-extrabold text-[#07141d] transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-50">{busyRequestId === request.id ? 'Updating…' : actionLabel}</button>}
      </Panel>
    })}
  </div>
}

function StatusBadge({ children, tone = 'cyan' }: { children: ReactNode; tone?: 'cyan' | 'green' | 'amber' }) {
  return <span className={cx('inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold', tone === 'green' ? 'bg-emerald-300/10 text-emerald-200' : tone === 'amber' ? 'bg-amber-300/10 text-amber-100' : 'bg-cyan-300/10 text-cyan-100')}>{children}</span>
}

function InvoiceHistory({ invoices }: { invoices: InvoiceRow[] }) {
  if (!invoices.length) return null
  return <Panel><SectionHeading eyebrow="SAVED TO YOUR ACCOUNT" title="Recent invoices" /><div className="flex flex-col divide-y divide-white/[0.07]">{invoices.slice(0, 4).map((invoice) => <div key={invoice.id} className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"><div className="min-w-0"><p className="truncate text-sm font-semibold">{invoice.customer_name} · {invoice.vehicle}</p><p className="mt-1 text-[10px] text-slate-500">{new Date(invoice.created_at).toLocaleDateString('en-IN')} · {invoice.line_items.length} line items</p></div><span className="shrink-0 text-sm font-bold text-cyan-100">₹{Number(invoice.total).toLocaleString('en-IN')}</span></div>)}</div></Panel>
}

export default function AutozyncApp() {
  const [userId, setUserId] = useState<string | null>(null)
  const { data: remoteData, error: dataError, mutate: mutateRemote, supabase } = useAutozyncData(userId)
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authFullName, setAuthFullName] = useState('')
  const [authAccountType, setAuthAccountType] = useState<'customer' | 'partner'>('customer')
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [dialogAfterAuth, setDialogAfterAuth] = useState<Dialog>(null)
  const [role, setRole] = useState<Role>('customer')
  const [tab, setTab] = useState<Tab>('home')
  const [language, setLanguage] = useState('English')
  const [vehicleType, setVehicleType] = useState('Cars')
  const [selectedService, setSelectedService] = useState(serviceOptions[0].name)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [toast, setToast] = useState('')
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')
  const [systemTheme, setSystemTheme] = useState<ThemeAppearance>('dark')
  const [callingPartner, setCallingPartner] = useState<{ name: string; verified: boolean } | null>(null)
  const [supportContext, setSupportContext] = useState('Autozync Help Desk')
  const [vehicleForm, setVehicleForm] = useState({ registration: '', model: '', year: '', fuel: 'Petrol', kind: 'Car' })
  const [deals, setDeals] = useState(seedDeals)
  const [products, setProducts] = useState(seedProducts)
  const [cart, setCart] = useState<CartLine[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [make, setMake] = useState('All makes')
  const [modelFilter, setModelFilter] = useState('All models')
  const [yearFilter, setYearFilter] = useState('All years')
  const [activeRequest, setActiveRequest] = useState('')
  const [reviewTarget, setReviewTarget] = useState<ServiceRequestRow | null>(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewTags, setReviewTags] = useState<string[]>([])
  const [reviewText, setReviewText] = useState('')
  const [reviewBusy, setReviewBusy] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [dismissedReviewIds, setDismissedReviewIds] = useState<string[]>([])
  const [partnerJobBusyId, setPartnerJobBusyId] = useState<string | null>(null)
  const [requestNote, setRequestNote] = useState('')
  const [requestStage, setRequestStage] = useState(0)
  const [loaderMessage, setLoaderMessage] = useState<string | null>('Starting your AutoZync experience')
  const [estimateStatus, setEstimateStatus] = useState<'pending' | 'approved' | 'declined'>('pending')
  const [estimateAmount, setEstimateAmount] = useState(3050)
  const [estimateDetails, setEstimateDetails] = useState('Brake pads ₹2,400 · Labour ₹650')
  const [orderItems, setOrderItems] = useState<CartLine[]>([])
  const [online, setOnline] = useState(true)
  const [partnerServices, setPartnerServices] = useState<string[]>([])
  const [garageName, setGarageName] = useState('')
  const [garagePhone, setGaragePhone] = useState('')
  const [invoiceCustomerEmail, setInvoiceCustomerEmail] = useState('')
  const [offerForm, setOfferForm] = useState({ name: '', price: '', expiry: '' })
  const [invoiceCustomer, setInvoiceCustomer] = useState('Akhil Menon')
  const [invoiceVehicle, setInvoiceVehicle] = useState('Swift Dzire · KL 07 AB 4200')
  const [invoiceRows, setInvoiceRows] = useState([{ description: 'Engine oil & filter', quantity: 1, amount: 2200 }, { description: 'Labour charge', quantity: 1, amount: 450 }])
  const [productForm, setProductForm] = useState({ name: '', fitment: '', category: 'Engine', price: '', delivery: '2–3 days' })
  const [orderStage, setOrderStage] = useState(0)
  const [profileName, setProfileName] = useState('')
  const [location, setLocation] = useState('Edappally, Kochi · Demo location')
  const [garageAddress, setGarageAddress] = useState('')
  const [coordinates, setCoordinates] = useState('10.0261, 76.3085')
  const vehicles: Vehicle[] = remoteData?.vehicles ?? []
  const displayGarages = useMemo(() => garageDirectory.map((garage) => {
    const rating = remoteData?.garageRatings.find((item) => item.business_name.trim().toLocaleLowerCase() === garage.name.toLocaleLowerCase())
    if (!rating) return garage
    return {
      ...garage,
      rating: rating.average_rating === null ? 'New' : Number(rating.average_rating).toFixed(1),
      reviews: `${rating.review_count} ${rating.review_count === 1 ? 'review' : 'reviews'}`,
    }
  }), [remoteData?.garageRatings])
  const partnerJobs = (remoteData?.requests ?? []).filter((request) =>
    (request.status === 'open' && request.assigned_partner_id === null) || request.assigned_partner_id === userId,
  )
  const activeCustomerRequest = remoteData?.requests.find((request) => request.service_name === activeRequest && !['completed', 'cancelled'].includes(request.status))
  const logs: LogEntry[] = (remoteData?.requests ?? []).map((request) => ({
    id: request.id,
    title: request.service_name,
    date: new Date(request.created_at).toLocaleDateString('en-IN'),
    cost: 0,
    vehicle: request.vehicle_model,
  }))

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoaderMessage(null), 2800)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user.id ?? null)
      if (event === 'SIGNED_OUT') {
        setProfileName('')
        setGarageName('')
        setGaragePhone('')
        setGarageAddress('')
        setPartnerServices([])
        setActiveRequest('')
        setRole('customer')
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    if (!remoteData) return
    setProfileName(remoteData.profile?.full_name ?? '')
    setGarageName(remoteData.garage?.business_name ?? '')
    setGaragePhone(remoteData.garage?.phone ?? '')
    setGarageAddress(remoteData.garage?.address ?? '')
    setPartnerServices(remoteData.garage?.services ?? [])
    const accountType = remoteData.profile?.account_type
    if (accountType === 'partner' || accountType === 'garage_partner') setRole('partner')
    else if (accountType === 'merchant') setRole('merchant')
    else if (accountType === 'customer') setRole('customer')
    if (accountType === 'customer') {
      const latestOpenRequest = remoteData.requests.find((request) => !['completed', 'cancelled'].includes(request.status))
      setActiveRequest(latestOpenRequest?.service_name ?? '')
    } else {
      setActiveRequest('')
    }
  }, [remoteData])

  useEffect(() => {
    if (!remoteData || role !== 'customer' || remoteData.profile?.account_type !== 'customer') return
    const requestToReview = remoteData.requests.find((request) =>
      request.status === 'completed' && !remoteData.reviews.some((review) => review.service_request_id === request.id) && !dismissedReviewIds.includes(request.id),
    )
    if (!requestToReview) return
    setReviewTarget(requestToReview)
    setReviewRating(0)
    setReviewTags([])
    setReviewText('')
    setReviewError('')
    setDialog('review')
  }, [remoteData, role, dismissedReviewIds])

  useEffect(() => {
    if (dataError) setToast('Could not load your Autozync data. Please refresh and try again.')
  }, [dataError])

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('autozync-theme')
    if (storedTheme === 'system' || storedTheme === 'light' || storedTheme === 'dark') setThemeMode(storedTheme)
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystemTheme = () => setSystemTheme(media.matches ? 'dark' : 'light')
    syncSystemTheme()
    media.addEventListener('change', syncSystemTheme)
    return () => media.removeEventListener('change', syncSystemTheme)
  }, [])

  const resolvedTheme = themeMode === 'system' ? systemTheme : themeMode

  useEffect(() => {
    window.localStorage.setItem('autozync-theme', themeMode)
    document.documentElement.style.colorScheme = resolvedTheme
  }, [themeMode, resolvedTheme])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const copy = languageCopy[language] ?? languageCopy.English
  const invoiceTotal = useMemo(() => invoiceRows.reduce((sum, row) => sum + row.quantity * row.amount, 0), [invoiceRows])
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)
  const cartSubtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  const cartTax = Math.round(cartSubtotal * 0.18)
  const cartDelivery = cart.length ? 49 : 0
  const cartTotal = cartSubtotal + cartTax + cartDelivery
  const visibleProducts = products.filter((product) => {
    const fitment = product.fitment.toLowerCase()
    const matchesSearch = `${product.name} ${product.fitment} ${product.category} ${product.store}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
      && (category === 'All categories' || product.category === category)
      && (make === 'All makes' || fitment.includes(make.toLowerCase()))
      && (modelFilter === 'All models' || fitment.includes(modelFilter.toLowerCase()))
      && (yearFilter === 'All years' || fitment.includes(yearFilter))
  })
  const notify = (message: string) => setToast(message)
  const requireSignIn = (nextDialog: Dialog = null) => {
    if (userId) return true
    setAuthMode('sign-in')
    setAuthError('')
    setDialogAfterAuth(nextDialog)
    setDialog('login')
    return false
  }
  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError('')
    const email = authEmail.trim().toLowerCase()
    const fullName = authFullName.trim()
    if (authMode === 'sign-up' && !fullName) {
      setAuthError('Enter your name to create an account.')
      return
    }
    setAuthBusy(true)
    try {
const result = authMode === 'sign-up'
        ? await supabase.auth.signUp({ email, password: authPassword, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`, data: { full_name: fullName, account_type: authAccountType } } })
        : await supabase.auth.signInWithPassword({ email, password: authPassword })
      if (result.error) {
        const detail = result.error.message.toLowerCase()
        const message = detail.includes('invalid login credentials') || detail.includes('user not found')
          ? 'Email or password did not match. Check your details and try again.'
          : detail.includes('email not confirmed')
            ? 'Confirm your email using the link we sent, then sign in.'
            : detail.includes('password') && (detail.includes('weak') || detail.includes('short'))
              ? 'Choose a stronger password with at least 8 characters.'
              : detail.includes('rate limit') || detail.includes('too many requests')
                ? 'Too many attempts. Wait a little while and try again.'
                : detail.includes('invalid email')
                  ? 'Enter a valid email address and try again.'
                  : authMode === 'sign-up' && (detail.includes('already registered') || detail.includes('already been registered'))
                    ? 'Unable to create an account with these details. Try signing in instead.'
                    : 'Unable to complete authentication right now. Please try again.'
        setAuthError(message)
        return
      }
      if (!result.data.session) {
        setAuthError('Check your email for a confirmation link. You can sign in after confirming your account.')
        return
      }
      setUserId(result.data.session.user.id)
      if (authMode === 'sign-up') {
        setProfileName(fullName)
        setRole(authAccountType)
      }
      setAuthPassword('')
      setDialog(dialogAfterAuth)
      setDialogAfterAuth(null)
      notify(authMode === 'sign-up' ? 'Your Autozync account is ready.' : 'You are signed in.')
    } catch {
      setAuthError('Unable to reach Autozync right now. Please try again.')
    } finally {
      setAuthBusy(false)
    }
  }
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      notify('Could not sign out. Please try again.')
      return
    }
    setDialog(null)
    notify('You are signed out.')
  }
  const saveProfileName = async () => {
    if (!requireSignIn()) return false
    const fullName = profileName.trim()
    if (!fullName) {
      notify('Enter a name before saving your profile.')
      return false
    }
    const { data, error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', userId).select('id').maybeSingle()
    if (error || !data) {
      notify('Could not save your profile. Please try again.')
      return false
    }
    await mutateRemote()
    notify('Profile saved to your account.')
    return true
  }
  const saveGarage = async () => {
    if (!requireSignIn()) return
    const businessName = garageName.trim()
    if (!businessName || !garagePhone.trim() || !garageAddress.trim()) {
      notify('Add your business name, phone, and address first.')
      return
    }
    const values = { business_name: businessName, phone: garagePhone.trim(), address: garageAddress.trim(), services: partnerServices }
    const { data: existing, error: lookupError } = await supabase.from('garage_partners').select('user_id').eq('user_id', userId).maybeSingle()
    if (lookupError) {
      notify('Could not load your garage profile. Please try again.')
      return
    }
    const { error } = existing
      ? await supabase.from('garage_partners').update(values).eq('user_id', userId)
      : await supabase.from('garage_partners').insert({ user_id: userId, ...values })
    if (error) {
      notify('Could not save your garage profile. Please try again.')
      return
    }
    await mutateRemote()
    notify('Garage onboarding details saved securely.')
  }
  const goToTab = (nextTab: Tab) => {
    setTab(nextTab)
    document.querySelector('.scroll-panel')?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const switchRole = (nextRole: Role) => {
    setRole(nextRole)
    setTab('home')
    document.querySelector('.scroll-panel')?.scrollTo({ top: 0, behavior: 'instant' })
  }
  const submitRoadsideRequest = async (responderName?: string, returnDialog: Dialog = 'responders') => {
    if (!requireSignIn(returnDialog)) return
    setLoaderMessage('Finding the right roadside support')

    try {
      let requestLocation = location.trim()
      let requestCoordinates = coordinates
      if (navigator.geolocation) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition((position) => {
            requestCoordinates = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
            requestLocation = `${requestCoordinates} · Current location`
            resolve()
          }, () => resolve(), { enableHighAccuracy: true, timeout: 6000 })
        })
        setCoordinates(requestCoordinates)
        setLocation(requestLocation)
      }

      const { error } = await supabase.from('service_requests').insert({
        customer_id: userId,
        service_name: selectedService,
        vehicle_type: vehicleType,
        vehicle_model: vehicles[0]?.model ?? '',
        location: requestLocation,
        coordinates: requestCoordinates,
        note: [responderName ? `Preferred responder: ${responderName}` : '', requestNote.trim()].filter(Boolean).join(' · '),
      })
      if (error) {
        notify('Could not save your roadside request. Please try again.')
        return
      }
      await mutateRemote()
      setRequestNote('')
      setRequestStage(0)
      setEstimateStatus('pending')
      setActiveRequest(selectedService)
      setDialog(null)
      goToTab('sos')
      notify(`${selectedService} request saved${responderName ? ` for ${responderName}` : ''} with your location.`)
    } catch {
      notify('Could not save your roadside request. Please try again.')
    } finally {
      setLoaderMessage(null)
    }
  }

  const requestService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitRoadsideRequest(undefined, 'request')
  }
  const removeVehicle = async (vehicleId: string) => {
    if (!userId) return
    const { error } = await supabase.from('customer_vehicles').delete().eq('id', vehicleId).eq('owner_id', userId)
    if (error) {
      notify('Could not remove this vehicle. Please try again.')
      return
    }
    await mutateRemote()
    notify('Vehicle removed from My Garage.')
  }
  const cancelActiveRequest = async () => {
    const request = remoteData?.requests.find((item) => item.service_name === activeRequest && !['completed', 'cancelled'].includes(item.status))
    if (!request || !userId) return
    setLoaderMessage('Updating your roadside request')
    try {
      const { error } = await supabase.from('service_requests').update({ status: 'cancelled' }).eq('id', request.id).eq('customer_id', userId)
      if (error) {
        notify('Could not close the roadside request. Please try again.')
        return
      }
      await mutateRemote()
      setRequestStage(0)
      notify('Roadside request closed.')
    } catch {
      notify('Could not close the roadside request. Please try again.')
    } finally {
      setLoaderMessage(null)
    }
  }
  const handlePartnerJobAction = async (request: ServiceRequestRow) => {
    if (!userId || partnerJobBusyId) return
    const nextStatus = request.status === 'open' ? 'assigned' : request.status === 'assigned' ? 'en_route' : 'completed'
    const loaderCopy = nextStatus === 'assigned' ? 'Assigning this roadside request' : nextStatus === 'en_route' ? 'Updating the customer on your route' : 'Completing this service request'
    const update = request.status === 'open'
      ? { status: nextStatus, assigned_partner_id: userId }
      : { status: nextStatus }
    setPartnerJobBusyId(request.id)
    setLoaderMessage(loaderCopy)
    try {
      const updateQuery = supabase.from('service_requests').update(update).eq('id', request.id).eq('status', request.status).select('id')
      const { data: updatedRequest, error } = request.status === 'open'
        ? await updateQuery.is('assigned_partner_id', null).maybeSingle()
        : await updateQuery.eq('assigned_partner_id', userId).maybeSingle()
      if (error || !updatedRequest) {
        notify('This job could not be updated. It may have been claimed or changed by another garage.')
        await mutateRemote()
        return
      }
      await mutateRemote()
      notify(nextStatus === 'completed' ? 'Service marked complete. The customer has been invited to review.' : nextStatus === 'en_route' ? 'Customer updated: your garage is on the way.' : 'Job accepted and assigned to your garage.')
    } catch {
      notify('This job could not be updated. Please try again.')
    } finally {
      setPartnerJobBusyId(null)
      setLoaderMessage(null)
    }
  }

  const openServiceReview = (request: ServiceRequestRow) => {
    setReviewTarget(request)
    setReviewRating(0)
    setReviewTags([])
    setReviewText('')
    setReviewError('')
    setDialog('review')
  }

  const dismissServiceReview = () => {
    if (reviewTarget) setDismissedReviewIds((current) => current.includes(reviewTarget.id) ? current : [...current, reviewTarget.id])
    setReviewTarget(null)
    setDialog(null)
  }

  const submitServiceReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!reviewTarget || !userId || reviewBusy) return
    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError('Choose a star rating before submitting your review.')
      return
    }
    setReviewBusy(true)
    setReviewError('')
    const { error } = await supabase.from('service_reviews').insert({
      service_request_id: reviewTarget.id,
      rating: reviewRating,
      feedback_tags: reviewTags,
      review_text: reviewText.trim(),
    })
    setReviewBusy(false)
    if (error) {
      setReviewError('Your review could not be saved. Please try again; each completed service can only be reviewed once.')
      return
    }
    await mutateRemote()
    setReviewTarget(null)
    setDialog(null)
    notify('Thank you. Your verified review is now reflected in the garage rating.')
  }

  const addVehicle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!requireSignIn('vehicle')) return
    const { error } = await supabase.from('customer_vehicles').insert({
      owner_id: userId,
      registration: vehicleForm.registration.trim().toUpperCase(),
      model: vehicleForm.model.trim(),
      year: vehicleForm.year,
      fuel: vehicleForm.fuel,
      kind: vehicleForm.kind,
    })
    if (error) {
      notify('Could not save your vehicle. Please check the details and try again.')
      return
    }
    await mutateRemote()
    setVehicleForm({ registration: '', model: '', year: '', fuel: 'Petrol', kind: 'Car' })
    setDialog(null)
    notify('Vehicle saved to My Garage.')
  }
  const publishOffer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const price = Number(offerForm.price)
    if (!offerForm.name.trim() || !price || price < 1) return
    setDeals((current) => [{ id: Date.now(), name: offerForm.name.trim(), detail: `Star Auto Care · ${offerForm.expiry || 'Limited time'}`, price }, ...current])
    setOfferForm({ name: '', price: '', expiry: '' })
    setDialog(null)
    notify('Offer posted to the customer deals feed')
  }
  const addProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const price = Number(productForm.price)
    if (!productForm.name.trim() || !productForm.fitment.trim() || !price || price < 1) return
    setProducts((current) => [{ id: Date.now(), ...productForm, price, store: 'Kochi Motor Store' }, ...current])
    setProductForm({ name: '', fitment: '', category: 'Engine', price: '', delivery: '2–3 days' })
    setDialog(null)
    notify('Part added to the session marketplace catalog')
  }
  const downloadInvoice = async () => {
    if (!requireSignIn()) return
    const lineItems = invoiceRows
      .map((row) => ({ description: row.description.trim(), quantity: Number(row.quantity), amount: Number(row.amount) }))
      .filter((row) => row.description && Number.isSafeInteger(row.quantity) && row.quantity > 0 && Number.isFinite(row.amount) && row.amount >= 0)
    if (!invoiceCustomer.trim() || !invoiceVehicle.trim() || !lineItems.length) {
      notify('Add customer, vehicle, and at least one valid invoice line.')
      return
    }
    const total = lineItems.reduce((sum, row) => sum + row.quantity * row.amount, 0)
    const { error } = await supabase.from('digital_invoices').insert({
      garage_partner_id: userId,
      customer_name: invoiceCustomer.trim(),
      customer_email: invoiceCustomerEmail.trim(),
      vehicle: invoiceVehicle.trim(),
      line_items: lineItems,
      total,
      currency: 'INR',
    })
    if (error) {
      notify('Could not save the invoice. Sign in with a garage partner account and try again.')
      return
    }
    await mutateRemote()
    const lines = [
      'AUTOZYNC DIGITAL SERVICE INVOICE',
      `${garageName || 'Autozync Garage'} · ${garageAddress || 'Address on file'}`,
      `Customer: ${invoiceCustomer.trim()}`,
      `Vehicle: ${invoiceVehicle.trim()}`,
      `Date: ${new Date().toLocaleDateString('en-IN')}`,
      '',
      ...lineItems.map((row) => `${row.description} × ${row.quantity} — ₹${row.amount * row.quantity}`),
      '',
      `Total: ₹${total.toLocaleString('en-IN')}`,
      'Generated by Autozync. This is not a tax invoice.',
    ]
    const file = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `autozync-invoice-${Date.now()}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
    notify('Invoice saved to Supabase and downloaded.')
  }
  const locateMe = () => {
    if (tab !== 'sos') {
      goToTab('sos')
      notify('Location access is available only in the roadside SOS flow')
      return
    }
    if (!navigator.geolocation) {
      notify('Location is unavailable. Showing the demo Kochi location.')
      return
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const nextCoordinates = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
      setCoordinates(nextCoordinates)
      setLocation(`${nextCoordinates} · Current location`)
      notify('Current location updated for this session')
    }, () => notify('Location permission unavailable. Showing the demo Kochi location.'), { enableHighAccuracy: true, timeout: 7000 })
  }
  const completeCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!cart.length) return
    setOrderItems(cart)
    setCart([])
    setDialog(null)
    setOrderStage(1)
    goToTab('parts')
    notify('Demo order placed · estimated delivery 2–3 days')
  }
  const makeCall = (person: string, verified = true) => setCallingPartner({ name: person, verified })
  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id)
      return existing
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { product, quantity: 1 }]
    })
    notify(`${product.name} added to your cart`)
  }
  const adjustCartQuantity = (productId: number, change: number) => {
    setCart((current) => current.flatMap((line) => {
      if (line.product.id !== productId) return [line]
      const quantity = line.quantity + change
      return quantity > 0 ? [{ ...line, quantity }] : []
    }))
  }
  const purgeDemoData = async () => {
    if (!requireSignIn('delete')) return
    const response = await fetch('/api/account', { method: 'DELETE', credentials: 'same-origin', headers: { 'x-autozync-delete': 'confirmed' } })
    if (!response.ok) {
      const result = await response.json().catch(() => null) as { error?: string } | null
      notify(result?.error ?? 'Could not delete your account. Please try again.')
      return
    }
    setCart([])
    setOrderItems([])
    setOrderStage(0)
    setCallingPartner(null)
    setDialog(null)
    await supabase.auth.signOut()
    notify('Your Autozync account and associated records were deleted.')
  }

  const tabItems: { id: Tab; label: string; icon: IconType }[] = role === 'customer'
    ? [{ id: 'home', label: copy.home, icon: Navigation }, { id: 'sos', label: copy.sos, icon: Siren }, { id: 'parts', label: copy.parts, icon: ShoppingBag }, { id: 'garage', label: copy.garage, icon: CarFront }, { id: 'profile', label: copy.profile, icon: UserRound }]
    : role === 'partner'
      ? [{ id: 'home', label: 'Overview', icon: Activity }, { id: 'jobs', label: 'Jobs', icon: BriefcaseBusiness }, { id: 'offers', label: 'Offers', icon: Star }, { id: 'invoice', label: 'Invoice', icon: FileText }, { id: 'profile', label: 'Setup', icon: Cog }]
      : [{ id: 'home', label: 'Overview', icon: Activity }, { id: 'catalog', label: 'Catalog', icon: Package }, { id: 'orders', label: 'Orders', icon: ShoppingCart }, { id: 'profile', label: 'Store', icon: Store }]

  return <div data-theme={resolvedTheme} className="app-canvas min-h-[100dvh] bg-[#070b11] text-slate-100 sm:flex sm:justify-center sm:bg-[radial-gradient(ellipse_at_50%_0%,#13263a_0%,#070b11_60%)]">
    <div data-theme={resolvedTheme} className="app-shell relative flex h-[100dvh] min-h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden border-x border-white/[0.055] bg-[#0a1019] shadow-[0_0_90px_rgba(0,0,0,0.48)]">
      <header className="z-30 flex shrink-0 items-center justify-between gap-2.5 border-b border-white/[0.06] bg-[#0e1520] px-3 py-2.5 max-[360px]:flex-wrap max-[360px]:gap-y-2">
        <div className="flex shrink-0 items-center gap-2.5 max-[360px]:w-full"><BrandLogo /><div className="shrink-0"><div className="whitespace-nowrap text-[16px] font-extrabold tracking-[-0.045em] text-white">AutoZync<span className="text-amber-300">.</span></div><div className="whitespace-nowrap text-[9px] font-medium text-slate-500">Mobility, in sync</div></div></div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 max-[360px]:ml-auto">
          <button type="button" onClick={() => setDialog('checkout')} aria-label={`Open shopping cart, ${cartCount} items`} className="relative z-0 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 sm:size-10"><ShoppingCart size={17} />{cartCount > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#0e1520] bg-cyan-300 px-1 text-[10px] font-black leading-none text-slate-950">{cartCount > 99 ? '99+' : cartCount}</span>}</button>
          <label className="sr-only" htmlFor="language-select">Choose language</label>
          <span className="flex h-9 items-center gap-0.5 rounded-xl border border-white/[0.08] bg-[#151f2d] px-1.5 text-slate-300 sm:h-10 sm:gap-1 sm:px-2"><Languages size={14} className="shrink-0 text-cyan-200" /><select id="language-select" aria-label="Choose language" value={language} onChange={(event) => { const nextLanguage = event.target.value; setLanguage(nextLanguage); document.documentElement.lang = ({ English: 'en', മലയാളം: 'ml', தமிழ்: 'ta', తెలుగు: 'te', ಕನ್ನಡ: 'kn', हिन्दी: 'hi' } as Record<string, string>)[nextLanguage] ?? 'en'; notify(`Language set to ${nextLanguage}`) }} className="max-w-[56px] bg-transparent text-[10px] font-semibold outline-none sm:max-w-[92px]"><option className="bg-[#101927]">English</option>{languageNames.slice(1).map((name) => <option className="bg-[#101927]" key={name}>{name}</option>)}</select><ChevronDown size={12} className="shrink-0" /></span>
          <label className="sr-only" htmlFor="role-select">Switch app mode</label>
          <select id="role-select" aria-label="Switch app mode" value={role} onChange={(event) => switchRole(event.target.value as Role)} className="h-9 max-w-[100px] rounded-xl border border-cyan-300/20 bg-[#10202d] px-1.5 text-[10px] font-bold text-cyan-100 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:h-10 sm:max-w-[113px] sm:px-2 max-[360px]:max-w-[112px]"><option value="customer">Customer</option><option value="partner">Partner</option><option value="merchant">Merchant</option></select>
        </div>
      </header>

      <main className="scroll-panel flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {role === 'customer' && <>
          {tab === 'home' && <div className="flex flex-col gap-5">
            <section className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Your drive, covered</p><h1 className="mt-1 text-[22px] font-extrabold tracking-tight">{copy.help}<span className="text-cyan-300">.</span></h1><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={13} className="text-cyan-300" />{location}</p></div><IconAction icon={Globe2} label="Update current location" onClick={locateMe} /></section>
            <section><SectionHeading eyebrow="NEARBY SUPPORT" title="Verified help around you" action={<span className="text-[10px] font-semibold text-emerald-200">● Live demo</span>} /><NearbyRadar onLocate={locateMe} /></section>
            <section><div className="mb-3 flex items-center justify-between"><SectionHeading eyebrow="ONE-TAP ASSISTANCE" title={copy.emergency} /><button type="button" onClick={() => goToTab('sos')} className="mb-3 text-xs font-bold text-cyan-200">All help</button></div><div className="grid grid-cols-2 gap-3">{serviceOptions.map(({ name, detail, price, icon: Icon }) => <button key={name} type="button" onClick={() => { setSelectedService(name); setDialog('responders') }} className="min-h-[142px] rounded-[20px] border border-white/[0.09] bg-[#131d2b] p-3.5 text-left transition hover:border-cyan-300/35 hover:bg-[#182638] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 active:scale-[0.99]"><span className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/[0.09] text-cyan-200"><Icon size={20} /></span><span className="mt-3 block text-sm font-bold text-white">{name}</span><span className="mt-1 block text-[11px] leading-relaxed text-slate-400">{detail}</span><span className="mt-2 block text-[11px] font-bold text-cyan-200">{price}</span></button>)}</div></section>
            <section><SectionHeading eyebrow="SPONSORED · VERIFIED PARTNERS" title="Deals for your ride" action={<button type="button" onClick={() => goToTab('parts')} className="mb-3 text-xs font-bold text-cyan-200">Explore <ChevronRight className="inline" size={13} /></button>} /><div className="flex flex-col gap-3">{deals.slice(0, 2).map((deal) => <Panel key={deal.id} className="flex items-center gap-3 p-3.5"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/[0.09] text-cyan-200"><Zap size={19} /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-bold">{deal.name}</h3>{deal.sponsored && <StatusBadge tone="amber">Sponsored</StatusBadge>}</div><p className="mt-1 text-[11px] text-slate-400">{deal.detail}</p></div><span className="text-sm font-extrabold text-white">₹{deal.price.toLocaleString('en-IN')}</span></Panel>)}</div></section>
            <section><SectionHeading eyebrow="OPEN NOW · 24/7 OPTIONS" title="Nearby garages" /><div className="flex flex-col gap-3">{displayGarages.slice(0, 2).map((garage) => <GarageCard key={garage.name} garage={garage} onCall={makeCall} onMessage={(garageName) => { setSupportContext(garageName); setDialog('support') }} />)}</div></section>
          </div>}
          {tab === 'sos' && <div className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Fast-track help</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight">{copy.emergency}</h1><p className="mt-1 text-sm text-slate-400">Choose what happened. No long questionnaire.</p></div><div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">{['Cars', 'Bikes / scooters', 'Commercial / heavy'].map((type) => <button type="button" key={type} onClick={() => setVehicleType(type)} className={cx('min-h-11 shrink-0 rounded-full border px-4 text-xs font-bold', vehicleType === type ? 'border-cyan-300/40 bg-cyan-300/[0.1] text-cyan-100' : 'border-white/10 bg-white/[0.03] text-slate-400')}>{type}</button>)}</div><div className="flex flex-col gap-3">{serviceOptions.map(({ name, detail, price, icon: Icon }) => <button key={name} type="button" onClick={() => { setSelectedService(name); setDialog('responders') }} className="flex min-h-[84px] items-center gap-3 rounded-[20px] border border-white/[0.08] bg-[#131d2b] p-3.5 text-left hover:border-cyan-300/35"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/[0.09] text-cyan-200"><Icon size={22} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">{name}</span><span className="mt-1 block text-xs text-slate-400">{detail}</span></span><span className="text-right"><span className="block text-xs font-bold text-cyan-100">{price}</span><ArrowRight size={16} className="ml-auto mt-2 text-slate-500" /></span></button>)}</div><NearbyRadar onLocate={locateMe} />
            {activeRequest && <Panel className="border-cyan-300/20"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-200">Active roadside request</p><h2 className="mt-1 text-base font-bold">{activeRequest}</h2></div><StatusBadge tone={requestStage >= 2 ? 'green' : 'cyan'}>{['Partner assigned', 'On the way', 'Arrived'][requestStage] ?? 'Partner assigned'}</StatusBadge></div><div className="mt-4 flex items-center justify-between rounded-xl bg-[#0b131e] p-3 text-xs"><span className="text-slate-400">Rajesh K. · Verified mechanic</span><span className="font-bold text-cyan-100">{requestStage === 0 ? '6 min away' : requestStage === 1 ? '3 min away' : 'At your location'}</span></div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => makeCall('Rajesh K. · Verified mechanic')} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-xs font-bold text-cyan-100"><Phone size={15} /> Call verified partner</button><a target="_blank" rel="noreferrer" href="#" onClick={(event) => { event.preventDefault(); setDialog('support') }} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] text-xs font-bold text-emerald-100"><MessageCircle size={15} /> WhatsApp location</a></div><div className="mt-3 flex gap-2"><button type="button" onClick={() => { setLoaderMessage('Refreshing your service progress'); window.setTimeout(() => { setRequestStage((stage) => Math.min(2, stage + 1)); setLoaderMessage(null) }, 1100) }} className="min-h-11 flex-1 rounded-xl border border-white/10 text-xs font-bold text-slate-300">Simulate trip update</button><button type="button" onClick={() => void cancelActiveRequest()} className="min-h-11 rounded-xl px-3 text-xs font-semibold text-slate-500">Close</button></div></Panel>}
            <Panel><SectionHeading eyebrow="NEARBY & VERIFIED" title="Call or message a garage" /><div className="flex flex-col gap-3">{displayGarages.map((garage) => <GarageCard key={garage.name} garage={garage} onCall={makeCall} onMessage={(garageName) => { setSupportContext(garageName); setDialog('support') }} />)}</div><div className="mt-4 rounded-xl border border-white/[0.07] bg-[#0b131e] p-3 text-xs text-slate-400"><span className="font-bold text-white">Clear pricing:</span> Towing ₹250 base + ₹18/km · Standard labour from ₹450</div></Panel>
            {estimateStatus === 'pending' && <Panel className="border-amber-200/20"><div className="flex items-center gap-2"><FileText size={18} className="text-amber-200" /><h2 className="text-sm font-bold">Repair estimate · Star Auto Care</h2></div><p className="mt-2 text-xs text-slate-400">{estimateDetails} · Estimated total ₹{estimateAmount.toLocaleString('en-IN')}</p><p className="mt-1 text-[10px] text-slate-500">Work starts only after your approval.</p><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setEstimateStatus('approved'); notify('Estimate approved. The garage can begin work.') }} className="min-h-11 rounded-xl bg-cyan-300 text-xs font-extrabold text-[#07141d]">Approve estimate</button><button type="button" onClick={() => { setEstimateStatus('declined'); notify('Estimate declined') }} className="min-h-11 rounded-xl border border-white/10 text-xs font-bold text-slate-300">Decline</button></div></Panel>}
            {estimateStatus !== 'pending' && <Panel><div className="flex items-center gap-2"><CheckCircle2 size={19} className="text-emerald-300" /><span className="text-sm font-bold">Estimate {estimateStatus}</span></div><p className="mt-1 text-xs text-slate-400">₹{estimateAmount.toLocaleString('en-IN')} · Star Auto Care</p></Panel>}
          </div>}
          {tab === 'parts' && <div className="flex flex-col gap-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Autozync marketplace</p><h1 className="mt-1 text-2xl font-extrabold">Spare parts</h1><p className="mt-1 text-xs text-slate-400">Find parts that fit. Local stores, clear delivery.</p></div><button type="button" onClick={() => setDialog('checkout')} aria-label={`Open cart, ${cartCount} items`} className="relative flex size-12 items-center justify-center rounded-xl border border-white/10 bg-[#131d2b] text-cyan-100"><ShoppingCart size={19} />{cartCount > 0 && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-cyan-300 text-[10px] font-black text-slate-950">{cartCount}</span>}</button></div><label className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-[#111a27] px-3.5"><Search size={17} className="text-slate-500" /><span className="sr-only">Search spare parts</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Part name, vehicle or store" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600" /></label>{orderStage > 0 && orderItems.length > 0 && <Panel className="border-cyan-300/20"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">Order AZ-ORD-2048</p><h2 className="mt-1 text-sm font-bold">{orderStage === 1 ? 'Order confirmed' : 'Ready to ship'}</h2></div><StatusBadge tone={orderStage > 1 ? 'green' : 'cyan'}>In progress</StatusBadge></div><p className="mt-2 text-xs text-slate-400">{orderItems.map(({ product, quantity }) => `${product.name} × ${quantity}`).join(', ')} · Estimated delivery in 2–3 days</p></Panel>}<div className="grid grid-cols-2 gap-3"><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111a27] px-3"><Filter size={14} className="text-cyan-200" /><span className="sr-only">Filter by vehicle make</span><select value={make} onChange={(event) => setMake(event.target.value)} className="h-11 min-w-0 flex-1 bg-transparent text-xs outline-none"><option>All makes</option><option>Hyundai</option><option>Universal</option></select></label><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111a27] px-3"><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 min-w-0 flex-1 bg-transparent text-xs outline-none">{['All categories', 'Engine', 'Brakes', 'Suspension', 'Electrical', 'Body', 'Accessories'].map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="rounded-xl border border-white/[0.07] bg-[#131d2b] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vehicle fitment</p><div className="mt-1 flex items-center justify-between gap-2"><span className="text-sm font-semibold">{vehicles[0]?.model ?? 'Choose your vehicle'} · {vehicles[0]?.year ?? '—'}</span><button type="button" onClick={() => goToTab('garage')} className="text-xs font-bold text-cyan-200">Change</button></div></div><div className="grid grid-cols-2 gap-3"><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111a27] px-3"><span className="sr-only">Filter by model</span><select aria-label="Filter by model" value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} className="h-11 min-w-0 flex-1 bg-transparent text-xs outline-none"><option>All models</option><option>Creta</option><option>Universal</option></select></label><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111a27] px-3"><span className="sr-only">Filter by year</span><select aria-label="Filter by year" value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="h-11 min-w-0 flex-1 bg-transparent text-xs outline-none"><option>All years</option>{['2019', '2020', '2021', '2022', '2023', '2024'].map((year) => <option key={year}>{year}</option>)}</select></label></div><div className="flex flex-col gap-3">{visibleProducts.map((product) => <Panel key={product.id} className="p-4"><div className="flex items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/[0.09] text-cyan-200"><Package size={20} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h2 className="text-sm font-bold">{product.name}</h2><StatusBadge>{product.category}</StatusBadge></div><p className="mt-1 text-xs text-slate-400">{product.fitment}</p><p className="mt-2 flex items-center gap-1 text-[10px] text-slate-500"><Store size={12} /> {product.store} · Delivery {product.delivery}</p></div></div><div className="mt-4 flex items-center justify-between gap-3"><span className="text-lg font-extrabold">₹{product.price.toLocaleString('en-IN')}</span><div className="flex gap-2"><a href="#" onClick={(event) => { event.preventDefault(); makeCall(event.currentTarget.getAttribute('aria-label')?.replace('Call ', '') ?? 'Verified parts partner') }} aria-label={`Call ${product.store}`} className="flex size-11 items-center justify-center rounded-xl border border-white/10 text-slate-300"><Phone size={16} /></a><button type="button" onClick={() => addToCart(product)} className="min-h-11 rounded-xl bg-cyan-300 px-4 text-xs font-extrabold text-[#07141d]">Add to cart</button></div></div></Panel>)}{visibleProducts.length === 0 && <Panel><p className="py-4 text-center text-sm text-slate-400">No matching parts. Try another filter.</p></Panel>}</div><Panel><SectionHeading eyebrow="LOCAL PICKUP" title="Nearby stores" /><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200"><Store size={19} /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold">Kochi Motor Store</p><p className="mt-1 text-xs text-slate-400">Open now · 2.6 km · Edappally</p></div><a href="#" onClick={(event) => { event.preventDefault(); makeCall(event.currentTarget.getAttribute('aria-label')?.replace('Call ', '') ?? 'Verified parts partner') }} aria-label="Call Kochi Motor Store" className="flex size-11 items-center justify-center rounded-xl border border-white/10 text-cyan-100"><Phone size={16} /></a></div></Panel></div>}
          {tab === 'garage' && <div className="flex flex-col gap-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Your vehicles, in sync</p><h1 className="mt-1 text-2xl font-extrabold">My Garage</h1></div><button type="button" onClick={() => setDialog('vehicle')} className="flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-3 text-xs font-extrabold text-[#07141d]"><Plus size={16} /> Add vehicle</button></div><div className="flex flex-col gap-3">{vehicles.map((vehicle) => <Panel key={vehicle.id}><div className="flex items-start gap-3"><span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-300/[0.09] text-cyan-200"><CarFront size={22} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h2 className="text-base font-bold">{vehicle.model}</h2><button type="button" aria-label={`Remove ${vehicle.model}`} onClick={() => void removeVehicle(vehicle.id)} className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white"><X size={15} /></button></div><p className="mt-1 text-sm font-semibold tracking-wide text-cyan-100">{vehicle.registration}</p><div className="mt-3 flex flex-wrap gap-2"><StatusBadge>{vehicle.year}</StatusBadge><StatusBadge>{vehicle.fuel}</StatusBadge><StatusBadge>{vehicle.kind}</StatusBadge></div></div></div></Panel>)}</div><Panel><SectionHeading eyebrow="SERVICE LOGBOOK" title="Service history" action={<History size={18} className="mb-3 text-cyan-200" />} /><div className="flex flex-col">{logs.map((entry, index) => <div key={entry.id} className="flex gap-3 py-3 first:pt-1 last:pb-1"><span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300/[0.08] text-cyan-200"><Wrench size={16} />{index < logs.length - 1 && <span className="absolute left-1/2 top-10 h-5 w-px bg-white/10" />}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{entry.title}</p><p className="mt-1 text-xs text-slate-500">{entry.vehicle} · {entry.date}</p></div><span className="text-xs font-bold text-slate-200">{entry.cost ? `₹${entry.cost.toLocaleString('en-IN')}` : 'Added'}</span></div>)}</div></Panel><Panel className="border-amber-200/15 bg-amber-300/[0.04]"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-100"><CalendarClock size={19} /></span><div><p className="text-sm font-bold">Service reminder</p><p className="mt-1 text-xs text-slate-400">Oil service due in about 18 days</p></div></div><button type="button" onClick={() => { setSelectedService('Breakdown mechanic'); setDialog('request') }} className="mt-3 min-h-11 w-full rounded-xl border border-amber-100/15 text-xs font-bold text-amber-100">Find a nearby service center</button></Panel></div>}
          {tab === 'profile' && <ProfileScreen role={role} name={profileName} setName={setProfileName} notify={notify} authenticated={Boolean(userId)} email={remoteData?.profile?.email ?? authEmail} onLogin={() => { setAuthMode('sign-in'); setDialog('login') }} onSignOut={() => void signOut()} onSaveName={saveProfileName} onSupport={() => { setSupportContext('Autozync Help Desk'); setDialog('support') }} themeMode={themeMode} onThemeChange={setThemeMode} onPrivacy={() => setDialog('privacy')} onDelete={() => setDialog('delete')} resolvedTheme={resolvedTheme} />}
        </>}

        {role === 'partner' && <>
          {tab === 'home' && <div className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Garage partner workspace</p><h1 className="mt-1 text-2xl font-extrabold">Good morning, Star Auto Care</h1><p className="mt-1 text-xs text-slate-400">Your roadside desk for Edappally, Kochi</p></div><button type="button" onClick={() => setOnline((value) => !value)} className={cx('flex min-h-12 items-center justify-between rounded-xl border px-4 text-sm font-bold', online ? 'border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-100' : 'border-white/10 bg-[#131d2b] text-slate-400')}><span className="flex items-center gap-2"><span className={cx('size-2 rounded-full', online ? 'bg-emerald-300' : 'bg-slate-500')} />{online ? 'Online · Ready for jobs' : 'Offline · Not taking jobs'}</span><span>{online ? 'On' : 'Off'}</span></button><div className="grid grid-cols-3 gap-2.5">{[{ label: 'Today’s earnings', value: '₹4,850', icon: CircleDollarSign }, { label: 'Jobs complete', value: '04', icon: CheckCircle2 }, { label: 'Rating', value: '4.9 ★', icon: Star }].map(({ label, value, icon: Icon }) => <Panel key={label} className="p-3"><Icon size={17} className="text-cyan-200" /><p className="mt-3 text-base font-extrabold">{value}</p><p className="mt-1 text-[10px] leading-snug text-slate-400">{label}</p></Panel>)}</div><Panel><div className="flex items-center justify-between"><SectionHeading eyebrow="DISPATCH RADAR" title="Incoming job" /><StatusBadge tone="amber">NEW</StatusBadge></div><div className="flex items-start gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-amber-300/10 text-amber-100"><CarFront size={21} /></span><div className="flex-1"><p className="text-sm font-bold">Swift Dzire · Flat tyre</p><p className="mt-1 text-xs text-slate-400">2.1 km · Bypass junction · Customer: Akhil</p></div><span className="text-sm font-extrabold text-emerald-200">₹650</span></div><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setActiveRequest('Flat tyre & battery issue'); setRequestStage(0); setTab('jobs'); notify('Job accepted. Contact the customer directly.') }} disabled={!online} className="min-h-11 rounded-xl bg-cyan-300 text-xs font-extrabold text-[#07141d] disabled:opacity-40">Accept job</button><button type="button" onClick={() => notify('Job passed to the next available partner')} className="min-h-11 rounded-xl border border-white/10 text-xs font-bold text-slate-300">Pass</button></div></Panel><Panel><SectionHeading eyebrow="GROW YOUR SHOP" title="Partner tools" /><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => goToTab('offers')} className="min-h-20 rounded-xl border border-white/10 bg-[#0c1420] p-3 text-left"><Star size={17} className="text-cyan-200" /><span className="mt-2 block text-xs font-bold">Post an offer</span></button><button type="button" onClick={() => goToTab('invoice')} className="min-h-20 rounded-xl border border-white/10 bg-[#0c1420] p-3 text-left"><FileText size={17} className="text-cyan-200" /><span className="mt-2 block text-xs font-bold">Create an invoice</span></button></div></Panel></div>}
          {tab === 'jobs' && <div className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Dispatch & jobs</p><h1 className="mt-1 text-2xl font-extrabold">Partner jobs</h1></div><PartnerRoadsideJobs requests={partnerJobs} garageName={garageName} busyRequestId={partnerJobBusyId} onAction={(request) => void handlePartnerJobAction(request)} /><Panel className="hidden"><SectionHeading eyebrow="NEW REQUEST · 25 SEC TO RESPOND" title="Flat tyre & battery issue" /><p className="text-sm font-semibold">Swift Dzire · KL 07 AB 4200</p><p className="mt-1 text-xs text-slate-400">2.1 km away · Bypass junction · Estimated payout ₹650</p><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setActiveRequest('Flat tyre & battery issue'); setRequestStage(0); notify('Dispatch accepted') }} disabled={!online} className="min-h-12 rounded-xl bg-cyan-300 text-xs font-extrabold text-[#07141d] disabled:opacity-40">Accept job</button><button type="button" onClick={() => notify('Request passed to another available garage')} className="min-h-12 rounded-xl border border-white/10 text-xs font-bold text-slate-300">Pass request</button></div></Panel>{activeRequest && <Panel className="hidden"><SectionHeading eyebrow="ACTIVE DISPATCH" title="Job AZ-2847" /><p className="text-xs text-slate-400">{activeRequest} · 2.1 km away</p><div className="mt-4 flex flex-col gap-2">{['Accepted', 'En route', 'Arrived at spot', 'Service completed'].map((step, index) => <button key={step} type="button" onClick={() => { setRequestStage(index); if (index === 3) notify('Demo job marked complete. No customer data was changed.') }} className="flex min-h-11 items-center gap-3 rounded-xl bg-[#0c1420] px-3 text-left"><span className={cx('flex size-6 items-center justify-center rounded-full border text-[10px] font-bold', requestStage >= index ? 'border-cyan-300 bg-cyan-300 text-[#07141d]' : 'border-slate-700 text-slate-500')}>{requestStage > index ? <Check size={13} /> : index + 1}</span><span className={cx('text-xs font-semibold', requestStage >= index ? 'text-white' : 'text-slate-500')}>{step}</span>{requestStage === index && <span className="ml-auto text-[10px] font-bold text-cyan-200">Current</span>}</button>)}</div><button type="button" onClick={() => setDialog('estimate')} className="mt-3 min-h-11 w-full rounded-xl border border-cyan-300/25 text-xs font-bold text-cyan-100">Send repair estimate</button><button type="button" onClick={() => makeCall('Akhil Menon', false)} className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 text-xs font-extrabold text-[#07141d]"><Phone size={15} /> Simulate customer call</button></Panel>}</div>}
          {tab === 'offers' && <div className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Customer marketplace</p><h1 className="mt-1 text-2xl font-extrabold">Offers & boosts</h1><p className="mt-1 text-xs text-slate-400">Post clear service pricing and bring new drivers to your garage.</p></div><Panel><div className="flex items-start gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-amber-300/10 text-amber-100"><Zap size={19} /></span><div className="flex-1"><h2 className="text-sm font-bold">Boost a local offer</h2><p className="mt-1 text-xs text-slate-400">Feature your offer in nearby customer feeds for 3 days.</p></div></div><div className="mt-3 flex items-center justify-between rounded-xl bg-[#0b131e] p-3"><span className="text-xs text-slate-400">3-day sponsored placement</span><span className="text-sm font-extrabold text-white">₹100</span></div><button type="button" onClick={() => setDialog('boost')} className="mt-3 min-h-11 w-full rounded-xl border border-amber-200/20 bg-amber-300/[0.08] text-xs font-extrabold text-amber-100">Preview demo boost payment</button></Panel><Panel><SectionHeading eyebrow="YOUR LIVE OFFERS" title="Customer-facing deals" /><form onSubmit={publishOffer} className="flex flex-col gap-3"><FormField label="Service or offer name" value={offerForm.name} onChange={(value) => setOfferForm((current) => ({ ...current, name: value }))} placeholder="Full oil service" required /><div className="grid grid-cols-2 gap-3"><FormField label="Price (₹)" type="number" min="1" value={offerForm.price} onChange={(value) => setOfferForm((current) => ({ ...current, price: value }))} placeholder="1499" required /><FormField label="Valid until" type="date" value={offerForm.expiry} onChange={(value) => setOfferForm((current) => ({ ...current, expiry: value }))} /></div><PrimaryButton type="submit"><Plus size={16} /> Publish offer</PrimaryButton></form></Panel><div className="flex flex-col gap-3">{deals.map((deal) => <Panel key={deal.id} className="flex items-center justify-between gap-3 p-3.5"><div className="min-w-0"><div className="flex items-center gap-2"><h2 className="truncate text-sm font-bold">{deal.name}</h2>{deal.sponsored && <StatusBadge tone="amber">Sponsored</StatusBadge>}</div><p className="mt-1 text-xs text-slate-400">{deal.detail}</p></div><span className="shrink-0 text-sm font-extrabold">₹{deal.price.toLocaleString('en-IN')}</span></Panel>)}</div></div>}
          {tab === 'invoice' && <div className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Customer billing</p><h1 className="mt-1 text-2xl font-extrabold">Digital invoice</h1><p className="mt-1 text-xs text-slate-400">Prepare a clear itemized receipt to download and share.</p></div><InvoiceHistory invoices={remoteData?.invoices ?? []} /><Panel><div className="flex flex-col gap-3"><FormField label="Customer name" value={invoiceCustomer} onChange={setInvoiceCustomer} placeholder="Customer name" required /><FormField label="Customer email" type="email" value={invoiceCustomerEmail} onChange={setInvoiceCustomerEmail} placeholder="customer@example.com" /><FormField label="Vehicle" value={invoiceVehicle} onChange={setInvoiceVehicle} placeholder="Vehicle and registration" required /></div><div className="mt-5 flex items-center justify-between"><h2 className="text-sm font-bold">Parts & labour</h2><button type="button" onClick={() => setInvoiceRows((rows) => [...rows, { description: '', quantity: 1, amount: 0 }])} className="flex min-h-10 items-center gap-1 rounded-lg border border-white/10 px-3 text-xs font-bold text-cyan-100"><Plus size={14} /> Add line</button></div><div className="mt-3 flex flex-col gap-3">{invoiceRows.map((row, index) => <div key={index} className="grid grid-cols-[1fr_58px_84px_36px] items-end gap-2"><label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-semibold text-slate-400">Description<input aria-label={`Invoice line ${index + 1} description`} value={row.description} onChange={(event) => setInvoiceRows((rows) => rows.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} className="h-11 min-w-0 rounded-lg border border-white/10 bg-[#0b131e] px-2 text-xs text-white outline-none focus:border-cyan-300/50" /></label><label className="flex flex-col gap-1.5 text-[10px] font-semibold text-slate-400">Qty<input aria-label={`Invoice line ${index + 1} quantity`} type="number" min="1" value={row.quantity} onChange={(event) => setInvoiceRows((rows) => rows.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.max(1, Number(event.target.value)) } : item))} className="h-11 w-full rounded-lg border border-white/10 bg-[#0b131e] px-2 text-xs text-white outline-none" /></label><label className="flex flex-col gap-1.5 text-[10px] font-semibold text-slate-400">Amount<input aria-label={`Invoice line ${index + 1} amount`} type="number" min="0" value={row.amount} onChange={(event) => setInvoiceRows((rows) => rows.map((item, itemIndex) => itemIndex === index ? { ...item, amount: Math.max(0, Number(event.target.value)) } : item))} className="h-11 w-full rounded-lg border border-white/10 bg-[#0b131e] px-2 text-xs text-white outline-none" /></label><button type="button" aria-label={`Remove invoice line ${index + 1}`} onClick={() => setInvoiceRows((rows) => rows.filter((_, itemIndex) => itemIndex !== index))} className="mb-0.5 flex size-10 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5"><X size={15} /></button></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-sm font-bold">Total due</span><span className="text-xl font-extrabold text-cyan-100">₹{invoiceTotal.toLocaleString('en-IN')}</span></div><button type="button" onClick={downloadInvoice} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 text-sm font-extrabold text-[#07141d]"><Download size={17} /> Download digital receipt</button><p className="mt-2 text-center text-[10px] text-slate-500">Demo invoice · Not a GST or tax document.</p></Panel></div>}
          {tab === 'profile' && <PartnerSetup partnerServices={partnerServices} setPartnerServices={setPartnerServices} location={garageAddress} setLocation={setGarageAddress} garageName={garageName} setGarageName={setGarageName} garagePhone={garagePhone} setGaragePhone={setGaragePhone} notify={notify} onSave={saveGarage} />}
        </>}

        {role === 'merchant' && <>
          {tab === 'home' && <div className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Spare parts merchant</p><h1 className="mt-1 text-2xl font-extrabold">Kochi Motor Store</h1><p className="mt-1 text-xs text-slate-400">Manage inventory and fulfil nearby orders.</p></div><Panel className="flex items-center justify-between"><div><p className="text-xs text-slate-400">Store status</p><p className="mt-1 text-sm font-bold">Open · Edappally, Kochi</p></div><StatusBadge tone="green">Verified</StatusBadge></Panel><div className="grid grid-cols-2 gap-3"><Panel><ShoppingBag size={18} className="text-cyan-200" /><p className="mt-3 text-xl font-extrabold">{products.length}</p><p className="mt-1 text-xs text-slate-400">Parts listed</p></Panel><Panel><ShoppingCart size={18} className="text-cyan-200" /><p className="mt-3 text-xl font-extrabold">{orderStage ? '1' : '3'}</p><p className="mt-1 text-xs text-slate-400">Open orders</p></Panel></div><Panel><SectionHeading eyebrow="SELLER TOOLS" title="Quick actions" /><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setDialog('product')} className="min-h-24 rounded-xl border border-white/10 bg-[#0b131e] p-3 text-left"><Plus size={18} className="text-cyan-200" /><span className="mt-3 block text-xs font-bold">List a part</span></button><button type="button" onClick={() => goToTab('orders')} className="min-h-24 rounded-xl border border-white/10 bg-[#0b131e] p-3 text-left"><Package size={18} className="text-cyan-200" /><span className="mt-3 block text-xs font-bold">Review orders</span></button></div></Panel><Panel><SectionHeading eyebrow="YOUR CATALOG" title="Recently listed" /><div className="flex flex-col gap-3">{products.slice(0, 3).map((product) => <div key={product.id} className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"><div><p className="text-sm font-semibold">{product.name}</p><p className="mt-1 text-xs text-slate-400">{product.fitment}</p></div><span className="text-sm font-bold">₹{product.price.toLocaleString('en-IN')}</span></div>)}</div></Panel></div>}
          {tab === 'catalog' && <div className="flex flex-col gap-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Inventory</p><h1 className="mt-1 text-2xl font-extrabold">Parts catalog</h1></div><button type="button" onClick={() => setDialog('product')} className="flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-3 text-xs font-extrabold text-[#07141d]"><Plus size={15} /> Add part</button></div><label className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-[#111a27] px-3.5"><Search size={17} className="text-slate-500" /><span className="sr-only">Search catalog</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search inventory" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600" /></label>{products.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())).map((product) => <Panel key={product.id} className="flex items-center gap-3"><Package size={21} className="shrink-0 text-cyan-200" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{product.name}</p><p className="mt-1 text-xs text-slate-400">{product.fitment} · {product.category}</p></div><span className="text-sm font-extrabold">₹{product.price.toLocaleString('en-IN')}</span></Panel>)}</div>}
          {tab === 'orders' && <div className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Fulfilment</p><h1 className="mt-1 text-2xl font-extrabold">Orders & delivery</h1></div><Panel><div className="flex items-start justify-between"><div><StatusBadge tone={orderStage === 2 ? 'green' : 'amber'}>{orderStage === 0 ? 'New order' : orderStage === 1 ? 'Confirmed' : 'Ready to ship'}</StatusBadge><h2 className="mt-3 text-sm font-bold">AZ-ORD-2048</h2><p className="mt-1 text-xs text-slate-400">Akhil M. · Edappally · 1 item</p></div><span className="text-sm font-extrabold">₹620</span></div><div className="mt-4 rounded-xl bg-[#0b131e] p-3"><p className="text-xs font-bold">Bosch oil filter</p><p className="mt-1 text-[10px] text-slate-500">Hyundai Creta · 2020–2024</p><p className="mt-2 flex items-center gap-1.5 text-[10px] text-cyan-100"><Clock3 size={12} /> Delivery estimate · 2–3 days</p></div><button type="button" onClick={() => { setOrderStage((stage) => Math.min(2, stage + 1)); notify(orderStage === 0 ? 'Order confirmed' : 'Order marked ready to ship') }} className="mt-4 min-h-11 w-full rounded-xl bg-cyan-300 text-xs font-extrabold text-[#07141d]">{orderStage === 0 ? 'Confirm order' : orderStage === 1 ? 'Mark ready to ship' : 'Ready for pickup'}</button></Panel></div>}
          {tab === 'profile' && <PartnerSetup partnerServices={partnerServices} setPartnerServices={setPartnerServices} location={location} setLocation={setLocation} notify={notify} merchant />}
        </>}
      </main>

      <nav aria-label="Main navigation" className="order-2 z-30 grid shrink-0 border-t border-white/[0.07] bg-[#0c131e]/95 px-1 pb-[max(env(safe-area-inset-bottom),7px)] pt-2 backdrop-blur-xl" style={{ gridTemplateColumns: `repeat(${tabItems.length}, minmax(0, 1fr))` }}>{tabItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => goToTab(id)} aria-current={tab === id ? 'page' : undefined} className={cx('flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300', tab === id ? 'text-cyan-200' : 'text-slate-500 hover:text-slate-200')}><span className={cx('flex size-8 items-center justify-center rounded-xl', tab === id && 'bg-cyan-300/[0.1]')}><Icon size={18} strokeWidth={tab === id ? 2.3 : 1.8} /></span><span className="max-w-full truncate px-1 text-[9px] font-semibold">{label}</span></button>)}</nav>
      <div className="order-1 z-20 flex shrink-0 items-center justify-between gap-2 border-t border-white/[0.06] bg-[#0d1520] px-3 py-2"><span className="text-[10px] font-semibold text-slate-400">24/7 demo support</span><button type="button" onClick={() => { setSupportContext('Autozync Help Desk'); setDialog('support') }} className="flex min-h-11 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 text-[10px] font-bold text-emerald-100"><MessageCircle size={14} /> Help & Support</button></div>
      {toast && <div role="status" aria-live="polite" className="absolute bottom-[142px] left-1/2 z-40 max-w-[calc(100%-32px)] -translate-x-1/2 rounded-full border border-cyan-300/20 bg-[#172536] px-4 py-3 text-center text-xs font-semibold text-cyan-100 shadow-xl">{toast}</div>}

      {dialog === 'request' && <ModalFrame title="Confirm roadside help" close={() => setDialog(null)}><form onSubmit={requestService} className="flex flex-col gap-4"><div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-cyan-100">Selected service</p><h3 className="mt-1 text-lg font-extrabold">{selectedService}</h3><div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 text-xs"><span className="text-slate-400">Vehicle</span><span className="font-bold">{vehicleType} · {vehicles[0]?.model ?? 'Vehicle'}</span></div><div className="mt-2 flex items-center justify-between text-xs"><span className="text-slate-400">Pickup</span><span className="font-bold">{location}</span></div><div className="mt-2 flex items-center justify-between text-xs"><span className="text-slate-400">Estimated arrival</span><span className="font-bold text-cyan-100">About 6 minutes</span></div></div><label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Optional note<input value={requestNote} onChange={(event) => setRequestNote(event.target.value)} maxLength={500} className={palette.input} placeholder="Tell the partner anything helpful" /></label><PrimaryButton type="submit"><Siren size={16} /> Confirm request</PrimaryButton><p className="text-center text-[10px] text-slate-500">Prototype request only. No real dispatch or charge.</p></form></ModalFrame>}
      {dialog === 'review' && reviewTarget && <ModalFrame title="Rate your roadside service" close={dismissServiceReview} wide><form onSubmit={submitServiceReview} className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-200">Verified service completed</p><h2 className="mt-2 text-lg font-extrabold">How was your experience with {remoteData?.garageRatings.find((garage) => garage.user_id === reviewTarget.assigned_partner_id)?.business_name ?? 'your garage'}?</h2><p className="mt-2 text-xs leading-relaxed text-slate-400">Your review is linked to {reviewTarget.service_name} and can only be submitted once for this completed service.</p></div><fieldset className="flex flex-col gap-2"><legend className="text-xs font-bold text-slate-200">Your rating</legend><div role="radiogroup" aria-label="Rating from one to five stars" className="flex items-center gap-2">{[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" role="radio" aria-checked={reviewRating === rating} aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`} onClick={() => { setReviewRating(rating); setReviewError('') }} className={cx('flex size-11 items-center justify-center rounded-xl border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300', reviewRating >= rating ? 'border-amber-200/30 bg-amber-300/10 text-amber-200' : 'border-white/10 bg-white/[0.03] text-slate-600')}><Star size={21} fill={reviewRating >= rating ? 'currentColor' : 'none'} /></button>)}</div><p className="text-[10px] text-slate-500">{reviewRating ? `${reviewRating} out of 5 stars` : 'Select one to five stars'}</p></fieldset><fieldset className="flex flex-col gap-2"><legend className="text-xs font-bold text-slate-200">Quick feedback <span className="font-normal text-slate-500">· optional, up to 5</span></legend><div className="flex flex-wrap gap-2">{reviewFeedbackOptions.map((tag) => { const selected = reviewTags.includes(tag); return <button key={tag} type="button" aria-pressed={selected} onClick={() => setReviewTags((current) => selected ? current.filter((item) => item !== tag) : current.length < 5 ? [...current, tag] : current)} className={cx('min-h-10 rounded-full border px-3 text-[11px] font-semibold transition', selected ? 'border-cyan-200/40 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.03] text-slate-400')}>{tag}</button> })}</div></fieldset><label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Review details <span className="font-normal text-slate-500">· optional</span><textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} maxLength={1000} rows={4} placeholder="Share anything else about your service" className={cx(palette.input, 'resize-y')} /><span className="text-right text-[10px] text-slate-500">{reviewText.length}/1000</span></label>{reviewError && <p role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-3 text-xs text-rose-100">{reviewError}</p>}<PrimaryButton type="submit" disabled={reviewBusy}>{reviewBusy ? 'Submitting review…' : 'Submit Honest Review'}</PrimaryButton><button type="button" onClick={dismissServiceReview} className="min-h-10 text-xs font-semibold text-slate-400">Review later</button></form></ModalFrame>}
      {dialog === 'responders' && <ModalFrame title="Nearest Verified Responders" close={() => setDialog(null)} wide><div className="-m-5 flex max-h-[calc(92dvh-76px)] flex-col"><div className="shrink-0 px-5 pt-5"><div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] p-3.5"><div className="flex items-center gap-2 text-cyan-100"><Siren size={16} /><p className="text-[10px] font-bold uppercase tracking-[0.14em]">{selectedService} assistance</p></div><p className="mt-2 flex items-start gap-2 text-xs text-slate-300"><MapPin size={14} className="mt-0.5 shrink-0 text-cyan-200" /><span className="line-clamp-2">{location}</span></p></div><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Sorted by distance · Kochi</p></div><div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-3"><div className="flex flex-col gap-3">{displayGarages.slice().sort((first, second) => first.distanceKm - second.distanceKm).map((responder) => <article key={responder.name} className="rounded-2xl border border-white/[0.08] bg-[#131d2b] p-3.5"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/[0.09] text-cyan-200"><Store size={18} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1.5"><h3 className="text-sm font-bold text-white">{responder.name}</h3><span className="inline-flex items-center gap-1 rounded-full bg-cyan-300/[0.09] px-2 py-0.5 text-[9px] font-bold text-cyan-100"><BadgeCheck size={12} /> Verified</span></div><p className="mt-1 text-[11px] text-slate-400">{responder.specialty}</p><div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]"><span className="inline-flex items-center gap-1 font-semibold text-amber-200"><Star size={12} fill="currentColor" /> {responder.rating} ★</span><span className="inline-flex items-center gap-1 text-slate-300"><Clock3 size={12} className="text-cyan-200" /> {responder.eta} away</span><span className="inline-flex items-center gap-1 text-slate-400"><MapPin size={12} /> {responder.distance} away</span></div></div></div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => makeCall(responder.name)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-xs font-bold text-cyan-100"><Phone size={15} /> Call Now</button><button type="button" onClick={() => void submitRoadsideRequest(responder.name)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 text-xs font-extrabold text-[#07141d] hover:bg-cyan-200"><Siren size={15} /> Send Request</button></div></article>)}</div></div><div className="shrink-0 border-t border-white/[0.08] bg-[#101927] px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3"><button type="button" onClick={() => { setSupportContext('Autozync 24/7 Emergency Support'); setDialog('support') }} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-3 text-xs font-bold text-emerald-100"><Phone size={15} /> Contact 24/7 Autozync Support</button></div></div></ModalFrame>}
      {dialog === 'vehicle' && <ModalFrame title="Add a vehicle" close={() => setDialog(null)}><form onSubmit={addVehicle} className="flex flex-col gap-3"><FormField label="Vehicle model" value={vehicleForm.model} onChange={(value) => setVehicleForm((current) => ({ ...current, model: value }))} placeholder="e.g. Hyundai Creta" required /><FormField label="Registration number" value={vehicleForm.registration} onChange={(value) => setVehicleForm((current) => ({ ...current, registration: value.toUpperCase() }))} placeholder="KL 07 CX 2481" required /><div className="grid grid-cols-2 gap-3"><FormField label="Year" type="number" min="1980" max="2026" value={vehicleForm.year} onChange={(value) => setVehicleForm((current) => ({ ...current, year: value }))} placeholder="2022" required /><FormField label="Fuel type" value={vehicleForm.fuel} onChange={(value) => setVehicleForm((current) => ({ ...current, fuel: value }))} options={['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']} /></div><FormField label="Vehicle type" value={vehicleForm.kind} onChange={(value) => setVehicleForm((current) => ({ ...current, kind: value }))} options={['Car', 'Bike / scooter', 'Commercial / heavy']} /><PrimaryButton type="submit"><Plus size={16} /> Save vehicle</PrimaryButton><p className="text-center text-[10px] text-slate-500">Saved in this preview session only.</p></form></ModalFrame>}
      {dialog === 'estimate' && <EstimateDialog onClose={() => setDialog(null)} onSend={(amount, details) => { setEstimateAmount(amount); setEstimateDetails(details); setDialog(null); setEstimateStatus('pending'); notify(`Estimate of ₹${amount} sent to the customer for approval`) }} />}
      {dialog === 'offer' && <ModalFrame title="Publish service offer" close={() => setDialog(null)}><form onSubmit={publishOffer} className="flex flex-col gap-3"><FormField label="Offer name" value={offerForm.name} onChange={(value) => setOfferForm((current) => ({ ...current, name: value }))} placeholder="Full oil service" required /><FormField label="Price (₹)" type="number" min="1" value={offerForm.price} onChange={(value) => setOfferForm((current) => ({ ...current, price: value }))} placeholder="1499" required /><FormField label="Offer end date" type="date" value={offerForm.expiry} onChange={(value) => setOfferForm((current) => ({ ...current, expiry: value }))} /><PrimaryButton type="submit">Post offer</PrimaryButton></form></ModalFrame>}
      {dialog === 'boost' && <ModalFrame title="Boost your offer" close={() => setDialog(null)}><div className="rounded-xl border border-amber-200/15 bg-amber-300/[0.05] p-4"><p className="text-sm font-bold">3-day sponsored placement</p><p className="mt-1 text-xs text-slate-400">Your offer is highlighted to customers near Edappally.</p><p className="mt-4 text-3xl font-extrabold">₹100</p><p className="mt-1 text-[10px] text-slate-500">One-time demo payment · No payment processed</p></div><PrimaryButton onClick={() => { setDeals((current) => current.map((deal, index) => index === 0 ? { ...deal, sponsored: true } : deal)); setDialog(null); notify('Demo boost activated. Your offer is marked Sponsored.') }} className="mt-4"><Zap size={16} /> Simulate ₹100 boost</PrimaryButton></ModalFrame>}
      {dialog === 'product' && <ModalFrame title="List a spare part" close={() => setDialog(null)}><form onSubmit={addProduct} className="flex flex-col gap-3"><FormField label="Part name" value={productForm.name} onChange={(value) => setProductForm((current) => ({ ...current, name: value }))} placeholder="Bosch oil filter" required /><FormField label="Vehicle make, model & year" value={productForm.fitment} onChange={(value) => setProductForm((current) => ({ ...current, fitment: value }))} placeholder="Hyundai Creta · 2020–2024" required /><FormField label="Category" value={productForm.category} onChange={(value) => setProductForm((current) => ({ ...current, category: value }))} options={['Engine', 'Brakes', 'Suspension', 'Electrical', 'Body', 'Accessories']} /><div className="grid grid-cols-2 gap-3"><FormField label="Price (₹)" type="number" min="1" value={productForm.price} onChange={(value) => setProductForm((current) => ({ ...current, price: value }))} placeholder="620" required /><FormField label="Delivery estimate" value={productForm.delivery} onChange={(value) => setProductForm((current) => ({ ...current, delivery: value }))} options={['Tomorrow', '2–3 days', '3–4 days', 'Pickup today']} /></div><PrimaryButton type="submit"><Package size={16} /> Add to catalog</PrimaryButton></form></ModalFrame>}
      {dialog === 'checkout' && <ModalFrame title="Your parts cart" close={() => setDialog(null)}>{cart.length === 0 ? <div className="py-5 text-center"><ShoppingCart size={28} className="mx-auto text-slate-500" /><p className="mt-3 text-sm font-bold">Your cart is empty</p><p className="mt-1 text-xs text-slate-400">Add a part to see it here.</p><button type="button" onClick={() => setDialog(null)} className="mt-4 text-xs font-bold text-cyan-100">Continue shopping</button></div> : <form onSubmit={completeCheckout} className="flex flex-col gap-4"><div className="flex flex-col gap-3">{cart.map(({ product, quantity }) => <div key={product.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#0b131e] p-3"><div className="min-w-0 flex-1"><p className="text-sm font-bold">{product.name}</p><p className="mt-1 text-xs text-slate-400">Delivery {product.delivery} · ₹{product.price.toLocaleString('en-IN')} each</p></div><div className="flex items-center gap-2"><button type="button" aria-label={`Remove one ${product.name}`} onClick={() => adjustCartQuantity(product.id, -1)} className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-slate-300"><Minus size={14} /></button><span className="min-w-5 text-center text-sm font-bold">{quantity}</span><button type="button" aria-label={`Add one ${product.name}`} onClick={() => adjustCartQuantity(product.id, 1)} className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-slate-300"><Plus size={14} /></button></div><span className="min-w-[70px] text-right text-sm font-extrabold">₹{(product.price * quantity).toLocaleString('en-IN')}</span></div>)}</div><div className="flex flex-col gap-2 border-t border-white/10 pt-3 text-xs"><div className="flex items-center justify-between"><span className="text-slate-400">Subtotal · {cartCount} items</span><span>₹{cartSubtotal.toLocaleString('en-IN')}</span></div><div className="flex items-center justify-between"><span className="text-slate-400">Estimated GST · 18%</span><span>₹{cartTax.toLocaleString('en-IN')}</span></div><div className="flex items-center justify-between"><span className="text-slate-400">Delivery</span><span>₹{cartDelivery.toLocaleString('en-IN')}</span></div><div className="mt-1 flex items-center justify-between text-sm"><strong>Order total</strong><strong>₹{cartTotal.toLocaleString('en-IN')}</strong></div></div><FormField label="Delivery address" value={location} onChange={setLocation} placeholder="Street, locality, city" required /><PrimaryButton type="submit">Proceed to Order</PrimaryButton><p className="text-center text-[10px] text-slate-500">No payment is collected in this prototype.</p></form>}</ModalFrame>}
      {dialog === 'support' && <SupportDialog contact={supportContext} onClose={() => setDialog(null)} onNotify={notify} />}
      {dialog === 'privacy' && <PrivacyPolicyDialog onClose={() => setDialog(null)} />}
      {dialog === 'delete' && <DeleteAccountDialog onClose={() => setDialog(null)} onDelete={purgeDemoData} />}
      {callingPartner && <ModalFrame title="Simulated call" close={() => setCallingPartner(null)}><div className="flex flex-col items-center py-5 text-center"><span className="flex size-16 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-200"><Phone size={26} /></span><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">Simulated call · no connection made</p><h3 className="mt-2 text-lg font-bold">Calling {callingPartner.name} ({callingPartner.verified ? 'Verified Partner' : 'Demo contact'})…</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">This prototype does not place a real phone call.</p><button type="button" onClick={() => setCallingPartner(null)} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-rose-500/15 text-sm font-bold text-rose-100"><Phone size={16} /> End call</button></div></ModalFrame>}
      {dialog === 'login' && <ModalFrame title={authMode === 'sign-up' ? 'Create your Autozync account' : 'Sign in to Autozync'} close={() => { setDialog(null); setAuthError('') }}><form onSubmit={submitAuth} className="flex flex-col gap-3"><p className="text-xs leading-relaxed text-slate-400">{authMode === 'sign-up' ? 'Create a secure account to sync your vehicles, service requests, and garage records.' : 'Sign in to access your saved Autozync data.'}</p>{authMode === 'sign-up' && <><FormField label="Full name" value={authFullName} onChange={setAuthFullName} autoComplete="name" placeholder="Your name" required /><label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Account type<select value={authAccountType} onChange={(event) => setAuthAccountType(event.target.value as 'customer' | 'partner')} className={palette.input}><option value="customer">Customer</option><option value="partner">Garage partner</option></select></label></>}<FormField label="Email address" type="email" value={authEmail} onChange={setAuthEmail} autoComplete="email" placeholder="name@example.com" required /><FormField label="Password" type="password" value={authPassword} onChange={setAuthPassword} autoComplete={authMode === 'sign-up' ? 'new-password' : 'current-password'} minLength={8} placeholder="At least 8 characters" required /><p className="text-[10px] text-slate-500">Use at least 8 characters.</p>{authError && <p role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-3 text-xs text-rose-100">{authError}</p>}<PrimaryButton type="submit" disabled={authBusy}>{authBusy ? 'Please wait…' : authMode === 'sign-up' ? 'Create account' : 'Sign in'}</PrimaryButton><button type="button" onClick={() => { setAuthMode((mode) => mode === 'sign-in' ? 'sign-up' : 'sign-in'); setAuthError('') }} className="min-h-10 text-xs font-semibold text-cyan-100">{authMode === 'sign-up' ? 'Already have an account? Sign in' : 'New to Autozync? Create an account'}</button><p className="text-center text-[10px] text-slate-500">Your account is secured by Supabase Auth. Garage and customer records are protected by row-level security.</p></form></ModalFrame>}
    </div>
    <VehicleLoader message={loaderMessage} />
  </div>
}

function ProfileScreen({ role, name, setName, notify, onLogin, onSignOut, onSaveName, authenticated, email, onSupport, themeMode, onThemeChange, onPrivacy, onDelete, resolvedTheme }: { role: Role; name: string; setName: (name: string) => void; notify: (message: string) => void; onLogin: () => void; onSignOut: () => void; onSaveName: () => Promise<boolean>; authenticated: boolean; email: string; onSupport: () => void; themeMode: ThemeMode; onThemeChange: (mode: ThemeMode) => void; onPrivacy: () => void; onDelete: () => void; resolvedTheme: ThemeAppearance }) {
  const [editing, setEditing] = useState(false)
  const ThemeIcon = resolvedTheme === 'dark' ? Moon : Sun
  return <div className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Your Autozync account</p><h1 className="mt-1 text-2xl font-extrabold">Profile & support</h1></div><Panel><div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-300/[0.09] text-cyan-100"><UserRound size={22} /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold">{name || 'Your profile'}</p><p className="mt-1 text-xs text-slate-400">{role === 'customer' ? 'Customer profile' : role === 'merchant' ? 'Merchant profile' : 'Partner profile'} · {authenticated ? 'Synced with Supabase' : 'Sign in to sync'}</p>{authenticated && email && <p className="mt-1 truncate text-[10px] text-slate-500">{email}</p>}</div><button type="button" onClick={() => editing ? void onSaveName().then((saved) => { if (saved) setEditing(false) }) : setEditing(true)} className="min-h-10 rounded-lg px-3 text-xs font-bold text-cyan-100">{editing ? 'Save' : 'Edit'}</button></div>{editing && <input aria-label="Profile name" value={name} onChange={(event) => setName(event.target.value)} className={cx(palette.input, 'mt-4')} />}</Panel>{authenticated ? <button type="button" onClick={onSignOut} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-bold text-slate-200"><UserRound size={16} /> Sign out</button> : <button type="button" onClick={onLogin} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-sm font-bold text-cyan-100"><UserRound size={16} /> Sign in or create account</button>}<Panel><SectionHeading eyebrow="WE ARE HERE 24/7" title="Direct support" /><p className="text-xs leading-relaxed text-slate-400">Need help with a roadside request, order, or your account? Contact the Autozync demo support line.</p><button type="button" onClick={onSupport} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 text-sm font-extrabold text-[#07141d]"><Phone size={16} /> Help & Support</button></Panel><Panel><SectionHeading eyebrow="PRIVACY & DATA SAFETY" title="Your data, your choice" /><p className="text-xs leading-relaxed text-slate-400">Precise location is never tracked in the background. It is requested only in the user-initiated roadside SOS flow and is saved with a roadside request only when you submit one.</p><div className="mt-3 flex flex-col gap-2"><button type="button" onClick={onPrivacy} className="flex min-h-11 items-center justify-between rounded-xl border border-white/[0.08] bg-[#0b131e] px-3 text-left text-xs font-semibold text-slate-200"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-cyan-200" /> Privacy Policy</span><ChevronRight size={15} /></button><button type="button" onClick={onDelete} className="flex min-h-11 items-center justify-between rounded-xl border border-rose-300/15 bg-rose-300/[0.04] px-3 text-left text-xs font-semibold text-rose-100"><span className="flex items-center gap-2"><X size={15} /> Delete Account & Purge Data</span><ChevronRight size={15} /></button></div><p className="mt-2 text-[10px] leading-relaxed text-slate-500">Your Supabase account and records stay synced across sessions. Cart and demo orders remain temporary.</p></Panel><Panel><SectionHeading eyebrow="PREFERENCES" title="Your settings" /><label className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-slate-300"><span className="flex items-center gap-2"><ThemeIcon size={15} className="text-cyan-200" /> Appearance</span><select aria-label="Color theme" value={themeMode} onChange={(event) => onThemeChange(event.target.value as ThemeMode)} className="min-h-10 rounded-lg border border-white/10 bg-[#0b131e] px-3 text-xs text-slate-200"><option value="system">System default</option><option value="light">Light</option><option value="dark">Dark</option></select></label><label className="flex min-h-12 items-center justify-between border-b border-white/[0.07] text-sm"><span className="flex items-center gap-2 text-slate-200"><Languages size={16} className="text-cyan-200" /> Language</span><span className="text-xs text-slate-400">Choose above</span></label><button type="button" onClick={() => notify('Notification preferences updated for this session')} className="flex min-h-12 w-full items-center justify-between border-b border-white/[0.07] text-sm"><span className="flex items-center gap-2"><Activity size={16} className="text-cyan-200" /> Notifications</span><ChevronRight size={16} className="text-slate-500" /></button><button type="button" onClick={() => notify('Help center opened in demo mode')} className="flex min-h-12 w-full items-center justify-between text-sm"><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-cyan-200" /> Privacy & help</span><ChevronRight size={16} className="text-slate-500" /></button></Panel><p className="text-center text-[10px] text-slate-600">Autozync preview · Account records sync to Supabase when you are signed in.</p></div>
}

function SupportDialog({ contact, onClose, onNotify }: { contact: string; onClose: () => void; onNotify: (message: string) => void }) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  return <ModalFrame title="Help & Support" close={onClose}><div className="flex flex-col gap-4"><div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] p-3"><p className="text-xs font-bold text-cyan-100">{contact}</p><p className="mt-1 text-[11px] text-slate-400">Verified demo contact · support@autozync.example</p></div><p className="text-xs leading-relaxed text-slate-400">Tell us what you need. This support conversation is simulated in the prototype; no message is sent to a phone number or external service.</p>{sent ? <div role="status" className="rounded-xl border border-emerald-300/15 bg-emerald-300/[0.05] p-3 text-sm font-semibold text-emerald-100">Your demo request is ready. A support specialist would follow up in the full app.</div> : <form onSubmit={(event) => { event.preventDefault(); if (!message.trim()) return; setSent(true); onNotify('Support request simulated for this preview') }} className="flex flex-col gap-3"><label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">How can we help?<textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} maxLength={500} required placeholder="Describe your roadside, order, or account question" className={palette.input} /></label><PrimaryButton type="submit"><MessageCircle size={16} /> Send demo request</PrimaryButton></form>}<button type="button" onClick={onClose} className="min-h-10 text-xs font-semibold text-slate-400">Close</button></div></ModalFrame>
}

function PrivacyPolicyDialog({ onClose }: { onClose: () => void }) {
  return <ModalFrame title="Privacy & Data Safety" close={onClose}><div className="flex flex-col gap-4 text-xs leading-relaxed text-slate-300"><p className="text-sm font-bold text-white">Your information stays in your control.</p><section><h3 className="font-bold text-cyan-100">Location</h3><p className="mt-1 text-slate-400">Autozync does not track location in the background. Precise location is requested only in the user-initiated roadside SOS flow. If you submit an authenticated roadside request, the selected location and coordinates are saved with that request so your garage can respond.</p></section><section><h3 className="font-bold text-cyan-100">Profile and vehicle details</h3><p className="mt-1 text-slate-400">When you sign in, your profile, vehicles, roadside requests, garage listing, and invoices are stored in Supabase and protected by row-level security. Cart and demo order data remain in this browser session. Location is only requested when you choose roadside SOS.</p></section><section><h3 className="font-bold text-cyan-100">Your choices</h3><p className="mt-1 text-slate-400">You can deny location access. Delete Account & Purge Data removes your Supabase sign-in account, profile, vehicles, service requests, garage listing, and invoices.</p></section><p className="rounded-xl border border-white/[0.08] bg-[#0b131e] p-3 text-[10px] text-slate-500">The live privacy policy and account deletion request are available from this profile screen.</p><PrimaryButton onClick={onClose}>Done</PrimaryButton></div></ModalFrame>
}

function DeleteAccountDialog({ onClose, onDelete }: { onClose: () => void; onDelete: () => void }) {
  const [confirmation, setConfirmation] = useState('')
  return <ModalFrame title="Delete Account & Purge Data" close={onClose}><div className="flex flex-col gap-4"><div className="rounded-xl border border-rose-300/20 bg-rose-300/[0.05] p-3"><p className="text-sm font-bold text-rose-100">This action cannot be undone.</p><p className="mt-1 text-xs leading-relaxed text-slate-400">This permanently deletes your Supabase sign-in account, profile, vehicles, service requests, garage listing, and digital invoices. You will be signed out. This cannot be undone.</p></div><label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Type DELETE to confirm<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" className={palette.input} /></label><button type="button" disabled={confirmation !== 'DELETE'} onClick={onDelete} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40"><X size={16} /> Delete Account & Purge Data</button><button type="button" onClick={onClose} className="min-h-10 text-xs font-semibold text-slate-400">Cancel</button></div></ModalFrame>
}

function PartnerSetup({ partnerServices, setPartnerServices, location, setLocation, garageName = '', setGarageName, garagePhone = '', setGaragePhone, notify, onSave, merchant = false }: { partnerServices: string[]; setPartnerServices: (services: string[]) => void; location: string; setLocation: (location: string) => void; garageName?: string; setGarageName?: (name: string) => void; garagePhone?: string; setGaragePhone?: (phone: string) => void; notify: (message: string) => void; onSave?: () => Promise<void>; merchant?: boolean }) {
  const checklist = merchant ? ['Car accessories', 'Engine parts', 'Brakes & suspension', 'Electrical', 'Body & paint', 'Same-day pickup'] : ['Oil service', 'Engine', 'Bodywork / painting', 'AC / Electrical', 'Alignment & tyres', 'Accessories', '24/7 towing']
  return <div className="flex flex-col gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">{merchant ? 'Merchant profile' : 'Partner profile'}</p><h1 className="mt-1 text-2xl font-extrabold">{merchant ? 'Store setup' : 'Workshop setup'}</h1><p className="mt-1 text-xs text-slate-400">Keep your details current so nearby customers can find you.</p></div><Panel><SectionHeading eyebrow="LISTING DETAILS" title={merchant ? 'Kochi Motor Store' : 'Star Auto Care'} /><div className="flex items-center gap-3 rounded-xl bg-[#0b131e] p-3"><span className="flex size-11 items-center justify-center rounded-xl bg-cyan-300/[0.09] text-cyan-200"><Store size={20} /></span><div className="flex-1"><p className="text-sm font-bold">{garageName || (merchant ? 'Kochi Motor Store' : 'Your garage')}</p><p className="mt-1 text-xs text-slate-400">{merchant ? 'Parts marketplace' : 'Garage partner listing'}</p></div><BadgeCheck size={19} className="text-cyan-200" /></div>{!merchant && <div className="mt-4 grid gap-3"><FormField label="Business name" value={garageName} onChange={(value) => setGarageName?.(value)} placeholder="Your workshop name" required /><FormField label="Phone number" type="tel" value={garagePhone} onChange={(value) => setGaragePhone?.(value)} placeholder="+91 98765 43210" required /></div>}<label className="mt-4 flex flex-col gap-2 text-xs font-semibold text-slate-300">Location pin / address<input value={location} onChange={(event) => setLocation(event.target.value)} className={palette.input} /></label><div className="mt-3 grid grid-cols-2 gap-3"><label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Opens<input type="time" defaultValue="09:00" className={palette.input} /></label><label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Closes<input type="time" defaultValue="20:00" className={palette.input} /></label></div><label className="mt-3 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 text-xs font-bold text-slate-300"><Plus size={16} /> Add workshop photos<input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { if (event.target.files?.length) notify(`${event.target.files.length} photo(s) selected for preview only`) }} /></label>{!merchant && onSave && <PrimaryButton onClick={() => void onSave()} className="mt-4"><Check size={16} /> Save garage details</PrimaryButton>}</Panel><Panel><SectionHeading eyebrow="WHAT YOU OFFER" title={merchant ? 'Parts categories' : 'Service checklist'} /><div className="flex flex-col">{checklist.map((service) => { const checked = partnerServices.includes(service); return <label key={service} className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-white/[0.06] last:border-0"><input type="checkbox" checked={checked} onChange={() => setPartnerServices(checked ? partnerServices.filter((item) => item !== service) : [...partnerServices, service])} className="size-5 accent-cyan-300" /><span className="text-sm font-medium">{service}</span></label> })}</div></Panel><button type="button" onClick={() => notify('Business profile updated for this session')} className="min-h-12 rounded-xl bg-cyan-300 text-sm font-extrabold text-[#07141d]">Save profile updates</button></div>
}

function EstimateDialog({ onClose, onSend }: { onClose: () => void; onSend: (amount: number, details: string) => void }) {
  const [amount, setAmount] = useState('3050')
  const [details, setDetails] = useState('Brake pads ₹2,400 · Labour ₹650')
  return <ModalFrame title="Send repair estimate" close={onClose}><form onSubmit={(event) => { event.preventDefault(); onSend(Number(amount), details) }} className="flex flex-col gap-3"><p className="text-xs leading-relaxed text-slate-400">The customer can review and approve this estimate before work begins.</p><FormField label="Work and parts breakdown" value={details} onChange={setDetails} placeholder="Describe parts and labour" required /><FormField label="Estimated total (₹)" type="number" min="1" value={amount} onChange={setAmount} required /><PrimaryButton type="submit"><FileText size={16} /> Send for approval</PrimaryButton><p className="text-center text-[10px] text-slate-500">No charge is collected by this prototype.</p></form></ModalFrame>
}

