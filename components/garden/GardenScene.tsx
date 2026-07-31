import type { GardenState } from "@/lib/supabase/garden";

type GardenSceneProps = {
  state: GardenState;
};

// 1種類あたり見せる要素数の上限。数値そのものは表示しないが(設計書§17.3)、
// 描画する要素の「数」で量感を伝える。多すぎると散らかって見えるため上限を設ける。
const MAX_VISIBLE = 10;

// カウント(整数)から常に同じ「自然にばらけた」位置を作るための決定的な擬似乱数。
// Math.random()は使わない(同じ状態を開くたびに絵が変わってしまうため)。
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function skyColor(sky: number): string {
  if (sky <= 0) return "#f2ece0";
  if (sky <= 2) return "#eef2df";
  if (sky <= 5) return "#e6f0e2";
  return "#ddeee0";
}

// garden_stateのカウントから、庭の見た目(SVG)を決定的に描画する(設計書§17・§25)。
// 水滴(drops)・草木(plants)・花(flowers)の位置はカウントのみから計算されるため、
// 同じ状態なら常に同じ絵になる。空(sky)は背景色の明るさで表現する。
export function GardenScene({ state }: GardenSceneProps) {
  const dropCount = Math.min(state.drops, MAX_VISIBLE);
  const plantCount = Math.min(state.plants, MAX_VISIBLE);
  const flowerCount = Math.min(state.flowers, MAX_VISIBLE);

  const drops = Array.from({ length: dropCount }, (_, i) => {
    const seed = i * 7.3 + 1;
    return {
      key: `drop-${i}`,
      x: 20 + seededRandom(seed) * 280,
      y: 140 + seededRandom(seed + 0.5) * 45,
    };
  });

  const plants = Array.from({ length: plantCount }, (_, i) => {
    const seed = i * 11.7 + 50;
    return {
      key: `plant-${i}`,
      x: 15 + seededRandom(seed) * 290,
      y: 150 + seededRandom(seed + 0.5) * 20,
    };
  });

  const flowers = Array.from({ length: flowerCount }, (_, i) => {
    const seed = i * 5.1 + 90;
    return {
      key: `flower-${i}`,
      x: 20 + seededRandom(seed) * 280,
      y: 105 + seededRandom(seed + 0.5) * 35,
    };
  });

  return (
    <svg viewBox="0 0 320 200" role="img" aria-label="育っている庭" className="w-full max-w-xs">
      <rect x="0" y="0" width="320" height="95" fill={skyColor(state.sky)} />
      <rect x="0" y="95" width="320" height="105" fill="#d7e4d0" />

      {plants.map((p) => (
        <g key={p.key} transform={`translate(${p.x}, ${p.y})`}>
          <line x1="0" y1="0" x2="0" y2="-14" stroke="#7a9e6e" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="0" cy="-16" rx="5" ry="3.5" fill="#8bb47c" />
        </g>
      ))}

      {flowers.map((f) => (
        <g key={f.key} transform={`translate(${f.x}, ${f.y})`}>
          <circle cx="-4" cy="-1" r="2.5" fill="#e8b4a0" opacity="0.85" />
          <circle cx="4" cy="-1" r="2.5" fill="#e8b4a0" opacity="0.85" />
          <circle cx="0" cy="-4" r="2.5" fill="#e8b4a0" opacity="0.85" />
          <circle cx="0" cy="2" r="2.5" fill="#e8b4a0" opacity="0.85" />
          <circle cx="0" cy="-1" r="1.6" fill="#c9895f" />
        </g>
      ))}

      {drops.map((d) => (
        <ellipse key={d.key} cx={d.x} cy={d.y} rx="4" ry="5" fill="#9cc3d5" opacity="0.85" />
      ))}
    </svg>
  );
}
