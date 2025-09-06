<script setup lang="ts">
import AppButton from '../atoms/AppButton.vue';
import { onMounted, ref } from 'vue';
import { useJokesStore } from '../../stores/jokes';

const store = useJokesStore();
const { loadJokeTypes, setTypeSelected, getTypeSelected } = store;

const types = ref<string[]>([]);

onMounted(async () => {
    const _types = await loadJokeTypes();
    types.value = ['random', ...(_types || [])];
});

</script>

<template>
    <div class="dropdown">
        <AppButton :text="`Joke Type: ${getTypeSelected()}`" color="purple" />
        <div class="dropdown-content">
            <a v-for="item in types" :key="item" @click="setTypeSelected(item)">{{ item }}</a>
        </div>
    </div>
</template>

<style scoped>
.dropdown {
    position: relative;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 200px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}

.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    cursor: pointer;
}

.dropdown-content a:hover {
    background-color: #f1f1f1
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown:hover .dropbtn {
    background-color: #3e8e41;
}
</style>