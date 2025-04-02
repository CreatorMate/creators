<script setup lang='ts'>
    import {API} from "~/src/utils/API/API";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";
    import MobileBaseNavigationItems from "~/src/components/Navigation/MobileBaseNavigationItems.vue";
    import Header from "~/src/components/Core/Header.vue";
    import type {JobApplication, JobPost} from "~/src/utils/SupabaseTypes";
    import DiscoveryItems from "~/src/modules/Jobposts/components/DiscoveryItems.vue";
    import MyJobPostItems from "~/src/modules/Jobposts/components/MyJobPostItems.vue";
    enum DiscoveryFilters {
        ACCEPTED = "accepted",
        PENDING = "pending",
        CANCELLED = "cancelled",
    }

    const accountState = useAccountState();

    const jobApplications = ref<JobApplication[]>([]);

    const active = ref(DiscoveryFilters.ACCEPTED)

    onMounted(async () => {
        await loadJobPosts();
    });

    async function loadJobPosts() {
        if(!accountState.user) return;
        jobApplications.value = [];

        let query = '';

        if(active.value == DiscoveryFilters.PENDING) {
            query = '?status=PENDING';
        }

        if(active.value == DiscoveryFilters.ACCEPTED) {
            query = '?status=HIRED';
        }

        if(active.value == DiscoveryFilters.CANCELLED) {
            query = '?status=CANCELLED';
        }

        const jobPostsRequest: APIResponse<JobApplication[]> = await API.ask(`/me/applications${query}`);
        console.log(jobPostsRequest)
        if (!jobPostsRequest.success) return;

        jobApplications.value = jobPostsRequest.data;
    }

    async function switchTab(tab: DiscoveryFilters) {
        active.value = tab;
        await loadJobPosts();
    }

</script>

<template>
    <div class="flex xs:hidden w-full justify-center py-6">
        <NuxtImg src="/logo-light.svg"/>
    </div>
    <section class="flex flex-col px-4 gap-3 border-t">
        <div class="flex-col flex pt-6 pb-3 gap-1">
            <Header text="my jobs"/>
        </div>
        <div class="w-full flex gap-1 text-size-XS">
            <div @click="switchTab(DiscoveryFilters.ACCEPTED)" class=" text-center border rounded-full py-3 px-5"
                 :class="{'border-none bg-black text-white': active == DiscoveryFilters.ACCEPTED}">accepted
            </div>
            <div @click="switchTab(DiscoveryFilters.PENDING)" class=" text-center border rounded-full py-3 px-5"
                 :class="{'border-none bg-black text-white': active == DiscoveryFilters.PENDING}">pending
            </div>
            <div @click="switchTab(DiscoveryFilters.CANCELLED)" class=" text-center border rounded-full py-3 px-5"
                 :class="{'border-none bg-black text-white': active == DiscoveryFilters.CANCELLED}">cancelled
            </div>
        </div>
        <MyJobPostItems :job-applications/>
    </section>
    <MobileNavigation>
        <MobileBaseNavigationItems/>
    </MobileNavigation>
</template>