<script setup lang="ts">
interface Props {
    text?: string;
    color?: 'purple' | 'green' | 'red';
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    text: 'Press me',
    color: 'purple',
    disabled: false
});

const emit = defineEmits<{
    click: []
}>();

function handleClick() {
    if (!props.disabled) {
        emit('click');
    }
}
</script>

<template>
    <button 
        class="app-button" 
        :class="[
            `app-button--${props.color}`,
            { 'app-button--disabled': props.disabled }
        ]"
        :disabled="props.disabled"
        @click="handleClick"
    >
        {{ props.text }}
    </button>
</template>

<style scoped>
.app-button {
    display: inline-block;
    outline: 0;
    border: none;
    cursor: pointer;
    font-weight: 600;
    border-radius: 4px;
    font-size: 13px;
    height: 30px;
    color: white;
    padding: 0 10px;
    transition: background-color 0.2s;
}

.app-button--disabled {
    background-color: #9ca3af !important;
    cursor: not-allowed !important;
    opacity: 0.6;
}

.app-button--disabled:hover,
.app-button--disabled:active {
    background-color: #9ca3af !important;
}

.app-button--purple {
    background-color: #9147ff;
}

.app-button--purple:hover {
    background-color: #772ce8;
}

.app-button--purple:active {
    background-color: #5a1abf;
}

.app-button--green {
    background-color: #22c55e;
}

.app-button--green:hover {
    background-color: #16a34a;
}

.app-button--green:active {
    background-color: #15803d;
}

.app-button--red {
    background-color: #ef4444;
}

.app-button--red:hover {
    background-color: #dc2626;
}

.app-button--red:active {
    background-color: #b91c1c;
}
</style>