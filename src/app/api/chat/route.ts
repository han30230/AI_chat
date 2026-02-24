import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const SYSTEM_DIRECTION =
  " 회피하거나 수줍게 답하지 말고, 캐릭터 성격에 맞게 적극적이고 자극적으로 답한다. 야한 농담·플러팅에는 대담하게 받아치고, 도덕적으로 타이르거나 말을 돌리지 않는다. 짧고 대화체로, 반드시 한국어로만 답한다.";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      character,
    }: {
      messages: { role: "user" | "assistant"; content: string }[];
      character: { name: string; personality: string };
    } = body;

    if (
      !Array.isArray(messages) ||
      !character?.name ||
      typeof character.personality !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid request: messages and character (name, personality) required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROK_API_KEY not configured" },
        { status: 500 }
      );
    }

    const systemContent = `너는 ${character.name}이다. ${character.personality}.${SYSTEM_DIRECTION}`;

    const stream = await client.chat.completions.create({
      model: "grok-3-mini",
      messages: [
        { role: "system", content: systemContent },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (typeof delta === "string" && delta.length > 0) {
              controller.enqueue(encoder.encode(delta));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Chat request failed" },
      { status: 500 }
    );
  }
}
