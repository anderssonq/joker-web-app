<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const AppSkeleton = defineAsyncComponent(() => import('@/components/atoms/AppSkeleton.vue'));
const JokeCard = defineAsyncComponent(() => import('@/components/molecules/AppJokeCard.vue'));
const AppCard = defineAsyncComponent(() => import('@/components/atoms/AppCard.vue'));

import { useJokesStore } from '../../stores/jokes';

const store = useJokesStore();
const { paginatedJokes, getLoading } = store;

</script>

<template>
    <div class="app-joke-list">
        <AppSkeleton v-if="getLoading()" />
        <JokeCard v-for="joke in paginatedJokes()" :key="joke.id" :id="joke.id" :type="joke.type" :setup="joke.setup"
            :punchline="joke.punchline" :rating="joke.rating" :byUser="joke.byUser" />

        <AppCard v-if="paginatedJokes().length === 0">
            <div class="joke-card-content">
                <p class="joke-card-setup">No more jokes available. Try changing the filter or add a new joke! 😜</p>
            </div>
        </AppCard>
    </div>
</template>
