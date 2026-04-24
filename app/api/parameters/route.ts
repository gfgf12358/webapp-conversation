import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)

  const url = `${API_URL}/parameters?user=${encodeURIComponent(user)}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  const text = await response.text()

  if (!response.ok) {
    return new Response(text, {
      status: response.status,
      headers: setSession(sessionId),
    })
  }

  const data = JSON.parse(text)

  return NextResponse.json(data, {
    headers: setSession(sessionId),
  })
}
