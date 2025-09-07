<script setup lang="ts">
import AppButton from '../atoms/AppButton.vue';

interface Props {
    title: string;
    items: string[] | number[];
    itemSelected: string | number;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Select a joke type',
    items: () => [],
    itemSelected: 'general',
});

const emit = defineEmits<{
    handleSelect: [type: string]
}>();

function handleSelect(item: string) {
    emit('handleSelect', item);
}
</script>

<template>
    <div class="dropdown">
        <AppButton :text="`${props.title}: ${props.itemSelected}`" color="purple" />
        <div class="dropdown-content">
            <a v-for="item in props.items" :key="item" @click="handleSelect(item)">{{ item }}</a>
        </div>
    </div>
</template>

<style scoped>
.dropdown {
    position: relative;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 200px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    cursor: pointer;
}

.dropdown-content a:hover {
    background-color: #f1f1f1
}

.dropdown:hover .dropdown-content {
    display: block;
}
</style>