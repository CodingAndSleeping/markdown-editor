<template>
<md-editor v-model="text"></md-editor>
<!-- <md-preview v-model="text"></md-preview> -->
</template>

<script setup lang="ts">
import {ref} from 'vue';

const text = ref<string>('# aaa')


</script>



<style scoped>
</style>
