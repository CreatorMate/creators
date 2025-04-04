<script setup lang="ts">
    import type { PropType } from "vue";
    import SupabaseVideo from "~/src/components/Core/SupabaseVideo.vue";

    const props = defineProps<{
        videoName: string
    }>();

</script>

<template>
    <div class="w-[285px] h-[510px] flex-shrink-0 flex bg-black rounded-xl">
        <!-- The video element -->
        <SupabaseVideo
            class="block object-contain max-w-full max-h-full rounded-xl"
            :muted="true"
            :loop="true"
            :playsinline="true"
            :controls="true"
            bucket="work-images"
            :name="videoName">
            Your browser does not support the video tag.
        </SupabaseVideo>
    </div>
</template>
