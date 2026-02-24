"use client";

import { useState, useRef, useCallback } from "react";
import type { Character } from "@/lib/types";
import type { Message } from "@/lib/types";

const PROMPT_CHIPS = [
  "너 오늘 뭐 입고 있어?",
  "나한테 관심 있어?",
  "밤에 나랑 있을래?",
  "가장 좋아하는 거 뭐야?",
  "나 어때? 마음에 들어?",
];

export function ChatWindow({ character }: { character: Character }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || isLoading) return;

      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      abortRef.current = new AbortController();

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            character: {
              name: character.name,
              personality: character.personality,
            },
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || "요청에 실패했어요.");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("응답 본문이 없어요.");

        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = { ...last, content: acc };
            }
            return next;
          });
          scrollToBottom();
        }
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant" && !last.content) {
            next[next.length - 1] = {
              ...last,
              content: "오류가 발생했어요. 다시 시도해 주세요.",
            };
          }
          return next;
        });
      } finally {
        setIsLoading(false);
        abortRef.current = null;
        scrollToBottom();
      }
    },
    [character.name, character.personality, messages, isLoading, scrollToBottom]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-2rem)] md:max-h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {PROMPT_CHIPS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => sendMessage(label)}
                className="px-4 py-2 rounded-full bg-white/20 text-white text-sm hover:bg-white/30 backdrop-blur-sm border border-white/20 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-md ${
                m.role === "user"
                  ? "bg-pink-600/85 text-white rounded-br-md shadow-lg"
                  : "bg-zinc-900/75 text-zinc-100 rounded-bl-md shadow-lg border border-white/10"
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap break-words">
                {m.content || (m.role === "assistant" && isLoading ? "…" : "")}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            rows={1}
            className="flex-1 min-h-[44px] max-h-32 resize-y rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 backdrop-blur-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="shrink-0 h-11 px-5 rounded-xl bg-pink-600 text-white font-medium text-sm hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            보내기
          </button>
        </div>
      </form>
    </div>
  );
}
