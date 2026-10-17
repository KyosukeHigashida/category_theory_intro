<script setup lang="ts">
import { useId } from 'vue'

// Markdown には公開しない内部の切り替え。静止画と段階表示で同じ座標を使う。
const props = withDefaults(defineProps<{ animated?: boolean }>(), { animated: false })
const id = useId()
const arrowId = `map-arrow-${id}`
const titleId = `map-title-${id}`
const descriptionId = `map-description-${id}`
// false は Slidev 標準の無効値。静止図はクリック数を増やさず全て表示する。
const at = (step: number) => props.animated ? step : false

// 図の座標は viewBox 内に集約。動的な点の移動量だけ CSS 変数で調整する。
const domain = [
  { label: 'a', y: 125 },
  { label: 'b', y: 210 },
  { label: 'c', y: 295 },
]
const codomain = [
  { label: '1', y: 125 },
  { label: '2', y: 210 },
  { label: '3', y: 295 },
]
// 動画の点は囲みが出ると静止画と同じ位置へ広がる。
const arrows = [
  { path: 'M 166 125 C 235 113, 304 113, 374 125', step: 4 },
  { path: 'M 166 210 C 236 205, 296 151, 374 128', step: 5 },
  { path: 'M 166 295 C 235 307, 304 307, 374 295', step: 6 },
]
</script>

<template>
  <svg
    class="map-diagram"
    :class="{ 'map-animated': animated, 'is-enclosed': animated && $clicks >= 3 }"
    viewBox="0 0 540 420"
    role="img"
    :aria-labelledby="`${titleId} ${descriptionId}`"
  >
    <title :id="titleId">集合 A から集合 B への写像</title>
    <desc :id="descriptionId">A は a, b, c。B は 1, 2, 3。a と b は 1 に、c は 3 に対応する。</desc>
    <defs>
      <marker :id="arrowId" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path class="map-arrow-head" d="M 1 1 L 9 5 L 1 9 L 3 5 Z" />
      </marker>
    </defs>

    <g v-click="at(1)" class="map-domain point-reveal" data-stage="domain">
      <g v-for="point in domain" :key="point.label" class="map-point-row">
        <circle class="map-point" cx="153" :cy="point.y" />
        <text x="128" :y="point.y + 8" text-anchor="end" font-style="italic">{{ point.label }}</text>
      </g>
    </g>
    <g v-click="at(2)" class="map-codomain point-reveal" data-stage="codomain">
      <g v-for="point in codomain" :key="point.label" class="map-point-row">
        <circle class="map-point" cx="387" :cy="point.y" />
        <text x="411" :y="point.y + 8">{{ point.label }}</text>
      </g>
    </g>

    <g v-click="at(3)" data-stage="sets">
      <g class="map-domain">
        <ellipse class="map-outline" cx="136" cy="210" rx="66" ry="143" />
        <text class="set-label" x="136" y="45" text-anchor="middle">A</text>
      </g>
      <g class="map-codomain">
        <ellipse class="map-outline" cx="404" cy="210" rx="66" ry="143" />
        <text class="set-label" x="404" y="45" text-anchor="middle">B</text>
      </g>
    </g>

    <g v-for="(arrow, index) in arrows" :key="arrow.step" v-click="at(arrow.step)" class="map-arrow-group" :data-stage="`arrow-${index + 1}`">
      <path class="map-arrow" :d="arrow.path" pathLength="1" :marker-end="`url(#${arrowId})`" />
    </g>

    <text v-click="at(7)" class="map-formula" x="270" y="402" text-anchor="middle" data-stage="formula">
      <tspan font-style="italic">f</tspan> : <tspan font-style="italic">A</tspan> → <tspan font-style="italic">B</tspan>
    </text>
  </svg>
</template>
