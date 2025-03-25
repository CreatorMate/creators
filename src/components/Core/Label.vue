<script setup lang='ts'>
    defineProps<{
        text: string
    }>()
</script>

<template>
    <p class="font-medium text-size-M">{{text}}</p>
</template>