<script setup lang="ts">
import { ref, defineAsyncComponent, onBeforeMount } from 'vue';

const AppCard = defineAsyncComponent(() => import('@/components/atoms/AppCard.vue'));
const AppButton = defineAsyncComponent(() => import('@/components/atoms/AppButton.vue'));
const AppTextField = defineAsyncComponent(() => import('@/components/atoms/AppTextField.vue'));
const AppDropdown = defineAsyncComponent(() => import('@/components/molecules/AppDropdown.vue'));

import { useJokesStore } from '../../stores/jokes';
import type { ModeForm } from '@/types';
import { confirmModal } from '@/utils';
import type { Joke } from '@/interfaces/joke.interface';

const store = useJokesStore();
const { setModeForm, getTypes, addJoke, getJokes, getJokeId, updateJoke } = store;

interface Props {
    mode: ModeForm;
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'none',
});

const jokeForm = ref<Joke>({
    id: 0,
    type: 'general',
    setup: '',
    punchline: '',
});

onBeforeMount(() => {
    if (props.mode === 'edit') {
        const joke = getJokes().find(joke => joke.id === getJokeId());
        if (joke) {
            jokeForm.value = {
                id: joke.id,
                type: joke.type,
                setup: joke.setup,
                punchline: joke.punchline,
            };
        }
        return;
    }
});
const isValidForm = () => {
    return jokeForm.value.type !== '' && jokeForm.value.setup.trim() !== '' && jokeForm.value.punchline.trim() !== '';
};

const handleSelectType = (type: string) => {
    jokeForm.value.type = type;
};

const handleActionBtn = () => {
    const confirm = confirmModal(`Are you sure you want to ${props.mode === 'edit' ? 'update' : 'add'} this joke? 🤡`);
    if (!confirm) return;
    if (props.mode === 'create' && isValidForm()) {
        addJoke(jokeForm.value);
    }
    if (props.mode === 'edit' && isValidForm()) {
        updateJoke(jokeForm.value.id as number, { ...jokeForm.value });
    }
    setModeForm('none');
};

</script>

<template>
    <AppCard>
        <div class="joke-form">
            <h3>{{props.mode === 'edit' ? 'Edit a' : 'Add a new'}}  Joke</h3>
            <p class="subtitle">
                Please fill in the fields below to add your custom joke 🎭
            </p>

            <div class="form-row">
                <label for="type">Type:</label>
                <AppDropdown id="type" title="Select a joke type" :items="getTypes()" :itemSelected="jokeForm.type"
                    @handleSelect="handleSelectType" />
            </div>

            <div class="form-row">
                <label for="setup">Setup:</label>
                <AppTextField id="setup" v-model="jokeForm.setup" placeholder="Enter the setup here" />
            </div>

            <div class="form-row">
                <label for="punchline">Punchline:</label>
                <AppTextField id="punchline" v-model="jokeForm.punchline" placeholder="Enter the punchline here" />
            </div>

            <div class="form-actions">
                <AppButton color="green" :text="props.mode === 'edit' ? 'Update Joke' : 'Save Joke'" @click="handleActionBtn" :disabled="!isValidForm()" />
                <AppButton color="red" text="Cancel" @click="setModeForm('none')" />
            </div>
        </div>
    </AppCard>
</template>

<style scoped>
.joke-form {
    display: grid;
    gap: 1rem;
    padding: 1rem;
    width: 100%;
}

.subtitle {
    margin-bottom: 1rem;
    color: #666;
    font-size: 0.9rem;
}

.form-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    gap: 0.75rem;
}

label {
    font-weight: 600;
    color: #333;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
}
</style>
