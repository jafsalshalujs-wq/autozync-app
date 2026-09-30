import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request: NextRequest) {
  if (request.headers.get('x-autozync-delete') !== 'confirmed') {
    return NextResponse.json({ error: 'Request is not allowed.' }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Sign in before deleting your account.' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    return NextResponse.json({ error: 'Account deletion is temporarily unavailable.' }, { status: 503 })
  }

  const admin = createSupabaseAdminClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const cleanup = [
    await admin.from('digital_invoices').delete().eq('garage_partner_id', user.id),
    await admin.from('garage_partners').delete().eq('user_id', user.id),
    await admin.from('service_requests').delete().eq('customer_id', user.id),
    await admin.from('customer_vehicles').delete().eq('owner_id', user.id),
    await admin.from('profiles').delete().eq('id', user.id),
  ]
  if (cleanup.some(({ error }) => error)) {
    return NextResponse.json({ error: 'Could not remove all Autozync records. Please retry or contact support.' }, { status: 500 })
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
  if (deleteError) {
    return NextResponse.json({ error: 'Your app records were cleared, but the sign-in account could not be removed. Please retry or contact support.' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
