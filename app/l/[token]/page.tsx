import { LetterReceiveView } from "./LetterReceiveView";

type Props = {
  params: Promise<{ token: string }>;
};

// S07音の手紙・受信(設計書§14・§19.1)。認証不要・アプリ未インストールでも開ける想定。
// 実際の取得はクライアント側(LetterReceiveView)でSupabaseのRPCを呼んで行う
// (匿名サインインがブラウザのlocalStorageベースのため、サーバー側では未認証)。
export default async function LetterReceivePage({ params }: Props) {
  const { token } = await params;
  return <LetterReceiveView token={token} />;
}
