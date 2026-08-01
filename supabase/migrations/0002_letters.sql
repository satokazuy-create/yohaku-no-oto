-- 「余白の音」音の手紙(letters)のDB接続
-- 設計書§19・§22・§23・§26のデータモデルをMVPスコープに縮小したもの。
-- sounds/phrasesテーブルは未実装のため、sound_id/phraseは文字列としてそのまま保持する。
--
-- 【セキュリティ設計】
-- 受信者は送信者とは別の匿名ユーザーになるため、通常のRLS(本人の行のみ)では
-- 受信ページから手紙を読めない。かといって「誰でも読める」RLSにすると、
-- トークンを知らなくてもテーブル全体を読み取れる抜け道になってしまう。
-- そこで、テーブルへの直接アクセスは送信者本人のみに制限し、
-- 「トークンを指定して1件だけ取得する」「再生を記録する」という2つの関数(RPC)
-- だけを例外的に全認証ユーザーへ開放する。トークンを知っていることが実質的な
-- 鍵になる、設計書§26の考え方に沿った設計。
--
-- 【今回のスコープ外】1日10通までの送信制限(§19.2)は未実装。

-- 1. テーブル作成
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  sender_user_id uuid not null references public.users(id) on delete cascade,
  sound_id text not null,
  phrase text not null,
  sender_name text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  first_played_at timestamptz,
  play_count int not null default 0
);

-- 2. RLS有効化
alter table public.letters enable row level security;

-- 3. Data API権限(authenticatedのみ。テーブルへの直接selectは送信者本人のみ想定)
grant select, insert on public.letters to authenticated;

-- 4. RLSポリシー(再実行時のエラーを避けるため、毎回いったん削除してから作り直す)
drop policy if exists "本人のみ参照" on public.letters;
drop policy if exists "本人のみ作成" on public.letters;
create policy "本人のみ参照" on public.letters
  for select using (auth.uid() = sender_user_id);
create policy "本人のみ作成" on public.letters
  for insert with check (auth.uid() = sender_user_id);

-- 5. 受信ページ用:トークンを指定して1件だけ取得する関数。
--    security definerのためRLSをバイパスするが、返す列は最小限にし(内部id・送信者id等は
--    返さない)、有効期限切れの手紙は返さない。search_pathは空に固定(なりすまし防止)。
--    PostgreSQLは関数を新規作成するとデフォルトでPUBLIC(=anonも含む全員)に実行権限を
--    与えるため、明示的にrevokeしてからauthenticatedのみへgrantし直す。
create or replace function public.get_letter_by_token(p_token text)
returns table (
  sound_id text,
  phrase text,
  sender_name text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
    select l.sound_id, l.phrase, l.sender_name
    from public.letters l
    where l.token = p_token
      and l.expires_at > now();
end;
$$;

revoke all on function public.get_letter_by_token(text) from public;
grant execute on function public.get_letter_by_token(text) to authenticated;

-- 6. 再生記録用:再生回数を増やし、送信者の庭に花を1つ咲かせる(設計書§19.1)。
--    受信者には何も通知しない(「既読」を伝えない設計方針)。有効期限切れは記録しない。
create or replace function public.record_letter_play(p_token text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sender uuid;
begin
  update public.letters
  set play_count = play_count + 1,
      first_played_at = coalesce(first_played_at, now())
  where token = p_token
    and expires_at > now()
  returning sender_user_id into v_sender;

  -- 送信者がまだ一度も庭を開いたことがなく garden_state 行が存在しない場合に
  -- updateが静かに失敗する(0件更新でエラーにならない)不具合があったため、
  -- upsert(行が無ければ作成、あれば加算)に変更した。
  if v_sender is not null then
    insert into public.garden_state (user_id, flowers, updated_at)
    values (v_sender, 1, now())
    on conflict (user_id) do update
      set flowers = public.garden_state.flowers + 1,
          updated_at = now();
  end if;
end;
$$;

revoke all on function public.record_letter_play(text) from public;
grant execute on function public.record_letter_play(text) to authenticated;
