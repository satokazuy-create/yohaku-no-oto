import { supabase } from "./client";

export type LetterPreview = {
  sound_id: string;
  phrase: string;
  sender_name: string | null;
};

// 128bit相当のランダムなトークンを作る(設計書§26)。crypto.randomUUIDはHTTPS/localhostで
// 利用できる標準API。ハイフンを除いた32文字の16進文字列をURLのトークンとして使う。
function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

// 音の手紙を作成し、DBに保存する(設計書§19.1)。soundカタログ・phrasesマスタは
// 未実装のため、sound_id・phraseはそのまま文字列として保存する。
export async function createLetter(
  userId: string,
  input: { soundId: string; phrase: string; senderName?: string }
): Promise<string> {
  const token = generateToken();
  const { error } = await supabase.from("letters").insert({
    token,
    sender_user_id: userId,
    sound_id: input.soundId,
    phrase: input.phrase,
    sender_name: input.senderName || null,
  });
  if (error) throw error;
  return token;
}

// 受信ページ用。テーブルへの直接selectではなく、トークンで1件だけ返す
// get_letter_by_token関数(RPC)を呼ぶ(supabase/migrations/0002参照)。
export async function getLetterByToken(token: string): Promise<LetterPreview | null> {
  const { data, error } = await supabase.rpc("get_letter_by_token", { p_token: token });
  if (error) throw error;
  return (data as LetterPreview[] | null)?.[0] ?? null;
}

// 再生記録(設計書§19.1)。送信者の庭に花を1つ咲かせる処理もDB側の関数で行われる。
export async function recordLetterPlay(token: string): Promise<void> {
  const { error } = await supabase.rpc("record_letter_play", { p_token: token });
  if (error) throw error;
}
