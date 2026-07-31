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

const FIELD_LABEL: Record<GardenField, string> = {
  drops: "雨",
  plants: "草木",
  flowers: "花",
  sky: "空",
};

// 量に応じた3段階の言い回し(数値は表示しない。設計書§17.3)。
// 1〜2回・3〜5回・6回以上、というざっくりした境目で言葉を変えるだけの簡易版。
const FIELD_TIER_MESSAGE: Record<GardenField, [string, string, string]> = {
  drops: [
    "雨が、ひとしずく落ちました。",
    "雨が、静かに降り積もっています。",
    "雨が、たっぷりと降り積もっています。",
  ],
  plants: [
    "草木が、芽を出し始めました。",
    "草木が、ゆっくり育っています。",
    "草木が、青々と茂っています。",
  ],
  flowers: [
    "花が、ひとつひらきました。",
    "花が、いくつかひらいています。",
    "花が、たくさんひらいています。",
  ],
  sky: [
    "空が、ほんの少し明るくなりました。",
    "空が、少し明るくなっています。",
    "空が、すっかり明るくなっています。",
  ],
};

function tierIndex(count: number): 0 | 1 | 2 {
  if (count <= 2) return 0;
  if (count <= 5) return 1;
  return 2;
}

// 数値・グラフ・日数は表示しない(設計書§17.3)。カウントから詩的な一言を
// 生成する簡易版。§17の本来の設計(複数バリエーション・季節の色調)は未実装。
// 最多の種類が複数(同数)ある場合は、そのすべてをまとめて伝える
// (以前は同数のとき常に配列の先頭=dropsが選ばれ、育っていても文言が変わらなかった)。
export function describeGardenState(state: GardenState): string {
  const totals: [GardenField, number][] = [
    ["drops", state.drops],
    ["plants", state.plants],
    ["flowers", state.flowers],
    ["sky", state.sky],
  ];
  const maxCount = Math.max(...totals.map(([, count]) => count));

  if (maxCount === 0) {
    return "まだ、静けさが集まり始めたところです。";
  }

  const leaders = totals.filter(([, count]) => count === maxCount);

  if (leaders.length > 1) {
    const labels = leaders.map(([field]) => FIELD_LABEL[field]).join("・");
    return `${labels}が、静かに育っています。`;
  }

  const [field, count] = leaders[0];
  return FIELD_TIER_MESSAGE[field][tierIndex(count)];
}
