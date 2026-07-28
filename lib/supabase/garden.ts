import { supabase } from "./client";
import type { GardenField } from "@/lib/moods";

export type GardenState = {
  user_id: string;
  drops: number;
  plants: number;
  flowers: number;
  sky: number;
  seeds: number;
  lights: number;
  updated_at: string;
};

// garden_stateは初回利用時にアプリ側で作る方針(supabase/migrations/0001の設計どおり)。
// 既存行があればそれを返し、なければ全カウント0の行を作る。
export async function getOrCreateGardenState(userId: string): Promise<GardenState> {
  const { data: existing, error: selectError } = await supabase
    .from("garden_state")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) return existing as GardenState;

  const { data: created, error: insertError } = await supabase
    .from("garden_state")
    .insert({ user_id: userId })
    .select("*")
    .single();
  if (insertError) throw insertError;
  return created as GardenState;
}

// 庭は加算のみ(設計書§17.1)。1日3回までの上限(§17.2)は未実装(次の工程)。
// 読み取り→+1→書き込みのため、同時アクセスが重なると加算が1回分ロストする
// 可能性があるが、モニターテスト規模の想定では許容する簡易実装とする。
export async function incrementGardenField(
  userId: string,
  field: GardenField
): Promise<GardenState> {
  const current = await getOrCreateGardenState(userId);
  const { data, error } = await supabase
    .from("garden_state")
    .update({ [field]: current[field] + 1, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data as GardenState;
}

// 数値・グラフ・日数は表示しない(設計書§17.3)。カウントから詩的な一言を
// 生成する簡易版。§17の本来の設計(複数バリエーション・季節の色調)は未実装。
export function describeGardenState(state: GardenState): string {
  const totals: [GardenField, number][] = [
    ["drops", state.drops],
    ["plants", state.plants],
    ["flowers", state.flowers],
    ["sky", state.sky],
  ];
  const dominant = totals.reduce((max, cur) => (cur[1] > max[1] ? cur : max));

  if (dominant[1] === 0) {
    return "まだ、静けさが集まり始めたところです。";
  }

  switch (dominant[0]) {
    case "drops":
      return "雨が、静かに降り積もっています。";
    case "plants":
      return "草木が、ゆっくり育っています。";
    case "flowers":
      return "花が、いくつかひらいています。";
    case "sky":
      return "空が、少し明るくなっています。";
  }
}
