import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

const fallbackParameters = {
  opening_statement: '',
  suggested_questions: [],
  suggested_questions_after_answer: {
    enabled: false,
  },
  speech_to_text: {
    enabled: false,
  },
  text_to_speech: {
    enabled: false,
    voice: '',
    language: '',
  },
  retriever_resource: {
    enabled: false,
  },
  annotation_reply: {
    enabled: false,
  },
  user_input_form: [],
  file_upload: {
    image: {
      enabled: false,
      number_limits: 3,
      transfer_methods: ['local_file', 'remote_url'],
    },
    enabled: false,
    allowed_file_types: [],
    allowed_file_extensions: [],
    allowed_file_upload_methods: [],
    number_limits: 3,
    fileUploadConfig: {
      file_size_limit: 15,
      batch_count_limit: 5,
      image_file_size_limit: 10,
      video_file_size_limit: 100,
      audio_file_size_limit: 50,
      workflow_file_upload_limit: 10,
    },
  },
  system_parameters: {
    image_file_size_limit: 10,
    video_file_size_limit: 100,
    audio_file_size_limit: 50,
    file_size_limit: 15,
    workflow_file_upload_limit: 10,
  },
}

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)

  try {
    const url = `${API_URL}/parameters?user=${encodeURIComponent(user)}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(fallbackParameters, {
        headers: setSession(sessionId),
      })
    }

    const data = await response.json()

    if (!data || Array.isArray(data)) {
      return NextResponse.json(fallbackParameters, {
        headers: setSession(sessionId),
      })
    }

    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  } catch (error) {
    return NextResponse.json(fallbackParameters, {
      headers: setSession(sessionId),
    })
  }
}
