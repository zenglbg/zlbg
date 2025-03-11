'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Suspense } from 'react'
import * as gtag from '@/lib/gtag'

function AnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    gtag.pageview(url)
  }, [pathname, searchParams])

  return null
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  )
}