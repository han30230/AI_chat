/**
 * Grok API 테스트 스크립트
 * 사용: node scripts/test-grok.js
 * .env.local 에 GROK_API_KEY 가 있어야 합니다.
 */

const fs = require("fs");
const path = require("path");

function loadGrokKey() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(".env.local 파일이 없습니다.");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf8");
  const match = content.match(/GROK_API_KEY\s*=\s*(.+)/);
  if (!match) {
    console.error(".env.local 에 GROK_API_KEY 가 없습니다.");
    process.exit(1);
  }
  return match[1].trim().replace(/^["']|["']$/g, "");
}

async function main() {
  const apiKey = loadGrokKey();

  const url = "https://api.x.ai/v1/chat/completions";
  const body = {
    model: "grok-3-mini", // 문서 기준: grok-3-mini, grok-3, grok-4-1-fast-reasoning 등
    messages: [
      {
        role: "system",
        content:
          "넌 20대 한국 여성이야, 남자를 매우 좋아하고 야한 걸 좋아해. 이 페르소나에 맞게 대답해.",
      },
      {
        role: "user",
        content: "너 가슴커?",
      },
    ],
    stream: false,
  };

  console.log("Grok API 호출 중...\n");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("에러:", res.status, data);
    process.exit(1);
  }

  const message = data.choices?.[0]?.message;
  if (message) {
    console.log("응답:", message.content);
    if (data.usage) {
      console.log("\n토큰 사용:", data.usage);
    }
  } else {
    console.log("전체 응답:", JSON.stringify(data, null, 2));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
