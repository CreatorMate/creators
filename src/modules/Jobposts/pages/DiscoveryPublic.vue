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
    import PublicDiscoveryItems from "~/src/modules/Jobposts/components/PublicDiscoveryItems.vue";
    enum DiscoveryFilters {
        FOR_YOU = "for you",
        ALL_JOBS = "all jobs",
        ARCHIVED = "ARCHIVED",
        FILTER = "filter"
    }

    const activeFilters = ref<string[]>([]);
    const showFilters = ref(false);
    const filterBox = ref<null|HTMLDivElement>(null);

    const accountState = useAccountState();

    const jobPosts = ref<JobPost[]>([]);
    const userRoles = ref('');
    const roleItems = ref(new Map<string, number>());

    const active = ref('for you');

    useHead({
        title: 'discovery - creatormate'
    })

    onMounted(async () => {
        await loadJobPosts();
        countJobPostsPerRole();
    });

    async function loadJobPosts() {
        jobPosts.value = [];

        let query = '';
        let roleQuery = ''
        let archived = ''

        if(activeFilters.value.length > 0) {
            roleQuery = activeFilters.value.join(',');
        }

        if(active.value === DiscoveryFilters.ARCHIVED) {
            archived = 'true';
        }

        query = `?role=${roleQuery}&archived=${archived}`;

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
    <div class="flex w-full justify-center py-6">
        <NuxtImg class="w-10" src="/logo-light.svg"/>
    </div>
    <section class="flex flex-col px-4 gap-3">
        <div class="flex pt-6 pb-3 justify-between items-center">
            <Header text="discovery"/>
        </div>
        <div class="w-full flex gap-1 text-size-XS">
            <div @click="switchTab(DiscoveryFilters.FOR_YOU)" class=" text-center border rounded-full py-3 px-5 cursor-pointer"
                 :class="{'border-none bg-black text-white': active == DiscoveryFilters.FOR_YOU}">for you
            </div>
            <div @click="switchTab(DiscoveryFilters.ARCHIVED)" class=" text-center border rounded-full py-3 px-5 cursor-pointer"
                 :class="{'border-none bg-black text-white': active == DiscoveryFilters.ARCHIVED}">archived
            </div>
            <div @click="showFilters = !showFilters" class=" text-center rounded-full py-3 px-5 filter-button cursor-pointer border bg-[#F8F8F8] flex gap-2.5 items-center"
                 :class="{'border-[#B6B6B6]': showFilters, 'border-[#F8F8F8]': !showFilters}">
                <Icon height="16px" icon="material-symbols:tune"/>
                <p>
                    filter
                    {{ activeFilters.length > 0 ? `(${activeFilters.length})` : '' }}
                </p>
            </div>
        </div>
        <div class="relative w-full">
            <div
                v-if="showFilters"
                ref="filterBox"
                style="box-shadow: 0px 0px 32px 0px rgba(183, 183, 183, 0.25);"
                class="text-size-XS text-[#111111] bg-white py-3 px-5 rounded-xl flex flex-col gap-2 w-full absolute top-0 z-50 ">
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
            <PublicDiscoveryItems :jobPosts/>
        </div>
    </section>
</template>