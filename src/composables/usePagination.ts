import { ref, computed, watch } from "vue";
// INFO: closure usage -> functions below capture outer scope variables.
export function usePagination<T>(source: () => T[]) {
  const currentPage = ref(1);
  const perPage = ref(5);

  const items = computed<T[]>(() => source());

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(items.value.length / perPage.value))
  );

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
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