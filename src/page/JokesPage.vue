<script setup lang="ts">
import AppHeader from '@/components/atoms/AppHeader.vue';
import AppJokeList from '@/components/organisms/AppJokeList.vue';
import AppToolBar from '@/components/organisms/AppToolBar.vue';
import AppFormJoke from '@/components/organisms/AppFormJoke.vue';
import AppFooter from '@/components/atoms/AppFooter.vue';

import { useJokesStore } from '../stores/jokes';
import { onMounted } from 'vue';

const store = useJokesStore();
const { loadJokes, getModeForm } = store;

onMounted(async () => {
    await loadJokes();
});
</script>

<template>
    <AppHeader />
    <main class="app-main">
        <AppToolBar />
        <AppJokeList v-if="getModeForm() === 'none'" />
        <AppFormJoke v-if="getModeForm() !== 'none'" :mode="getModeForm()" />
    </main>
    <AppFooter />
</template>

<style scoped>
.app-main {
    padding: 1rem;
}
</style>
