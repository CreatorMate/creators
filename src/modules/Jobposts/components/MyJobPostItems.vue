<script setup lang='ts'>
    import type {JobApplication, JobPost} from "~/src/utils/SupabaseTypes";
    import {Icon} from "@iconify/vue";

    const props = defineProps<{
        jobApplications: JobApplication[]
    }>();

    const {jobApplications} = toRefs(props);

    function getTimeRemaining(datetime: string) {
        const targetDate = new Date(datetime);
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        const daysRemaining = Math.floor(difference / (1000 * 60 * 60 * 24));
        const remaining = difference % (1000 * 60 * 60 * 24);
        const hours = Math.floor(remaining / (1000 * 60 * 60));

        return `${daysRemaining}`
    }
</script>

<template>
    <NuxtLink :to="`/discovery/${jobApplication.job_postings.id}`" v-for="jobApplication of jobApplications"
              class="w-full border rounded-3xl flex flex-col py-4 px-3 mt-6">
        <div class="flex items-center justify-between mb-6">
            <p class="text-[#151515] text-size-XS">open for {{
                    getTimeRemaining(jobApplication.job_postings.closes_on)
                }} days</p>
            <Icon width="32" icon="material-symbols:arrow-insert" class="rotate-90 text-gray-400"/>
        </div>

        <div class="w-full flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
                <NuxtImg class="rounded-2xl w-16 h-16 object-cover" src="/icons/jobpost.png"/>
                <div class="flex flex-col justify-center">
                    <h1 class="text-size-M font-semibold">{{ jobApplication.job_postings.looking_for + ' ' }}<span
                        class="text-[#8D8D8D]">needed in </span>{{ jobApplication.job_postings.place }}<span
                        class="text-[#8D8D8D]"> on </span></h1>
                    <h1 class="text-size-M font-semibold">{{ jobApplication.job_postings.date }}</h1>
                </div>
            </div>
        </div>
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-2.5 py-4 px-3">
                <Icon icon="material-symbols:history"/>
                <p :class="{'bg-green-200': jobApplication.status == 'HIRED'}" class="py-1 px-3 bg-[#EEEBCB] rounded-full">status: {{ jobApplication.status }}</p>
            </div>
            <Icon class="rotate-180" icon="material-symbols:arrow-back-ios"/>
        </div>
    </NuxtLink>
</template>