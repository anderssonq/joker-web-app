<script setup lang="ts">
import JokeCard from '../molecules/JokeCard.vue';

import { useJokesStore } from '../../stores/jokes';

const store = useJokesStore();
const { paginatedJokes } = store;

</script>

<template>
    <div class="app-joke-list">
        <JokeCard v-for="joke in paginatedJokes()" :key="joke.id" :id="joke.id" :type="joke.type" :setup="joke.setup"
            :punchline="joke.punchline" :rating="joke.rating" />
    </div>
</template>

<style scoped></style>