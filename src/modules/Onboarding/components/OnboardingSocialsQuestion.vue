<script setup lang='ts'>
    const model = defineModel();
</script>

<template>
    <input v-model="model" class="w-full border rounded-lg py-3 px-3 mt-2 outline-gray-300" type="text">
</template>