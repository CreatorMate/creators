<script setup lang='ts'>
    import type {JobPost, WorkItem} from "~/src/utils/SupabaseTypes";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import {API} from "~/src/utils/API/API";
    import {Icon} from "@iconify/vue";
    import type {Ref} from "vue";
    import Label from "~/src/components/Core/Label.vue";
    import SupabaseImage from "~/src/components/Core/SupabaseImage.vue";
    import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";

    const router = useRouter();
    const route = useRoute();
    const jobPostId = route.params.id;
    const jobPost = ref<JobPost|null>(null);
    const applied = ref(false);
    const accountState = useAccountState();
    const showWorkItems = ref(false)
    const application = ref('');

    const selectedWorkItems = ref<number[]>([]);

    const workItems: Ref<WorkItem[]> = ref([]);

    onMounted(async () => {
        if(!jobPostId) return;
        const jobPostRequest: APIResponse<JobPost> = await API.ask(`/jobposts/${jobPostId}`);
        console.log(jobPostRequest)
        if(!jobPostRequest.success) {
            await router.push('/');
            return;
        }

        for(const applicant of jobPostRequest.data.job_applications) {
            if(applicant.user_id == accountState.user?.id) {
                applied.value = true;
                break;
            }
        }

        if(applied.value) {
            await router.replace(`/discovery/${jobPostId}`)
            return;
        }

        const workItemsRequest: APIResponse<WorkItem[]> = await API.ask(`/work/${accountState.user?.id}`);
        if(!workItemsRequest.success) return;

        workItems.value = workItemsRequest.data;

        jobPost.value = jobPostRequest.data;
    });

    function goBack() {
        router.back();
    }

    async function check(id: number) {
        if(selectedWorkItems.value.includes(id)) {
            selectedWorkItems.value = selectedWorkItems.value.filter((workItemId) => workItemId != id);
        } else {
            selectedWorkItems.value.push(id);
        }
    }

    async function apply() {
        await API.ask(`/jobposts/${jobPostId}/apply`, 'POST', {
            application: application.value,
            workItems: selectedWorkItems.value
        });
        await router.push(`/discovery/${jobPostId}`);
    }
</script>

<template>
    <div class="flex xs:hidden w-full justify-center py-6 relative">
        <Icon @click="goBack" icon="material-symbols:arrow-back-ios" class="absolute left-6 top-1/2 -translate-y-1/2">
            back
        </Icon>
        <NuxtImg src="/logo-light.svg"/>
    </div>
    <section v-if="jobPost" class=" flex flex-col px-4 pt-8 pb-3 border-t">
        <h1 class="text-size-XL font-semibold">{{ jobPost.looking_for + ' ' }}<span
            class="text-[#8D8D8D]">needed in </span>{{ jobPost.place }}</h1>
        <h1 class="text-size-XL font-semibold mb-6"><span class="text-[#8D8D8D]"> on </span>{{ jobPost.date }}</h1>
        <Label text="application" class="py-2"/>
        <textarea v-model="application" class="h-[135px] bg-[#F8F8F8] rounded-xl px-4 py-6 text-[#3C3C3C] placeholder-[#3C3C3C] resize-none" placeholder="explain why you would be a good fit and include any qestions you may have"></textarea>
        <Label text="select related work" class="py-2"/>
        <div @click="showWorkItems = !showWorkItems" class="pointer text-[#3C3C3C] bg-[#F8F8F8] rounded-xl px-4 py-6 flex justify-between items-center">
            <div class="flex items-center gap-2.5">
                <Icon width="20" icon="material-symbols:grid-view-outline"/>
                <p>select work</p>
            </div>
            <Icon :class="{'rotate-180': showWorkItems}" width="20" icon="material-symbols:keyboard-arrow-down"/>
        </div>
        <div v-if="showWorkItems" class="grid grid-cols-2 gap-2 bg-white rounded-xl border shadow-box mt-2 p-3 max-h-[320px] overflow-auto">
            <div @click="check(workItem.id)" class="w-full mb-2 flex flex-col gap-1 relative" v-for="workItem of workItems">
                <SupabaseImage class="w-full h-[120px] object-cover rounded-lg" bucket="work-images" :name="workItem.image"/>
                <p class="text-size-S">{{workItem.title}}</p>
                <p class="text-size-XS text-[#616161]">{{workItem.job_title}}</p>
                <div class="bg-white absolute w-6 h-6 rounded-full text-black flex justify-center items-center top-1 right-1 z-10 border ">
                    <div v-if="selectedWorkItems.includes(workItem.id)" class="w-2 h-2 bg-black rounded-full"></div>
                </div>
            </div>
        </div>
    </section>
    <MobileNavigation v-if="jobPost">
        <div class="w-full h-full flex p-1 justify-between">
            <NuxtLink :to="`/discovery/${jobPostId}`" class="h-full rounded-full text-left flex flex-col justify-center pl-6">
               cancel
            </NuxtLink>
            <button @click="apply" :disabled="application.length === 0 || selectedWorkItems.length === 0" class="h-full py-2 px-12 rounded-full bg-black text-white disabled:bg-opacity-80">submit application</button>
        </div>
    </MobileNavigation>
</template>

<style scoped>
.shadow-box {
    box-shadow: 0px 0px 32px 0px rgba(183, 183, 183, 0.25);
}
</style>
