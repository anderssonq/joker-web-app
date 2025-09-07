<script setup lang="ts">
import AppCard from '../atoms/AppCard.vue';
import AppRating from '../atoms/AppRating.vue';
import AppButton from '../atoms/AppButton.vue';

import { useJokesStore } from '../../stores/jokes';
import { confirmModal } from '@/utils';

const store = useJokesStore();
const { setJokeRatingById, removeJokeById } = store;

interface Props {
    id?: number;
    type: string;
    setup: string;
    punchline: string;
    rating?: number;
    byUser?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    id: 1,
    type: 'general',
    setup: 'Where does batman go to the bathroom?',
    punchline: 'The batroom.',
    rating: 0,
    byUser: false,
});

function handleRatingSelected(rating: number) {
    setJokeRatingById(props.id as number, rating);
}

function handleRemovingSelected() {
   const confirm = confirmModal('Are you sure you want to remove this joke? 🗑️');
    if (!confirm) return;
    removeJokeById(props.id as number);
}

</script>

<template>
    <div :data-type="props.type" :key="props.id">
        <AppCard>
            <div class="joke-card-content">
                <p class="joke-card-by-user" v-if="props.byUser">✨ By you 💅🔥</p>

                <p class="joke-card-type">🏷️ {{ props.type }}</p>

                <p class="joke-card-setup">🙋 {{ props.setup }}</p>
                <p class="joke-card-punchline">😂 {{ props.punchline }} (Ba dum tss)</p>

                <div class="joke-card-actions">
                    <div class="rating">
                        <AppRating :rating="props.rating" @ratingSelected="handleRatingSelected" />
                    </div>
                    <AppButton class="remove-btn" color="red" text="Remove" @click="handleRemovingSelected" />
                </div>
            </div>
        </AppCard>
    </div>
</template>

<style scoped>
.joke-card-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem;
    width: 100%;
}

.joke-card-by-user {
    font-size: 0.85rem;
    font-weight: 600;
    color: #16a34a;
}

.joke-card-type {
    display: inline-block;
    background: #1e293b;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    width: fit-content;
}

.joke-card-setup {
    font-weight: 600;
    font-size: 1.1rem;
    line-height: 1.4;
    color: #111827;
}

.joke-card-punchline {
    font-size: 1rem;
    color: #4b5563;
    font-style: italic;
}

.joke-card-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;
}

.joke-card-actions .rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.joke-card-actions .remove-btn {
    margin-left: auto;
}
</style>
