<script setup lang="ts">
    import '~/src/assets/css/tailwind.css'
    import ToastArea from "~/src/utils/Toast/ToastArea.vue";
    const colorMode = useColorMode();
</script>

<template>
    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
    <ToastArea></ToastArea>
</template>
