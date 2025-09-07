<script setup lang="ts">
import JokeCard from '../molecules/JokeCard.vue';
import AppCard from '../atoms/AppCard.vue';

import { useJokesStore } from '../../stores/jokes';

const store = useJokesStore();
const { paginatedJokes } = store;
// TODO: Add loading and error handling

</script>

<template>
    <div class="app-joke-list">
        <JokeCard v-for="joke in paginatedJokes()" :key="joke.id" :id="joke.id" :type="joke.type" :setup="joke.setup"
            :punchline="joke.punchline" :rating="joke.rating" />

        <AppCard v-if="paginatedJokes().length === 0">
            <div class="joke-card-content">
                <p class="joke-card-setup">No more jokes available. Try changing the filter or add a new joke! 😜</p>
            </div>
        </AppCard>
    </div>
</template>

<style scoped></style>