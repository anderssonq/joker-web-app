<script setup lang="ts">
import AppCard from '../atoms/AppCard.vue';
import JokeTypeSelect from '../molecules/JokeTypeSelect.vue';
import AppButton from '../atoms/AppButton.vue';

</script>

<template>
    <div class="app-tool-bar">
        <AppCard>
            <div class="tool-bar-header">
                <h3>Menu</h3>
            </div>
            <div class="tool-bar-content">
                <JokeTypeSelect />
                <AppButton text="Add a new Joke 😜" color="purple" />
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
</style>
