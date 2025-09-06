<script setup lang="ts">
import { onMounted, watch } from 'vue';

import JokeCard from '../molecules/JokeCard.vue';

import { useJokesStore } from '../../stores/jokes';

const store = useJokesStore();
const { loadJokesByType, getJokes } = store;

onMounted(async () => {
    await loadJokesByType(2);
});

watch(
    () => store.getTypeSelected(),
    async () => {
        await loadJokesByType(2);
    }
);

</script>

<template>
    <div class="app-joke-list">
        <JokeCard v-for="joke in getJokes()" :key="joke.id" :id="joke.id" :type="joke.type" :setup="joke.setup"
            :punchline="joke.punchline" :rating="joke.rating" />
    </div>
</template>

<style scoped></style>