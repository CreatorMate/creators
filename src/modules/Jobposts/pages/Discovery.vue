<script setup lang='ts'>
    import {API} from "~/src/utils/API/API";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";
    import MobileBaseNavigationItems from "~/src/components/Navigation/MobileBaseNavigationItems.vue";
    import Header from "~/src/components/Core/Header.vue";
    import {type JobPost, PaymentType} from "~/src/utils/SupabaseTypes";
    import DiscoveryItems from "~/src/modules/Jobposts/components/DiscoveryItems.vue";
    import {Icon} from "@iconify/vue";
    enum DiscoveryFilters {
        FOR_YOU = "for you",
        ALL_JOBS = "all jobs",
        ARCHIVED = "archived",
        FILTER = "filter"
    }

    const activeFilters = ref<string[]>([]);
    const showFilters = ref(false);
    const filterBox = ref<null|HTMLDivElement>(null);

    const accountState = useAccountState();

    const jobPosts = ref<JobPost[]>([]);
    const userRoles = ref('');
    const roleItems = ref(new Map<string, number>());

    const active = ref('for you')

    onMounted(async () => {
        await loadJobPosts();
        countJobPostsPerRole();
    });

    async function loadJobPosts() {
        if(!accountState.user) return;
        jobPosts.value = [];

        let query = '';
        if(activeFilters.value.length > 0) {
            query = `?role=${activeFilters.value.join(',')}`;
        } else if(active.value === DiscoveryFilters.FOR_YOU) {
            query = `?role=${accountState.user.project_types.join(',')}`;
        }

        const jobPostsRequest: APIResponse<JobPost[]> = await API.ask(`/jobposts${query}`);
        if (!jobPostsRequest.success) return;

        jobPosts.value = jobPostsRequest.data;
    }

    async function switchTab(tab: DiscoveryFilters) {
        active.value = tab;
        activeFilters.value = [];
        await loadJobPosts();
        countJobPostsPerRole();
    }

    function countJobPostsPerRole() {
        roleItems.value = new Map<string, number>();
        for(const jobPost of jobPosts.value) {
            if(!roleItems.value.get(jobPost.looking_for)) {
                roleItems.value.set(jobPost.looking_for, 0);
            }
            let value = roleItems.value.get(jobPost.looking_for);
            if(value === undefined) continue;
            roleItems.value.set(jobPost.looking_for, value+=1);
        }
    }

    async function check(name: string) {
        if(activeFilters.value.includes(name)) {
            activeFilters.value = activeFilters.value.filter((filter) => filter != name);
        } else {
            activeFilters.value.push(name);
        }

        await loadJobPosts();
    }

    onClickOutside(filterBox, (event) => {
        if (showFilters.value && !(event.target as HTMLElement).closest(".filter-button")) {
            showFilters.value = false;
        }
    });
</script>

<template>
    <div class="flex xs:hidden w-full justify-center py-6">
        <NuxtImg src="/logo-light.svg"/>
    </div>
    <section class="flex flex-col px-4 gap-3">
        <div class="flex pt-6 pb-3 justify-between items-center">
            <Header text="discovery"/>
            <Icon icon="material-symbols:search-rounded"/>
        </div>
        <div class="w-full flex gap-1 text-size-XS">
            <div @click="switchTab(DiscoveryFilters.FOR_YOU)" class=" text-center border rounded-full py-3 px-5 w-full"
                 :class="{'border-none bg-black text-white': active == DiscoveryFilters.FOR_YOU}">for you
            </div>
            <div @click="switchTab(DiscoveryFilters.ALL_JOBS)" class=" text-center border rounded-full py-3 px-5 w-full"
                 :class="{'border-none bg-black text-white': active == DiscoveryFilters.ALL_JOBS}">all jobs
            </div>
            <div @click="switchTab(DiscoveryFilters.ARCHIVED)" class=" text-center border rounded-full py-3 px-5 w-full"
                 :class="{'border-none bg-black text-white': active == DiscoveryFilters.ARCHIVED}">archived
            </div>
            <div @click="showFilters = !showFilters" class=" text-center rounded-full py-3 px-5 w-full bg-[#F8F8F8] filter-button"
                 :class="{'border border-[#B6B6B6]': showFilters}">filter
                {{ activeFilters.length > 0 ? `(${activeFilters.length})` : '' }}
            </div>
        </div>
        <div
            v-if="showFilters"
            ref="filterBox"
            style="box-shadow: 0px 0px 32px 0px rgba(183, 183, 183, 0.25);"
            class="text-size-XS text-[#111111] bg-white py-3 px-5 rounded-xl flex flex-col gap-2">
            <p class="">roles</p>
            <div v-for="role of roleItems.keys()" class="flex items-center gap-2.5">
                <input :checked="activeFilters.includes(role)" @change="check(role)" class="rounded-none" type="checkbox">
                <p>{{role}} ({{roleItems.get(role) ?? 0}})</p>
            </div>
            <p class="">budget</p>
            <div class="flex items-center gap-1">
                <p class="bg-[#F8F8F8] px-3 py-2 rounded-full">daily rate</p>
                <p class="bg-[#F8F8F8] px-3 py-2 rounded-full">hourly</p>
                <p class="bg-[#F8F8F8] px-3 py-2 rounded-full">budget</p>
            </div>
        </div>
        <DiscoveryItems :jobPosts/>
    </section>
    <MobileNavigation>
        <MobileBaseNavigationItems/>
    </MobileNavigation>
</template>