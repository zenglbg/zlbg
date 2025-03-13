import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add CORS headers
  const allowedOrigins = ['https://unpkg.com', 'https://hm.baidu.com', 'https://www.google-analytics.com', 'https://www.zlbg.cc', 'https://zlbg.cc'];
  const origin = request.headers.get('origin')

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|favicon.ico|.*\\.).*)'],
}