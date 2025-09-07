<script setup lang="ts">
import AppButton from '@/components/atoms/AppButton.vue'
import { computed } from 'vue';

import { useJokesStore } from '../../stores/jokes';

const store = useJokesStore();
const { getTotalPages, getCurrentPage, setCurrentPage } = store;

interface Props {
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5
})

const visiblePages = computed(() => {
  const { maxVisiblePages } = props
  const pages: number[] = []

  let startPage = Math.max(1, getCurrentPage() - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(getTotalPages(), startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= getTotalPages() && page !== getCurrentPage()) {
    setCurrentPage(page);
  }
}

function goToPrevious() {
  goToPage(getCurrentPage() - 1)
}

function goToNext() {
  goToPage(getCurrentPage() + 1)
}
</script>

<template>
  <div class="app-pagination">
    <AppButton text="Previous" color="purple" @click="goToPrevious" :disabled="getCurrentPage() === 1" />

    <div class="pagination-pages">
      <AppButton v-for="page in visiblePages" :key="page" :text="page.toString()"
        :color="page === getCurrentPage() ? 'green' : 'purple'" @click="goToPage(page)" />
    </div>

    <AppButton text="Next" color="purple" @click="goToNext" :disabled="getCurrentPage() === getTotalPages()" />
  </div>
</template>

<style scoped>
.app-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 16px 0;
}

.pagination-pages {
  display: flex;
  gap: 4px;
}
</style>