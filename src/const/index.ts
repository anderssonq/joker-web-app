  // Cache configuration
  export const CACHE_DURATION = import.meta.env.VITE_JOKE_CACHE_MINUTES * 60 * 1000; // 5 minutes in milliseconds
  export const JOKES_CACHE_KEY = 'jokes_cache';
  export const TYPES_CACHE_KEY = 'types_cache';

  // Crud modes
  export const MODE_EDIT = "edit";
  export const MODE_CREATE = "create";
  export const MODE_NONE = "none";