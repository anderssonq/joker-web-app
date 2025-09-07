<script setup lang="ts">
</script>

<template>
  <footer class="app-footer">
    <a href="https://andersoftware.com/" target="_blank" rel="noopener noreferrer">Ander was here</a>. {{ new
      Date().getFullYear() }}
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  font-size: 1rem;
  background: #fff;
  color: #222;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}
</style>
