-- 「余白の音」最小の一周(users / garden_state / sessions)
-- 設計書§22のデータモデルをMVPスコープに縮小したもの。
-- 実音源カタログ(sounds)は未実装のため、sessions.mood は §8.3/lib/moods.ts の
-- MoodId(quiet/relief/lonely/sleep/none)の文字列をそのまま保持する暫定設計。
--
-- 【前提・後続作業】
-- 匿名ユーザーは Supabase Auth の signInAnonymously() で作成する方針に統一する。
-- 以下2点は本SQL実行後の後続作業として別途必要(このSQLには含まれない):
--   1. Supabase管理画面 Authentication > Sign In / Providers で
--      「Anonymous Sign-Ins」を有効化する
--   2. Next.js側で、初回利用時に signInAnonymously() を呼び出す実装を追加する
--      (呼び出し前は auth.uid() が存在しないため、本SQLのRLSポリシーはすべて拒否する)
-- garden_state の初回行作成はアプリ側(初回利用時のupsert)で行う方針とし、
-- 本SQLではトリガー等は用意しない。
--
-- 庭は「加算のみ」(設計書§17.1)。DELETEを許可するGRANT・RLSポリシーは意図的に作らない。

-- 1. テーブル作成
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.garden_state (
  user_id uuid primary key references public.users(id) on delete cascade,
  drops int not null default 0,
  plants int not null default 0,
  flowers int not null default 0,
  sky int not null default 0,
  seeds int not null default 0,
  lights int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  mood text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  completed boolean not null default false
);

-- 2. RLS有効化
alter table public.users enable row level security;
alter table public.garden_state enable row level security;
alter table public.sessions enable row level security;

-- 3. Data API(PostgREST)への権限付与。
--    プロジェクト作成時に「Automatically expose new tables」をオフにしているため、
--    RLSとは別に、ロールへの明示的なGRANTがないとAPI経由で一切アクセスできない
--    (「permission denied」になる)。
--    signInAnonymously() 後のセッションは authenticated ロールとして扱われるため、
--    anon には付与しない。DELETEも付与しない(庭は加算のみ)。
grant usage on schema public to authenticated;
grant select, insert, update on public.users to authenticated;
grant select, insert, update on public.garden_state to authenticated;
grant select, insert, update on public.sessions to authenticated;

-- 4. RLSポリシー。再実行時のエラーを避けるため、毎回いったん削除してから作り直す。
--    updateには with check も付け、本人以外のuser_idへの書き換えを防ぐ。
drop policy if exists "本人のみ参照" on public.users;
drop policy if exists "本人のみ作成" on public.users;
drop policy if exists "本人のみ更新" on public.users;
create policy "本人のみ参照" on public.users
  for select using (auth.uid() = id);
create policy "本人のみ作成" on public.users
  for insert with check (auth.uid() = id);
create policy "本人のみ更新" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "本人のみ参照" on public.garden_state;
drop policy if exists "本人のみ作成" on public.garden_state;
drop policy if exists "本人のみ更新" on public.garden_state;
create policy "本人のみ参照" on public.garden_state
  for select using (auth.uid() = user_id);
create policy "本人のみ作成" on public.garden_state
  for insert with check (auth.uid() = user_id);
create policy "本人のみ更新" on public.garden_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "本人のみ参照" on public.sessions;
drop policy if exists "本人のみ作成" on public.sessions;
drop policy if exists "本人のみ更新" on public.sessions;
create policy "本人のみ参照" on public.sessions
  for select using (auth.uid() = user_id);
create policy "本人のみ作成" on public.sessions
  for insert with check (auth.uid() = user_id);
create policy "本人のみ更新" on public.sessions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. 匿名サインイン時、auth.usersに行ができたら public.users にも同じidで行を作る。
--    security definerのためsearch_pathを空に固定し、すべての識別子をスキーマ修飾する
--    (search_path経由での関数差し替え攻撃を防ぐ、Supabase公式推奨の書き方)。
--    on conflict do nothing により、二重発火や再実行時の重複エラーを防ぐ。
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
