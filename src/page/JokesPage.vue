<script setup lang="ts">
import AppHeader from '@/components/organisms/AppHeader.vue';
import AppJokeList from '@/components/organisms/AppJokeList.vue';
import AppToolBar from '@/components/organisms/AppToolBar.vue';

import { useJokesStore } from '../stores/jokes';
import { onMounted } from 'vue';

const store = useJokesStore();
const { loadJokes } = store;

onMounted(async () => {
    await loadJokes();
});
</script>

<template>
    <header>
        <AppHeader />
    </header>
    <main class="app-main">
        <AppToolBar />
        <AppJokeList />
    </main>
    <footer class="app-footer">
        <a href="https://andersoftware.com/" target="_blank" rel="noopener noreferrer">Ander was here</a>. {{ new Date().getFullYear() }}
    </footer>
</template>

<style scoped>
.app-main {
    padding: 1rem;
}

.app-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    font-size: 1rem;
    background: #fff;
    color: #222;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}
</style>
