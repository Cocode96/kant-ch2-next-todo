-- 별도 테스트 Supabase 프로젝트에 한 번 적용한다.
-- 원본 Todo의 id/title/checked 구조를 그대로 저장한다.
create table public.shop_todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 200),
  checked boolean not null default false,
  created_at timestamptz not null default now()
);
create index shop_todos_user_created on public.shop_todos(user_id, created_at);
alter table public.shop_todos enable row level security;
create policy shop_todos_select on public.shop_todos for select to authenticated
  using ((select auth.uid()) = user_id);
create policy shop_todos_insert on public.shop_todos for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy shop_todos_update on public.shop_todos for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy shop_todos_delete on public.shop_todos for delete to authenticated
  using ((select auth.uid()) = user_id);
revoke all on public.shop_todos from anon;
grant select, insert, update, delete on public.shop_todos to authenticated;

