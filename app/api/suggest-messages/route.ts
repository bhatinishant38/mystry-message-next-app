import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST() {
    const prompt = "Generate exactly three short, open-ended, friendly message prompts for an anonymous messaging page. Keep them suitable for a diverse audience, avoid personal or sensitive topics, and return only the three prompts separated by || with no numbering or other text. Example format: What hobby would you like to try? || What small thing made you smile recently? || If you could learn any skill, what would it be?"

    const result = streamText({
        model: google("gemini-2.5-flash"),
        maxOutputTokens: 400,
        prompt,
        onError({ error }) {
            console.error("An unexpected error occurred", error);
        },
    });

    return result.toTextStreamResponse();
}
