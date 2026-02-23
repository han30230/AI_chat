# AI Chat MVP – 실행 방법

## 필수 준비사항

1. **OpenAI API 키**
   - 프로젝트 루트에 `.env.local` 파일 생성 후 아래 한 줄 추가:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

2. **아바타 placeholder**
   - `public/avatars/placeholder.jpg` 파일을 반드시 넣어야 합니다.
   - 캐릭터별 이미지(`/avatars/luna.jpg` 등)가 없을 때 이 이미지가 사용됩니다.
   - 아무 작은 JPG 이미지(예: 1x1 픽셀 또는 기본 프로필 이미지)를 `public/avatars/` 폴더에 `placeholder.jpg`로 저장하면 됩니다.
   - 폴더가 없다면 먼저 생성: `public/avatars/`

3. **의존성**
   - Next.js 프로젝트가 create-next-app으로 이미 생성되어 있다고 가정합니다.
   - OpenAI SDK 설치:
   ```bash
   npm install openai
   ```

## 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 시 `/characters`로 리다이렉트됩니다.

## 배포 (Vercel)

- Vercel에 프로젝트 연결 후, 환경 변수에 `OPENAI_API_KEY` 추가.
- `public/avatars/placeholder.jpg`가 포함된 상태로 배포하면 됩니다.
