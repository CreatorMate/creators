<script setup lang='ts'>
    import {Icon} from "@iconify/vue";
    import {API} from "~/src/utils/API/API";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import JobPost from "~/src/modules/Core/components/JobPost.vue";

    const accountState = useAccountState();

    const jobPosts = ref<any[]>([])

    onMounted(async () => {
        await loadJobPosts();
    })

    async function loadJobPosts() {
        jobPosts.value = [];

        const jobPostsRequest: APIResponse<{job_posts: any[]}> = await API.ask(`/jobposts`);
        console.log(jobPostsRequest)
        if(!jobPostsRequest.success) return;

        jobPosts.value = jobPostsRequest.data.job_posts;
    }

</script>

<template>
    <section class="w-full flex flex-col">
        <div class="flex w-full justify-between">
            <h1 class="text-3xl font-semibold">Discover work</h1>
        </div>
        <div class="mt-12 flex gap-2">
            <button class="p-1 px-4 border rounded-full text-white bg-black">Active</button>
            <button class="p-1 px-4 border rounded-full ">This week</button>
            <button class="p-1 px-4 border rounded-full ">Amsterdam</button>
        </div>
        <div v-if="jobPosts.length == 0" class="w-full items-center flex flex-col border mt-6">
            <div class="mt-8">
                <div class="shadow p-4 rounded-2xl">
                    <Icon class="" width="32" icon="material-symbols:add-notes-outline-sharp"/>
                </div>
            </div>
            <p class="text-center mt-2 text-lg">no active jobs</p>
            <p class="text-center mt-1 text-black text-opacity-40 mb-8">you dont have any active posts</p>
        </div>
        <div v-else class="flex flex-col w-full mt-6 gap-4">
            <JobPost v-for="jobPost of jobPosts" :jobPost/>
        </div>
    </section>
</template>