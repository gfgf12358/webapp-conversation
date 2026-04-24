import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

const fallbackConversations = {
  data: [],
  has_more: false,
  limit: 100,
}

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)

  try {
    const url = `${API_URL}/conversations?user=${encodeURIComponent(user)}&limit=100`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(fallbackConversations, {
        headers: setSession(sessionId),
      })
    }

    const data = await response.json()

    if (!data) {
      return NextResponse.json(fallbackConversations, {
        headers: setSession(sessionId),
      })
    }

    if (Array.isArray(data)) {
      return NextResponse.json(
        {
          data,
          has_more: false,
          limit: 100,
        },
        {
          headers: setSession(sessionId),
        },
      )
    }

    if (!Array.isArray(data.data)) {
      return NextResponse.json(fallbackConversations, {
        headers: setSession(sessionId),
      })
    }

    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  } catch (error) {
    return NextResponse.json(fallbackConversations, {
      headers: setSession(sessionId),
    })
  }
}
