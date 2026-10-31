import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST() {
    const prompt = "Create a list of three open ended and engaging questions formatted as a single string . Each question should be sapersted by '||' . Thses questions are for an anonymous social messaging platform , like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics , focusing instead on universal themes that encourage friendly interaction . For example , your output should be structured like this : ' what is a hobby you have recently started? || If you could have dinner with any historical figuure , who would it be? || what is a simple thing that makes you happy' . Ensure the questions are intriguting ,foster curiosity ,and constribute to a postive and welcoming conversational environment."

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
