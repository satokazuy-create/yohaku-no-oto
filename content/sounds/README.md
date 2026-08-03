# content/sounds

音源メタデータ(JSON)を置く場所(設計書§16.5・§25)。実体音声ファイルは`public/sounds/`に置く
(2026-08-03時点:非公開データではなく誰でもアクセスしてよい静的音源のため、Supabase Storageの
バケット管理は不要と判断し、Next.jsの静的配信に変更した)。

`sounds.json`の各エントリは§16.5の取り込みパイプライン設計に合わせ、`status`が`published`の
ものだけを配信対象とする(`lib/sounds.ts`の`getPublishedSounds()`参照)。

現在の音源:
- `rain`(雨・L1):Pixabay「Real Rain Sound」(FeedTheStrayCats)をffmpegでループ加工
  (クロスフェードで継ぎ目を平滑化)・-20.4LUFS/-3.6dBTPへ正規化して`public/sounds/rain.m4a`へ配置。
- `campfire`(焚き火・L1):Pixabay「Campfire Crackling Fireplace Sound」(soundsforyou)を同様に
  ループ加工。パチパチという爆ぜ音のピークが元々0dBFS付近まで達するため、-20LUFSまで持ち上げると
  ピーク超過・不自然な圧縮のリスクがあり、安全側に倒して-25.4LUFS/-2.2dBTPで確定(2026-08-03・
  ユーザー確認済み)。`public/sounds/campfire.m4a`へ配置。

いずれもPixabay Content License(商用利用可・クレジット表記不要。単体再配布・商標利用等のみ禁止)。

未着手:森・湯船(§16.2 MVP音源セット5種のうち残り)。呼吸ガイド(L2)・朗読(L3)は
実際の人の声の収録が必要なため別途対応。
