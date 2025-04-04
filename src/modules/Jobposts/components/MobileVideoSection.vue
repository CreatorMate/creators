<script setup lang='ts'>
    import {useSwipe} from "@vueuse/core";
    import VideoItem from "~/src/modules/Jobposts/components/VideoItem.vue";
    import Label from "~/src/components/Core/Label.vue";

    const {videoList} = defineProps<{
        videoList: string[]
    }>();

    const sectionRef = ref<HTMLElement | null>(null);

    const { direction, distanceY } = useSwipe(sectionRef, {
        threshold: 50, // Minimum distance in pixels to be considered a swipe
        onSwipeEnd: (e: TouchEvent | MouseEvent, dir: "up" | "down" | "left" | "right" | null) => {
            // Check if it was a significant vertical swipe upwards
            if (dir === "up" && distanceY.value > 50) {
                // Adjust distance threshold as needed
                console.log("Vertical swipe up detected, swiping section away.");
                isSwipedAway.value = true;
            }

        },
    });
</script>

<template>
    <section ref="sectionRef" class="deliverables-section relative overflow-hidden bg-white">
        <Label text="Deliverables" class="mt-9 mb-3"/>
        <div class="scroll-container flex gap-1">
            <VideoItem
                v-for="video in videoList"
                :key="video.id"
                class="video-list-item"
                :video-name="video"/>
            <!-- Add more VideoItem components or load dynamically -->
        </div>
    </section>
</template>

<style scoped>
.deliverables-section {
    transition: transform 0.4s ease-out;
}

/* --- New Class for Swiped State --- */
.deliverables-section.swiped-away {
    transform: translateX(-105%);
}

.scroll-container {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
        display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.video-list-item {
    scroll-snap-align: start;
}
</style>