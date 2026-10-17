<script setup lang="ts">
import SlideNumber from '../components/common/SlideNumber.vue'
</script>

<template>
  <div class="slidev-layout full">
    <slot />
    <SlideNumber />
  </div>
</template>
