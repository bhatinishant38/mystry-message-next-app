const fallbackSuggestions = [
  'What is something small that always makes your day better?',
  'If you could learn one new skill this year, what would it be?',
  'What is a song you never get tired of listening to?',
  'What is the best meal you have had recently?',
  'Which place would you love to visit again?',
  'What hobby would you try if you had a free weekend?',
  'What is something you are looking forward to?',
  'Which movie or show would you recommend to everyone?',
  'What is a fun fact most people do not know about you?',
  'If you could have any animal as a companion, what would you choose?',
]

function getFallbackSuggestions() {
  const shuffled = [...fallbackSuggestions]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }
  return shuffled.slice(0, 3)
}

function createFallbackResponse(message: string) {
  return Response.json({
    success: true,
    source: 'fallback',
    message,
    suggestions: getFallbackSuggestions(),
  })
}

export async function POST() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return createFallbackResponse(
      'Gemini is not configured. Add GOOGLE_GENERATIVE_AI_API_KEY to .env to enable AI suggestions.',
    )
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/interactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
          'Api-Revision': '2026-05-20',
        },
        body: JSON.stringify({
          model: 'gemini-3.8-flash',
          store: false,
          input:
            'Write exactly three short, friendly, open-ended prompts for an anonymous message page. Avoid sensitive topics. Return exactly three lines, one prompt per line, with no numbering or other text.',
        }),
        signal: AbortSignal.timeout(5_000),
      },
    )

    const result = await response.json()
    if (!response.ok) {
      const errorMessage =
        typeof result?.error?.message === 'string'
          ? result.error.message
              .replaceAll(apiKey, '[redacted]')
              .replace(/([?&]key=)[^&\s]+/gi, '$1[redacted]')
              .replace(/\s+/g, ' ')
              .slice(0, 300)
          : 'Gemini rejected the request.'
      console.error('Gemini Interactions API returned an error:', {
        status: response.status,
        message: errorMessage,
      })

      const message =
        response.status === 401 || response.status === 403
          ? 'Gemini rejected the API key. Check that the key is valid and the Generative Language API is enabled. Here are some quick suggestions instead.'
          : response.status === 429
            ? 'Gemini API quota or rate limit reached. Here are some quick suggestions instead.'
            : response.status === 503
              ? 'Gemini is busy right now. Here are some quick suggestions instead.'
              : `Gemini API returned HTTP ${response.status}: ${errorMessage}. Here are some quick suggestions instead.`

      return createFallbackResponse(message)
    }

    const interaction = result as {
      steps?: Array<{
        type?: string
        content?: Array<{ type?: string; text?: string }>
      }>
    }
    const text = interaction.steps
      ?.filter((step) => step.type === 'model_output')
      .flatMap((step) => step.content ?? [])
      .filter((part) => part.type === 'text')
      .map((part) => part.text ?? '')
      .join('\n')

    const suggestions = (text ?? '')
      .split(/\r?\n|\s*\|\|\s*/)
      .map((suggestion) =>
        suggestion.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim(),
      )
      .filter(Boolean)
      .slice(0, 3)

    if (suggestions.length !== 3) {
      console.error('Gemini returned an unexpected number of message suggestions.')
      return createFallbackResponse(
        'Gemini returned an invalid response. Here are some quick suggestions instead.',
      )
    }

    return Response.json({
      success: true,
      source: 'gemini',
      suggestions,
    })
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError')
    const errorMessage =
      error instanceof Error
        ? error.message
            .replaceAll(apiKey, '[redacted]')
            .replace(/([?&]key=)[^&\s]+/gi, '$1[redacted]')
            .replace(/\s+/g, ' ')
            .slice(0, 250)
        : 'No additional error details were provided.'
    console.error(
      isTimeout
        ? 'Gemini Interactions API request timed out.'
        : 'Failed to call Gemini Interactions API:',
      isTimeout ? undefined : { message: errorMessage },
    )

    return createFallbackResponse(
      isTimeout
        ? 'Gemini took too long to respond. Here are some quick suggestions instead.'
        : `Gemini is temporarily unavailable: ${errorMessage}. Here are some quick suggestions instead.`,
    )
  }
}
