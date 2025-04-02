<script setup lang='ts'>
    defineProps<{
        text: string
    }>()
</script>

<template>
    <h2 class="text-size-M font-medium text-[#3C3C3C]">{{text}}</h2>
</template>