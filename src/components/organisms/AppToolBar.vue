<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { defineAsyncComponent } from 'vue';

const AppCard = defineAsyncComponent(() => import('@/components/atoms/AppCard.vue'));
const AppDropdown = defineAsyncComponent(() => import('@/components/molecules/AppDropdown.vue'));
const AppButton = defineAsyncComponent(() => import('@/components/atoms/AppButton.vue'));
const AppPagination = defineAsyncComponent(() => import('@/components/molecules/AppPagination.vue'));
const AppSkeleton = defineAsyncComponent(() => import('@/components/atoms/AppSkeleton.vue'));

import { useJokesStore } from '../../stores/jokes';
import type { SortBy } from '@/types';

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
                <div>
                    <AppSkeleton v-if="getLoading()" />
                    <AppDropdown title="Select a joke type" :items="types" :itemSelected="getTypeSelected()"
                        @handleSelect="handleSelectType" />
                </div>
                <AppDropdown title="Order jokes by" :items="getSortTypes()" :itemSelected="getSortBy()"
                    @handleSelect="handleSelectSort" />
                <AppDropdown title="Number of jokes per page" :items="[2, 5, 10]" :itemSelected="getPerPage()"
                    @handleSelect="handleSelectPerPage" />
                <AppButton :text="`Add a new Joke 😜`" @click="setModeForm('create')"
                    :disabled="getModeForm() === 'create'" />
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
