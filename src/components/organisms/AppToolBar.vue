<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import { MODE_CREATE } from '@/const';
import type { SortBy } from '@/types';

const AppCard = defineAsyncComponent(() => import('@/components/atoms/AppCard.vue'));
const AppDropdown = defineAsyncComponent(() => import('@/components/molecules/AppDropdown.vue'));
const AppButton = defineAsyncComponent(() => import('@/components/atoms/AppButton.vue'));
const AppPagination = defineAsyncComponent(() => import('@/components/molecules/AppPagination.vue'));
const AppSkeleton = defineAsyncComponent(() => import('@/components/atoms/AppSkeleton.vue'));

import { useJokesStore } from '../../stores/jokes';

const store = useJokesStore();
const { loadJokeTypes, setTypeSelected, getTypeSelected, setSortBy, getSortBy, getSortTypes, setPerPage, getPerPage, setModeForm, getModeForm, getLoading } = store;

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

const handleSelectPerPage = (perPage: string) => {
    setPerPage(Number(perPage));
};

</script>

<template>
    <div class="app-tool-bar">
        <AppCard>
            <div class="tool-bar-header">
                <h3>Menu 🤓☝️</h3>
            </div>
            <div class="tool-bar-content">
                <div>
                    <AppSkeleton v-if="getLoading() || !getTypeSelected()" />
                    <AppDropdown v-if="!getLoading() && getTypeSelected()" title="Select a joke type" :items="types"
                        :itemSelected="getTypeSelected()" @handleSelect="handleSelectType" />
                </div>
                <AppDropdown title="Order jokes by" :items="getSortTypes()" :itemSelected="getSortBy()"
                    @handleSelect="handleSelectSort" />
                <AppDropdown title="Number of jokes per page" :items="[2, 5, 10]" :itemSelected="getPerPage()"
                    @handleSelect="handleSelectPerPage" />
                <AppButton :text="`Add a new Joke 😜`" @click="setModeForm(MODE_CREATE)"
                    :disabled="getModeForm() === MODE_CREATE" />
            </div>
            <div class="tool-bar-footer">
                <AppPagination :maxVisiblePages="5" />
            </div>
        </AppCard>
    </div>
</template>

<style scoped>
.tool-bar-header {
    width: 100%;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
}

.tool-bar-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: stretch;
    justify-content: center;
}

.tool-bar-content>* {
    flex: 1 1 180px;
    min-width: 160px;
    max-width: 240px;
}

.tool-bar-footer {
    width: 100%;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
}
</style>
