import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabaseの環境変数が未設定です。.env.local に NEXT_PUBLIC_SUPABASE_URL と " +
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY を設定してください。"
  );
}

// ブラウザ用のSupabaseクライアント(シングルトン)。publishable keyのみ使用し、
// secret key・service_role keyはここでは扱わない。
export const supabase = createClient(supabaseUrl, supabaseKey);
