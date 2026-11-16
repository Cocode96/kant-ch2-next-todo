# Next Todo

기존 Todo 화면의 입력, 완료 표시, 필터는 유지하고 이메일 회원가입과 로그인을 추가했다. 목록에서 할 일을 추가하고, 상세 화면에서 제목이나 완료 상태를 수정하고 삭제할 수 있다. Supabase에 저장한 할 일은 로그인한 본인만 읽거나 바꿀 수 있다.

## 실행

1. Supabase 프로젝트의 SQL Editor에서 `schema.sql`을 한 번 실행한다.
2. `.env.example`을 `.env.local`로 복사하고 Supabase 프로젝트 URL과 publishable key를 입력한다. 인증 Redirect URLs에 `http://localhost:3000/auth/callback`을 등록한다.
3. 프로젝트 폴더에서 `npm ci`와 `npm run dev`를 차례로 실행하고 `http://localhost:3000`을 연다.

## 화면과 저장

- `/login`: 이메일 회원가입과 로그인
- `/`: 내 할 일 목록, 추가, 완료 상태 변경, 완료 항목 필터
- `/todos/[id]`: 할 일 상세, 제목과 완료 상태 수정, 삭제
- `schema.sql`: 할 일 작성자를 회원 ID로 연결하고 RLS에서 본인 행만 조회하거나 변경할 수 있도록 제한

## 확인과 배포

`npm run lint`, `npm run typecheck`, `npm run build`로 확인한다.

Vercel에서 이 저장소를 가져오고 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 설정한다. Supabase의 Site URL을 배포 주소로, Redirect URLs를 배포 주소의 `/auth/callback`으로 설정한다. 배포 후 가입·로그인, 두 회원의 CRUD 격리, 상세 링크와 새로고침 유지 여부를 확인한다.
