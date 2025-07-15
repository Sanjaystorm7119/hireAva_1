import { QUESTIONS_PROMPT } from "../../../services/constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    // Validate required fields
    if (!jobPosition || !jobDescription || !duration || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = QUESTIONS_PROMPT.replace("{{jobTitle}}", jobPosition)
      .replace("{{jobDescription}}", jobDescription)
      .replace("{{duration}}", duration)
      .replace("{{type}}", type);

    // console.log(FINAL_PROMPT);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", //paid
      // model: "google/gemini-2.0-flash-exp:free",
      // model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      // model: "tngtech/deepseek-r1t2-chimera:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    // console.log(completion.choices[0].message);

    if (!completion?.choices?.[0]?.message) {
      throw new Error("Invalid response structure from AI model");
    }
    // console.log(completion.choices[0].message);

    return NextResponse.json(completion.choices[0].message, { status: 200 });
  } catch (e) {
    // console.error("API Error:", e);
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
