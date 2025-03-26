<script setup lang='ts'>
    defineProps<{
        bucket: string,
        name: string,
    }>();

    const config = useRuntimeConfig();
</script>

<template>
    <NuxtImg :src="`${config.public.SUPABASE_URL}/storage/v1/object/public/${bucket}//${name}`"/>
</template>