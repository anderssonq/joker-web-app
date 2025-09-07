<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  type: 'text',
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <input
    :value="modelValue"
    :type="props.type"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    class="app-textfield"
    @input="handleInput"
  />
</template>

<style scoped>
.app-textfield {
  font-size: 14px;
  border-radius: 6px;
  line-height: 1.5;
  padding: 5px 10px;
  transition: box-shadow 100ms ease-in, border 100ms ease-in, background-color 100ms ease-in;
  border: 2px solid #dee1e2;
  color: rgb(14, 14, 16);
  background: #dee1e2;
  display: block;
  height: 36px;
  width: 100%;
  outline: none;
}

.app-textfield:hover {
  border-color: #ccc;
}

.app-textfield:focus {
  border-color: #9147ff;
  background: #fff;
}

.app-textfield:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>