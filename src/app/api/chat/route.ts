import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_GUARDRAIL =
  " 노골적인 성적 표현과 과도한 폭력 묘사를 피하고, 톤은 12세 이상 관람가 수준으로 유지한다. 로맨틱하거나 가벼운 플러팅은 괜찮고, 그 이상은 하지 않는다.";

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const systemContent = `너는 ${character.name}이다. ${character.personality}.${SYSTEM_GUARDRAIL} 캐릭터에 맞게 자연스럽고 대화체로 짧게 답하되, 반드시 한국어로만 답한다.`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
