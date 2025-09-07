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
        <Transition name="slide" mode="out-in">
            <AppJokeList v-if="getModeForm() === 'none'" key="joke-list" />
            <AppFormJoke v-else :mode="getModeForm()" key="joke-form" />
        </Transition>
    </main>
    <AppFooter />
</template>

<style scoped>
.app-main {
    padding: 1rem;
    background: #ffffff;
    background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(119, 44, 232, 1) 100%);
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease-in-out;
}

.slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
    opacity: 1;
}
</style>
