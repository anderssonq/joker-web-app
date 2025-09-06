<script setup lang="ts">
import AppHeader from '@/components/organisms/AppHeader.vue';
import AppJokeList from '@/components/organisms/AppJokeList.vue';
import AppToolBar from '@/components/organisms/AppToolBar.vue';

</script>

<template>
    <header>
        <AppHeader />
    </header>
    <main class="app-main">
        <AppToolBar />
        <AppJokeList />
    </main>
</template>

<style scoped>
.app-main {
    padding: 1rem;
}
</style>
