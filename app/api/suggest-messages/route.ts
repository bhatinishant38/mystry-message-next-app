import { google } from '@ai-sdk/google'
import { Output, generateText } from 'ai'
import { z } from 'zod'

export async function POST() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      {
        success: false,
        message:
          'Gemini is not configured. Add GOOGLE_GENERATIVE_AI_API_KEY to your .env file and restart the app.',
      },
      { status: 503 },
    )
  }

  try {
    const { output: suggestions } = await generateText({
      model: google('gemini-3.8-flash'),
      output: Output.array({
        element: z.string().min(1),
        minItems: 3,
        maxItems: 3,
      }),
      maxOutputTokens: 400,
      abortSignal: AbortSignal.timeout(60_000),
      prompt:
        'Write exactly three short, friendly, open-ended prompts for an anonymous message page. Avoid personal or sensitive topics. The output must be an array of exactly three plain strings.',
    })

    if (!suggestions || suggestions.length !== 3) {
      console.error('Gemini returned an unexpected number of message suggestions.')
      return Response.json(
        {
          success: false,
          message: 'Gemini did not return three suggestions. Please try again.',
        },
        { status: 502 },
      )
    }

    return Response.json({ success: true, suggestions })
  } catch (error) {
    console.error('Failed to generate message suggestions:', error)
    const errorDetails =
      typeof error === 'object' && error !== null
        ? (error as {
            name?: unknown
            message?: unknown
            statusCode?: unknown
            status?: unknown
          })
        : undefined
    const statusValue = errorDetails?.statusCode ?? errorDetails?.status
    const statusCode =
      typeof statusValue === 'number' ? statusValue : undefined
    const errorName =
      typeof errorDetails?.name === 'string'
        ? errorDetails.name
        : 'UnknownError'
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    const errorMessage =
      typeof errorDetails?.message === 'string'
        ? errorDetails.message
            .replaceAll(apiKey || '\u0000', '[redacted]')
            .replace(/([?&]key=)[^&\s]+/gi, '$1[redacted]')
            .replace(/\s+/g, ' ')
            .slice(0, 300)
        : 'No additional error details were provided.'
    const message =
      statusCode === 401 || statusCode === 403
        ? 'Gemini rejected the API key. Check that GOOGLE_GENERATIVE_AI_API_KEY is valid and the Generative Language API is enabled.'
        : statusCode === 429
          ? 'Gemini API quota or rate limit reached. Please try again later.'
          : errorName === 'TimeoutError' || errorName === 'AbortError'
            ? 'Gemini took too long to respond. Please try again.'
            : `Gemini request failed (${errorName}${statusCode ? `, status ${statusCode}` : ''}): ${errorMessage}`

    return Response.json(
      {
        success: false,
        message,
      },
      {
        status:
          errorName === 'TimeoutError' || errorName === 'AbortError'
            ? 504
            : statusCode === 429
              ? 429
              : 502,
      },
    )
  }
}
