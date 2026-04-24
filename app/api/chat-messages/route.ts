import type { NextRequest } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo } from '@/app/api/utils/common'

function errorStream(message: string) {
  return new Response(
    `data: ${JSON.stringify({
      status: 400,
      message,
      code: 'DIFY_CONNECTION_ERROR',
    })}\n\n`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    },
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user } = getInfo(request)

    const response = await fetch(`${API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: body.inputs || {},
        query: body.query || '',
        response_mode: 'streaming',
        conversation_id: body.conversation_id || '',
        files: body.files || [],
        user,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const text = await response.text()
      return errorStream(`Dify接口返回错误：${response.status} ${text}`)
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error: any) {
    return errorStream(`Dify接口连接失败：${error?.message || String(error)}`)
  }
}
