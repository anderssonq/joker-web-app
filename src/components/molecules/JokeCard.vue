<script setup lang="ts">
import AppCard from '../atoms/AppCard.vue';
import AppRating from '../atoms/AppRating.vue';
import AppButton from '../atoms/AppButton.vue';

interface Props {
    id?: number;
    type: string;
    setup: string;
    punchline: string;
    rating?: number;
}

const props = withDefaults(defineProps<Props>(), {
    id: 1,
    type: 'general',
    setup: 'Where does batman go to the bathroom?',
    punchline: 'The batroom.',
    rating: 1,
});

</script>

<template>
    <div class="joke-card" :data-type="props.type" :key="props.id">
        <AppCard>
            <div class="joke-card-content">
                <p class="joke-card-type code"> 🏷️ {{ props.type }}</p>
                <p class="joke-card-setup">🙋 {{ props.setup }}</p>
                <p class="joke-card-punchline">😂 {{ props.punchline }} (Ba dum tss)</p>
                <AppRating :rating="props.rating" />
                <AppButton color="red" text="Remove"></AppButton>
            </div>
        </AppCard>
    </div>
</template>

<style scoped>
.joke-card {
    margin: 1rem 0;
}

.joke-card-content {
    padding: 1rem;
}

.joke-card-setup {
    font-weight: bold;
}

.joke-card-punchline {
    color: #555;
}
</style>