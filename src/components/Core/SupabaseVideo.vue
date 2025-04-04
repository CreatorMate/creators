<script setup lang='ts'>
    defineProps<{
        bucket: string,
        name: string,
        controls: boolean,
        muted: boolean,
        loop: boolean,
        playsinline: boolean,
    }>();

    const config = useRuntimeConfig();
</script>

<template>
    <video :controls :muted :loop :playsinline :src="`${config.public.SUPABASE_URL}/storage/v1/object/public/${bucket}//${name}`"  preload="metadata"/>
</template>

<style>

video::-webkit-media-controls-current-time-display{
    display: none;
}
video::-webkit-media-controls-time-remaining-display {
    display: none;
}

video::-moz-media-controls-time-remaining-display {
    display: none;
}

video::-media-controls-time-remaining-display {
    display: none;
}

video::-webkit-media-controls-time-remaining-display {
    display: none;
}

video::-webkit-media-controls-overflow-button {
    display: none;
}

video::-moz-media-controls-overflow-button {
    display: none;
}

video::media-controls-overflow-button {
    display: none;
}
</style>