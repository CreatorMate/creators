<script setup lang='ts'>
    defineProps<{
        text: string
    }>()
</script>

<template>
    <h1 class="text-size-XL font-semibold">{{text}}</h1>
</template>