<script setup lang='ts'>
    import type {JobPost} from "~/src/utils/SupabaseTypes";
    import SupabaseImage from "~/src/components/Core/SupabaseImage.vue";
    import {Icon} from "@iconify/vue";

    const props = defineProps<{
        jobPosts: JobPost[]
    }>();

    const {jobPosts} = toRefs(props);

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
    <NuxtLink :to="`/discovery/${jobPost.id}`" v-for="jobPost of jobPosts" class="w-full border rounded-3xl flex flex-col py-4 px-3 mt-6">
        <div class="w-full flex items-center justify-between mb-1">
            <div class="flex items-center gap-3">
                <SupabaseImage class="rounded-full w-9 h-9" bucket="user-pictures"
                               :name="jobPost.creative_lead.profile_picture"/>
                <div class="flex flex-col">
                    <p class="text-size-XS text-[#3C3C3C]">director</p>
                    <p class="text-size-S font-medium">{{jobPost.creative_lead.first_name}} {{jobPost.creative_lead.last_name}}</p>
                </div>
            </div>
            <Icon width="32" icon="material-symbols:arrow-insert" class="rotate-90"/>
        </div>
        <p class="text-[#151515] text-size-XS mb-1">open for {{ getTimeRemaining(jobPost.closes_on) }} days</p>
        <h1 class="text-size-M font-semibold">{{ jobPost.looking_for + ' ' }}<span
            class="text-[#8D8D8D]">needed in </span>{{ jobPost.place }}<span class="text-[#8D8D8D]"> on </span></h1>
        <h1 class="text-size-M font-semibold mb-6">{{ jobPost.date }}</h1>
        <div class="flex gap-2 items-center">
            <div class="flex items-center gap-1 py-2 px-3">
                <Icon width="16" icon="material-symbols:location-on-outline"/>
                <p class="text-size-XS">{{ jobPost.place }}</p>
            </div>
            <div class="flex items-center gap-1 py-2 px-3">
                <Icon width="16" icon="material-symbols:payments-outline"/>
                <p class="text-size-XS">€{{
                        jobPost.price > 1000 ? jobPost.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : jobPost.price
                    }}</p>
            </div>
        </div>
    </NuxtLink>
</template>