import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  console.log('🟦 [SUPABASE CLIENT] Initializing browser client')
  console.log('🟦 [SUPABASE CLIENT] Config check:', {
    hasUrl: !!url,
    hasKey: !!key,
    urlLength: url.length,
    keyLength: key.length,
    urlValue: url || 'MISSING',
    keyPrefix: key ? key.substring(0, 20) + '...' : 'MISSING'
  })

  if (!url || !key) {
    console.error('🔴 [SUPABASE CLIENT] CRITICAL: Missing environment variables!')
    console.error('🔴 [SUPABASE CLIENT] This will cause "Failed to fetch" errors')
  }

  const client = createBrowserClient(url, key)
  console.log('🟦 [SUPABASE CLIENT] Browser client created successfully')

  return client
}
