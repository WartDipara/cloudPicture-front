<template>
  <div>
    <BasicLayout />
  </div>
</template>
<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue';
import { testUsingGet } from '@/api/mainController.ts';

testUsingGet().then((resp: any) => {
  console.log(resp);
})
</script>
<style scoped></style>
