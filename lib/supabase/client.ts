import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | undefined

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { cookieOptions: { secure: process.env.NODE_ENV === 'production' } },
    )
  }

  return browserClient
}

export type SupabaseBrowserClient = ReturnType<typeof createClient>

export type ServiceRequestRow = {
  id: string
  service_name: string
  vehicle_type: string
  vehicle_model: string
  location: string
  coordinates: string
  note: string
  status: string
  assigned_partner_id: string | null
  created_at: string
}

export type GarageRatingRow = {
  user_id: string
  business_name: string
  average_rating: number | null
  review_count: number
}

export type VehicleRow = {
  id: string
  registration: string
  model: string
  year: string
  fuel: string
  kind: string
  created_at: string
}

export type InvoiceRow = {
  id: string
  customer_name: string
  customer_email: string
  vehicle: string
  line_items: { description: string; quantity: number; amount: number }[]
  total: number
  currency: string
  created_at: string
}

export type AutozyncRemoteData = {
  profile: { id: string; email: string; full_name: string; account_type: string } | null
  vehicles: VehicleRow[]
  requests: ServiceRequestRow[]
  reviews: { service_request_id: string }[]
  garageRatings: GarageRatingRow[]
  garage: { business_name: string; phone: string; address: string; services: string[]; approval_status: string } | null
  invoices: InvoiceRow[]
}

export async function loadAutozyncData(userId: string): Promise<AutozyncRemoteData> {
  const supabase = createClient()
  const [profileResult, vehiclesResult, requestsResult, reviewsResult, garageRatingsResult, garageResult, invoicesResult] = await Promise.all([
    supabase.from('profiles').select('id,email,full_name,account_type').eq('id', userId).maybeSingle(),
    supabase.from('customer_vehicles').select('id,registration,model,year,fuel,kind,created_at').eq('owner_id', userId).order('created_at', { ascending: false }),
    supabase.from('service_requests').select('id,service_name,vehicle_type,vehicle_model,location,coordinates,note,status,assigned_partner_id,created_at').or(`customer_id.eq.${userId},assigned_partner_id.eq.${userId},and(status.eq.open,assigned_partner_id.is.null)`).order('created_at', { ascending: false }),
    supabase.from('service_reviews').select('service_request_id').eq('reviewer_id', userId),
    supabase.rpc('get_garage_public_ratings'),
    supabase.from('garage_partners').select('business_name,phone,address,services,approval_status').eq('user_id', userId).maybeSingle(),
    supabase.from('digital_invoices').select('id,customer_name,customer_email,vehicle,line_items,total,currency,created_at').eq('garage_partner_id', userId).order('created_at', { ascending: false }),
  ])

  const firstError = [profileResult.error, vehiclesResult.error, requestsResult.error, reviewsResult.error, garageRatingsResult.error, garageResult.error, invoicesResult.error].find(Boolean)
  if (firstError) throw firstError

  return {
    profile: profileResult.data,
    vehicles: vehiclesResult.data ?? [],
    requests: requestsResult.data ?? [],
    reviews: reviewsResult.data ?? [],
    garageRatings: garageRatingsResult.data ?? [],
    garage: garageResult.data,
    invoices: invoicesResult.data ?? [],
  }
}

export function subscribeToAutozyncData(userId: string, refresh: () => void) {
  const supabase = createClient()
  const channel = supabase
    .channel(`autozync:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'customer_vehicles', filter: `owner_id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'service_requests', filter: `customer_id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_reviews', filter: `reviewer_id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'garage_partners', filter: `user_id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'digital_invoices', filter: `garage_partner_id=eq.${userId}` }, refresh)
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}
