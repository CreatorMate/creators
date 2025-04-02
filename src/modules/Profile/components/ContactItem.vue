<script setup lang='ts'>
    import {Icon} from "@iconify/vue";
    defineProps<{
        icon: string,
        text: string
    }>()
</script>

<template>
    <div class="flex items-center gap-2 text-[#616161]">
        <Icon :icon width="16"/>
        <p class="text-size-M">{{text}}</p>
    </div>
</template>