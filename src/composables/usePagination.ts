import { ref, computed, watch, type ComputedRef } from "vue";

/**
 * Pass a function that returns the current (reactive) list each access.
 */
export function usePagination<T>(source: () => T[]) {
  const currentPage = ref(1);
  const perPage = ref(5);

  // Reactive bridge to the provided source
  const items = computed<T[]>(() => source());

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(items.value.length / perPage.value))
  );

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    console.log('Paginating items from', items.value.length);
    return items.value.slice(start, start + perPage.value);
  });

  function setPage(p: number) {
    if (p < 1) p = 1;
    if (p > totalPages.value) p = totalPages.value;
    currentPage.value = p;
  }

  function setPerPage(n: number) {
    perPage.value = n;
    setPage(1);
  }

  // If data shrinks so current page is out of range, correct it
  watch([items, perPage], () => {
    if (
      (currentPage.value - 1) * perPage.value >= items.value.length &&
      currentPage.value !== 1
    ) {
      setPage(1);
    }
  });

  return {
    getCurrentPage: () => currentPage.value,
    getPerPage: () => perPage.value,
    getPaginatedItems: () => paginatedItems.value,
    getTotalPages: () => totalPages.value,
    setPage,
    setPerPage,
  };
}