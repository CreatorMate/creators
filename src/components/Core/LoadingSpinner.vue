<template>
  <div class="spinner-container" :class="{ 'is-large': large }">
    <div
      class="spinner"
      :style="{
        'border-color': color,
        'border-top-color': 'transparent',
        width: size + 'px',
        height: size + 'px',
      }"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: "#3498db",
  },
  size: {
    type: Number,
    default: 30,
  },
  large: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.spinner {
  border: 3px solid;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.is-large .spinner {
  border-width: 4px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
