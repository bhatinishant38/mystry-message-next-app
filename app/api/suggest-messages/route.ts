import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

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
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      maxOutputTokens: 300,
      prompt:
        'Write exactly three short, friendly, open-ended prompts for an anonymous message page. Avoid personal or sensitive topics. Return only the prompts, one per line, without numbering or extra text.',
    })

    const suggestions = text
      .split(/\r?\n|\s*\|\|\s*/)
      .map((suggestion) =>
        suggestion.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim(),
      )
      .filter(Boolean)
      .slice(0, 3)

    if (suggestions.length !== 3) {
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
    return Response.json(
      {
        success: false,
        message: 'Gemini could not generate suggestions right now. Please try again.',
      },
      { status: 502 },
    )
  }
}
