# components/garden

サウンドガーデンのSVG描画コンポーネント(設計書§17・§25)。`GardenScene.tsx`が
`garden_state`のカウント(drops/plants/flowers/sky)から決定的にSVGを描画する。

- 数値・グラフ・日数は表示しない(§17.3)。要素の「数」で量感を伝える(1種類あたり上限10個)
- 位置は`Math.random()`ではなく決定的な擬似乱数(sin関数ベース)で計算するため、
  同じ状態なら常に同じ絵になる(Math.randomだと開くたびに絵が変わってしまう)
- 季節による色調変化(§17.2)・種以外の要素(seeds/lights)の描画は未実装
