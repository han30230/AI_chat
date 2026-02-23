캐릭터 사진을 직접 넣는 방법
============================

1. 이 폴더(public/avatars/)에 이미지 파일을 넣으세요.
   - 파일 이름: 캐릭터 id + 확장자
   - 예: luna.jpg, kai.png, maya.jpg, james.jpg, zara.jpg, noah.jpg,
         emma.jpg, leo.jpg, sophie.jpg, ryan.jpg, chloe.jpg, alex.jpg

2. src/data/characters.ts 를 열어서 해당 캐릭터의 avatar 값을 바꾸세요.
   - 예: avatar: avatarUrl("luna")  →  avatar: "/avatars/luna.jpg"
   - 한 캐릭터만 바꿔도 되고, 전부 바꿔도 됩니다.

3. 저장 후 브라우저 새로고침하면 적용됩니다.

지원 형식: .jpg, .jpeg, .png, .webp 등 브라우저가 보여주는 이미지면 됩니다.
