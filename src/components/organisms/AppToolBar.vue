<script setup lang="ts">
import { onMounted, ref } from 'vue';

import AppCard from '../atoms/AppCard.vue';
import { useJokesStore } from '../../stores/jokes';
import AppDropdown from '../molecules/AppDropdown.vue';
import AppButton from '../atoms/AppButton.vue';
import AppPagination from '@/components/molecules/AppPagination.vue';
import type { SortBy } from '@/types';

const store = useJokesStore();
const { loadJokeTypes, setTypeSelected, getTypeSelected, setSortBy, getSortBy, getSortTypes, setPerPage, getPerPage } = store;

const types = ref<string[]>([]);
onMounted(async () => {
    types.value = await loadJokeTypes();
});

const handleSelectType = (type: string) => {
    setTypeSelected(type);
};

const handleSelectSort = (sort: string) => {
    setSortBy(sort as SortBy);
};

const handleSelectPerPage = (perPage: number) => {
    setPerPage(perPage);
};

</script>

<template>
    <div class="app-tool-bar">
        <AppCard>
            <div class="tool-bar-header">
                <h3>Menu</h3>
            </div>
            <div class="tool-bar-content">
                <AppDropdown title="Select a joke type" :items="types" :itemSelected="getTypeSelected()" @handleSelect="handleSelectType" />
                <AppDropdown title="Order jokes by" :items="getSortTypes()" :itemSelected="getSortBy()" @handleSelect="handleSelectSort" />
                <AppDropdown title="Number of jokes per page" :items="[2, 5, 10]" :itemSelected="getPerPage()" @handleSelect="handleSelectPerPage" />
                <AppButton text="Add a new Joke 😜" />
            </div>
            <div class="tool-bar-footer">
                <AppPagination :maxVisiblePages="5" />
            </div>
        </AppCard>
    </div>
</template>

<style scoped>
.tool-bar-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tool-bar-footer {
    width: 100%;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
}
</style>
