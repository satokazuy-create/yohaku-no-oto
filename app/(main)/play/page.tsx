import { PlayScreenLoader } from "./PlayScreenLoader";

// この画面(S03)は呼吸アニメーション・トグル・「くぅにまかせる」のランダム選択など
// クライアント側の状態しか持たないため、SSRを無効化してクライアント専用で描画する
// (PlayScreenLoaderがssr:falseでの動的読み込みを担う)。これにより、ランダム選択の
// 結果がサーバー側とクライアント側で食い違って発生するハイドレーション不整合の
// 心配自体をなくし、PlayScreen側はuseEffectを使わない素直な初期化で書ける。
export default function PlayPage() {
  return <PlayScreenLoader />;
}
