<script setup lang='ts'>
    const props = defineProps<{
        step: number,
        total: number
    }>();

    const {step, total} = toRefs(props);

    function progressBarStyle() {
        const width = (step.value / total.value) * 100 + '%';
        return {
            width: width,
        };
    }
</script>

<template>
    <section class="w-full h-[3px]">
        <div class="bg-[#D9D9D9] h-full progress-bar" :style="progressBarStyle()"></div>
    </section>
</template>

<style scoped>
.progress-bar {
    transition: width 0.3s;
}
</style>