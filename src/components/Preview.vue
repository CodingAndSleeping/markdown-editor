<template>
  <div class="preview">
    <md-preview :editor-id="textObj.id" v-model="textObj.text">
    
    </md-preview>
  </div>
</template>

<script setup lang="ts">
import {ItextObj} from '../types/text';
const props = defineProps<{
  textObj:ItextObj
}>();

</script>

<style lang="scss"></style>
