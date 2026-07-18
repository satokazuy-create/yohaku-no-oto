import { Suspense } from "react";
import { PlayScreen } from "./PlayScreen";

export default function PlayPage() {
  return (
    <Suspense fallback={null}>
      <PlayScreen />
    </Suspense>
  );
}
