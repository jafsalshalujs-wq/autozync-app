'use client'

import { useEffect } from 'react'
import useSWR from 'swr'
import { createClient, loadAutozyncData, subscribeToAutozyncData, type AutozyncRemoteData } from '@/lib/supabase/client'

export function useAutozyncData(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<AutozyncRemoteData>(
    userId ? ['autozync-data', userId] : null,
    ([, id]) => loadAutozyncData(id as string),
    { revalidateOnFocus: true, keepPreviousData: false },
  )

  useEffect(() => {
    if (!userId) return
    return subscribeToAutozyncData(userId, () => { void mutate() })
  }, [userId, mutate])

  const refresh = async () => {
    await mutate()
  }

  const supabase = createClient()

  return { data, error, isLoading, mutate, refresh, supabase }
}
