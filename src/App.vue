<script setup lang="ts">
import JokesPage from './page/JokesPage.vue';
import { useJokesStore } from './stores/jokes';
import { onMounted } from 'vue';

const store = useJokesStore();
onMounted(async () => {
  const response = await store.loadJokeTypes();
  console.log('loadJokeTypes:', response);
});

</script>

<template>
    <JokesPage />
</template>

<style scoped></style>