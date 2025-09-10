<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const AppButton = defineAsyncComponent(() => import('@/components/atoms/AppButton.vue'))
const AppCard = defineAsyncComponent(() => import('@/components/atoms/AppCard.vue'))
const AppRating = defineAsyncComponent(() => import('@/components/atoms/AppRating.vue'))

import { useJokesStore } from '../../stores/jokes';
import { confirmModal } from '@/utils';
import { MODE_EDIT } from '@/const';

const store = useJokesStore();
const { setJokeRatingById, setJokeId, removeJokeById, setModeForm } = store;

interface Props {
    id: number;
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
function handleEditingSelected() {
    setJokeId(props.id as number);
    setModeForm(MODE_EDIT);
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
                    <div class="actions">
                        <AppButton 
                            class="edit-btn" 
                            text="Edit" 
                            color="purple" 
                            @click="handleEditingSelected" 
                        />
                        <AppButton 
                            class="remove-btn" 
                            text="Remove" 
                            color="red" 
                            @click="handleRemovingSelected" 
                        />
                    </div>
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
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.75rem;
}

/* Push actions group to the right while rating stays left */
.joke-card-actions .rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: auto;
}

.joke-card-actions .actions {
    display: flex;
    gap: 0.5rem;
}

/* Remove old margin-left auto so buttons sit side by side */
.joke-card-actions .remove-btn,
.joke-card-actions .edit-btn {
    margin-left: 0;
}

</style>
