import soundsCatalog from "@/content/sounds/sounds.json";

// 設計書§16.5の取り込みパイプライン設計に沿った音源メタデータの型。
// MVPの音源も同じ経路(source_type/status/license_type/rights_holder)を通す。
export type SoundStatus =
  | "draft"
  | "pending_review"
  | "human_review"
  | "approved"
  | "published"
  | "archived";

export type SoundEntry = {
  id: string;
  label: string;
  file: string;
  layer: "L1" | "L2" | "L3";
  source_type: string;
  status: SoundStatus;
  license_type: string;
  rights_holder: string;
  usage_scope: string;
  loudness_lufs: number;
  true_peak_dbtp: number;
  duration_sec: number;
};

// 配信APIは常にstatus=publishedのみを返す(§16.5:審査待ち音源を誤って出さないための固定フィルタ)。
export function getPublishedSounds(): SoundEntry[] {
  return (soundsCatalog as SoundEntry[]).filter((sound) => sound.status === "published");
}

export function getSoundById(id: string): SoundEntry | undefined {
  return getPublishedSounds().find((sound) => sound.id === id);
}
