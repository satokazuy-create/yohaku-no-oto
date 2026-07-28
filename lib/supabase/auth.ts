import { supabase } from "./client";

// 既存セッションがあればそれを使い、なければ匿名サインインする。
// Supabase管理画面で「Allow anonymous sign-ins」を有効化済みであることが前提。
export async function ensureAnonymousSession() {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session) {
    return sessionData.session;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.session) throw new Error("匿名サインインに失敗しました(セッションが作成されませんでした)");
  return data.session;
}
