import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId } = getInfo(request)

  return NextResponse.json(
    {
      data: [],
      has_more: false,
      limit: 100,
    },
    {
      headers: setSession(sessionId),
    },
  )
}
