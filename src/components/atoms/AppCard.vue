<script setup lang="ts">
</script>

<template>
    <div class="app-card">
        <slot />
    </div>
</template>

<style scoped>
.app-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.2s;
}

.app-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}
</style>
