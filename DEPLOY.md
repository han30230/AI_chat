# AI 채팅 – 배포 방법 (Vercel)

## 1. 준비

- **Git**: 프로젝트를 GitHub/GitLab/Bitbucket 저장소에 올려두세요.
- **환경 변수**: `OPENAI_API_KEY`는 로컬 `.env.local`에만 두고, **저장소에는 올리지 마세요.** (배포 시 Vercel에서 따로 넣습니다.)
- **이미지**: `public/avatars/` 안의 사진들(1.jpg ~ 20.jpg 등)은 **저장소에 포함**해야 배포된 사이트에서 보입니다.

## 2. Vercel 배포

1. **https://vercel.com** 접속 후 로그인(또는 GitHub로 가입).

2. **Add New… → Project** 선택.

3. **Import Git Repository**에서 이 프로젝트 저장소 선택 후 **Import**.

4. **Configure Project** 화면에서:
   - Framework Preset: **Next.js** (자동 인식됨)
   - Root Directory: 비워두기 (프로젝트 루트가 맞다면)
   - Build Command: `npm run build` (기본값)
   - Output Directory: (기본값 유지)

5. **Environment Variables**에서:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-...` (본인 OpenAI API 키)
   - **Add** 클릭

6. **Deploy** 클릭.

7. 빌드가 끝나면 **Visit** 링크로 접속해 확인.

## 3. 배포 후

- **도메인**: `https://프로젝트이름.vercel.app` 형태로 자동 부여됩니다.
- **환경 변수 수정**: Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**에서 수정 후 재배포.
- **코드 수정 후 재배포**: 저장소에 push하면 Vercel이 자동으로 다시 빌드·배포합니다 (연동된 경우).

## 4. 주의사항

- `.env.local`은 **절대 Git에 커밋하지 마세요.** (이미 `.gitignore`에 있으면 안전합니다.)
- `public/avatars/` 안 이미지는 **커밋해야** 배포된 사이트에 반영됩니다.
- OpenAI API 사용량·비용은 본인 계정 기준이므로, 키 노출만 주의하면 됩니다.
