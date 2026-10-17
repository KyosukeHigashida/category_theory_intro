<script setup lang="ts">
import SlideNumber from '../components/common/SlideNumber.vue'
</script>

<template>
  <div class="slidev-layout two-cols">
    <header><slot /></header>
    <div class="lecture-columns">
      <div class="lecture-column"><slot name="left" /></div>
      <div class="lecture-column"><slot name="right" /></div>
    </div>
    <SlideNumber />
  </div>
</template>
