import { FEEDBACK } from "../../../services/constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { conversation } = await req.json();
  const FINAL_PROMPT = FEEDBACK.replace(
    "{{conversation}}",
    JSON.stringify(conversation)
  );

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    // model: "google/gemini-2.0-flash-exp:free",
    model: "google/gemini-2.0-flash-001", //paid model
    // model: "deepseek/deepseek-r1-0528:free",
    // model: "openrouter/cypher-alpha:free",
    messages: [{ role: "user", content: FINAL_PROMPT }],
  });

  if (!completion?.choices?.[0]?.message) {
    throw new Error("Invalid response structure from AI model");
  }
  // console.log(completion.choices[0].message);

  return NextResponse.json(completion.choices[0].message, { status: 200 });
}
