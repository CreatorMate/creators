<script setup lang='ts'>

    import {Icon} from "@iconify/vue";
    import AddJobPost from "~/src/modules/Core/components/AddJobPost.vue";
    import ApplyJobPost from "~/src/modules/Core/components/ApplyJobPost.vue";
    import ViewJobPostApplicants from "~/src/modules/Core/components/ViewJobPostApplicants.vue";

    const {jobPost} = defineProps<{
        jobPost: { title: string, id: number, looking_for: string, place: string, date: string, description: string, job_applications: any[]}
    }>();

    const open = ref(false);

    async function close() {
        open.value = false;
    }
</script>

<template>
    <div class="w-full border p-4 flex rounded-2xl justify-between">
        <div class="flex gap-6 items-center">
            <nuxt-img class="rounded-full w-24 h-24" src="/apple-touch-icon.png"></nuxt-img>
            <div class="flex flex-col">
                <p class="text-2xl">{{ jobPost.title }}</p>
                <div class="flex gap-2 text-black text-opacity-40">
                    <p class="text-lg">{{ jobPost.looking_for }}</p>
                </div>
                <div class="flex items-center gap-2 mt-4">
                    <Icon width="32" icon="material-symbols:location-on"/>
                    <p>{{ jobPost.place }}</p>
                </div>
            </div>
        </div>
        <div>
            <button @click="open = true" class="p-1 px-4 border text-white bg-black rounded-full ">{{jobPost.job_applications.length}} view applicants</button>
        </div>
    </div>

    <ModalPopup @close="close" :model-active="open">
        <ViewJobPostApplicants @close="close" @update="close" :jobPost/>
    </ModalPopup>
</template>