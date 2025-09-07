<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  rating: number;
  maxRating?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxRating: 5,
});

const emit = defineEmits<{
  ratingSelected: [rating: number]
}>();

const normalizedRating = computed(() => {
  return Math.max(0, Math.min(props.rating, props.maxRating));
});

const stars = computed(() => {
  const starArray = [];
  for (let i = 1; i <= props.maxRating; i++) {
    starArray.push({
      filled: i <= normalizedRating.value,
      index: i
    });
  }
  return starArray;
});

function selectRating(rating: number) {
  emit('ratingSelected', rating);
}
</script>

<template>
  <div class="app-rating">
    <span v-for="star in stars" :key="star.index" class="star star--selectable" :class="{
      'star--filled': star.filled,
    }" @click="selectRating(star.index)">
      ⭐
    </span>
    <span class="rating-text">{{ normalizedRating }}/{{ maxRating }}</span>
  </div>
</template>

<style scoped>
.app-rating {
  display: flex;
  align-items: center;
  gap: 2px;
}

.star {
  font-size: 1.2rem;
  filter: grayscale(100%);
  transition: filter 0.2s;
}

.star--filled {
  filter: grayscale(0%);
}

.star--selectable {
  cursor: pointer;
}

.star--selectable:hover {
  transform: scale(1.1);
}

.rating-text {
  margin-left: 8px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}
</style>
