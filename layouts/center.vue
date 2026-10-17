<script setup lang="ts">
import SlideNumber from '../components/common/SlideNumber.vue'
</script>

<template>
  <div class="slidev-layout center">
    <div class="lecture-content"><slot /></div>
    <SlideNumber />
  </div>
</template>
