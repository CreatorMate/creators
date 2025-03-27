<script setup lang='ts'>
    import {API} from "~/src/utils/API/API";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";
    import MobileBaseNavigationItems from "~/src/components/Navigation/MobileBaseNavigationItems.vue";
    import Header from "~/src/components/Core/Header.vue";
    import type {JobPost} from "~/src/utils/SupabaseTypes";
    import DiscoveryItems from "~/src/modules/Jobposts/components/DiscoveryItems.vue";
    enum DiscoveryFilters {
        ACCEPTED = "accepted",
        PENDING = "pending",
        CANCELLED = "cancelled",
    }

    const accountState = useAccountState();

    const jobPosts = ref<JobPost[]>([]);

    const active = ref(DiscoveryFilters.ACCEPTED)

    onMounted(async () => {
        await loadJobPosts();
    });

    async function loadJobPosts() {
        if(!accountState.user) return;
        jobPosts.value = [];

        let query = '';

        const jobPostsRequest: APIResponse<JobPost[]> = await API.ask(`/jobposts${query}`);
        if (!jobPostsRequest.success) return;

        jobPosts.value = jobPostsRequest.data;
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
        <DiscoveryItems :jobPosts/>
    </section>
    <MobileNavigation>
        <MobileBaseNavigationItems/>
    </MobileNavigation>
</template>