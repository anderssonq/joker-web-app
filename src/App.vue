<script setup lang="ts">
import { defineAsyncComponent, watch } from 'vue'
import { useOnlineStatus } from './composables/useOnelineStatus';
import { clearCache } from './utils';


const JokesPage = defineAsyncComponent(() => import('@/page/JokesPage.vue'));

const { isOnline } = useOnlineStatus();

watch(isOnline, (val) => {
  if (!val) {
    clearCache();
  }
});
</script>

<template>
    <JokesPage v-if="isOnline" />
    <div v-if="!isOnline" class="offline-banner">
      ⚠️ You are offline. Please connect to the internet.
    </div>
</template>

<style scoped>
.offline-banner {
    background: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border: 1px solid #f5c6cb;
    border-radius: 0.25rem;
    margin: 1rem 0;
}
</style>