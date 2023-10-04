<template>
  <div class="preview">
    <md-preview :editor-id="store.id || 'editor'" v-model="store.text"> </md-preview>
  </div>
</template>

<script setup lang="ts">
import { useMdTextStore } from "@/store/mdText";
const store = useMdTextStore();
</script>

<style lang="scss"></style>
