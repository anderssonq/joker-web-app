<script setup lang="ts">
import { onMounted, defineAsyncComponent, computed } from 'vue';
import { MODE_NONE } from '@/const';

const AppHeader = defineAsyncComponent(() => import('@/components/atoms/AppHeader.vue'));
const AppJokeList = defineAsyncComponent(() => import('@/components/organisms/AppJokeList.vue'));
const AppToolBar = defineAsyncComponent(() => import('@/components/organisms/AppToolBar.vue'));
const AppFormJoke = defineAsyncComponent(() => import('@/components/organisms/AppFormJoke.vue'));
const AppFooter = defineAsyncComponent(() => import('@/components/atoms/AppFooter.vue'));

import { useJokesStore } from '../stores/jokes';

const store = useJokesStore();
const { loadJokes, getModeForm, getJokes } = store;

onMounted(async () => {
  await loadJokes();
});

const isEmpty = computed(() => getModeForm() === MODE_NONE && getJokes().length === 0);
</script>

<template>
  <AppHeader />
  <main class="app-main" :class="{ 'app-main--empty': isEmpty }">
    <AppToolBar />
    <Transition name="slide" mode="out-in">
      <AppJokeList v-if="getModeForm() === MODE_NONE" key="joke-list" />
      <AppFormJoke v-else :mode="getModeForm()" key="joke-form" />
    </Transition>
  </main>
  <AppFooter />
</template>

<style scoped>
.app-main {
  min-height: 100svh;
  padding: 1rem;
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(119, 44, 232, 1) 100%);
  display: block;
}

.app-main--empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
