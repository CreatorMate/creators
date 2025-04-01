<script setup lang='ts'>

    import {Icon} from "@iconify/vue";
    import SupabaseImage from "~/src/components/Core/SupabaseImage.vue";
    import {type JobPost, PaymentType} from "~/src/utils/SupabaseTypes";
    import {API} from "~/src/utils/API/API";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import Label from "~/src/components/Core/Label.vue";
    import MobileNavigation from "~/src/components/Navigation/MobileNavigation.vue";
    import {boolean} from "zod";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    const router = useRouter();
    const route = useRoute();
    const jobPostId = route.params.id;
    const jobPost = ref<JobPost|null>(null);
    const applied = ref(false);
    const accountState = useAccountState();
    const available = ref(0);

    onMounted(async () => {
        if(!jobPostId) return;
        const jobPostRequest: APIResponse<JobPost> = await API.ask(`/jobposts/${jobPostId}`);
        console.log(jobPostRequest)
        if(!jobPostRequest.success) {
            await router.push('/');
            return;
        }

        let remaining = jobPostRequest.data.available_slots;
        for(const application of jobPostRequest.data.job_applications) {
            if(application.status == "HIRED") {
                remaining--;
            }
        }
        available.value = remaining;
        for(const applicant of jobPostRequest.data.job_applications) {
            if(applicant.user_id == accountState.user?.id) {
                applied.value = true;
            }
        }

        jobPost.value = jobPostRequest.data;
    });
    function goBack() {
        router.back();
    }

    function getTimeRemaining(datetime: string) {
        const targetDate = new Date(datetime);
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        const daysRemaining = Math.floor(difference / (1000 * 60 * 60 * 24));

        return `${daysRemaining}`
    }

    function getPriceLabel(): string {
        if(!jobPost.value) return ''
        const price = jobPost.value.price > 1000 ? jobPost.value.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : jobPost.value.price;
        let label = '';
        switch (jobPost.value.payment_type) {
            case PaymentType.HOURLY: {
                label = '/hour'
                break;
            }
            case PaymentType.DAILY: {
                label = '/day'
                break;
            }
        }

        return `${price}${label}`


    }

</script>

<template>
    <div class="flex xs:hidden w-full justify-center py-6 relative">
        <NuxtLink to="/">
            <Icon icon="material-symbols:arrow-back-ios" class="absolute left-6 top-1/2 -translate-y-1/2"></Icon>
        </NuxtLink>
        <NuxtImg src="/logo-light.svg"/>
    </div>
    <NuxtImg class="w-full h-[244px] min-h-[244px] object-cover" src="/icons/jobpost.png"/>
    <section v-if="jobPost" class=" flex flex-col px-4 py-3">
        <div class="w-full flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
                <SupabaseImage class="rounded-full w-9 h-9" bucket="user-pictures"
                               :name="jobPost.creative_lead.profile_picture"/>
                <div class="flex flex-col">
                    <p class="text-size-XS text-[#3C3C3C]">director</p>
                    <p class="text-size-S font-medium">{{jobPost.creative_lead.first_name}} {{jobPost.creative_lead.last_name}}</p>
                </div>
            </div>
            <Icon icon="material-symbols:share-outline"/>
        </div>
        <div>
            <h1 class="text-size-XL font-semibold">{{ jobPost.looking_for + ' ' }}<span
                class="text-[#8D8D8D]">needed in </span></h1>
            <h1 class="text-size-XL font-semibold mb-1">{{ jobPost.place }}<span class="text-[#8D8D8D]"> on </span>{{ jobPost.date }}</h1>
            <div class="flex gap-3 pb-6 border-b">
                <div class="p-3">closes in {{getTimeRemaining(jobPost.closes_on)}} days</div>
                <div class="p-3">{{available}} slots left</div>
            </div>
        </div>
        <Label class="mt-3 mb-2" text="about the job"/>
        <p class="text-size-S text-[#616161] mb-2">{{jobPost.description}}</p>
        <div class="flex gap-1 text-size-XS mb-2 flex-wrap">
            <p class="px-3 py-2 border rounded-full" v-for="label of jobPost.labels">{{label}}</p>
        </div>
        <Label class="mb-2" text="requirements"/>
        <ul class="list-disc pl-4 text-[#616161] flex-col flex justify-center text-size-S">
            <li v-for="requirement of jobPost.requirements">{{requirement}}</li>
        </ul>
        <Label class="mt-6 mb-6" text="about the client"/>
        <div class="flex items-center gap-3 pb-3 border-b">
            <SupabaseImage class="rounded-full w-9 h-9" bucket="client-icons"
                           :name="jobPost.client.image"/>
            <div class="flex flex-col">
                <p class="text-size-XS text-[#3C3C3C]">director</p>
                <p class="text-size-S font-medium">{{jobPost.client.name}}</p>
            </div>
        </div>
        <div class="flex flex-col py-3 border-b">
            <p class="text-size-XS text-[#616161]">headquarters</p>
            <p class="text-size-S font-medium">{{jobPost.client.headquarters}}</p>
        </div>
        <div class="flex flex-col py-3 border-b">
            <p class="text-size-XS text-[#616161]">employees</p>
            <p class="text-size-S font-medium">{{jobPost.client.industry}}</p>
        </div>
        <div class="flex flex-col py-3 border-b">
            <p class="text-size-XS text-[#616161]">links</p>
            <div class="text-size-XS text-[#242424] flex items-center">
                <div class="flex gap-1 items-center py-2 px-3">
                    <Icon icon="material-symbols:language"/>
                    <a :href="jobPost.client.website" target="_blank">website</a>
                </div>
                <div class="flex gap-1 items-center py-2 px-3">
                    <Icon icon="mdi:instagram"/>
                    <a :href="jobPost.client.instagram" target="_blank">instagram</a>
                </div>
                <div class="flex gap-1 items-center py-2 px-3">
                    <Icon icon="line-md:youtube"/>
                    <a :href="jobPost.client.youtube" target="_blank">youtube</a>
                </div>
            </div>
        </div>
        <Label text="about the creative lead" class="mt-9 mb-3"/>
        <div class="w-full flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
                <SupabaseImage class="rounded-full w-9 h-9" bucket="user-pictures"
                               :name="jobPost.creative_lead.profile_picture"/>
                <div class="flex flex-col">
                    <p class="text-size-XS text-[#3C3C3C]">creative lead</p>
                    <p class="text-size-S font-medium">{{jobPost.creative_lead.first_name}} {{jobPost.creative_lead.last_name}}</p>
                </div>
            </div>
            <NuxtLink :to="`/profile/${jobPost.creative_lead.id}`" class="py-2 px-4 rounded-full bg-[#F8F8F8]">view profile</NuxtLink>
        </div>
    </section>
    <MobileNavigation v-if="jobPost && !applied">
        <div class="w-full h-full flex p-1 justify-between">
            <div class="h-full rounded-full text-left flex flex-col justify-center pl-6">
                <p class="text-size-S">€{{getPriceLabel()}}</p>
                <p class="text-size-XS text-[#3C3C3C]">gig</p>
            </div>
            <NuxtLink v-if="available > 0" :to="`/discovery/${jobPost.id}/apply`" class="h-full py-2 px-12 rounded-full bg-black text-white">apply</NuxtLink>
            <button v-else class="h-full py-2 px-12 rounded-full bg-black bg-opacity-80 text-white">job already full</button>
        </div>
    </MobileNavigation>
    <MobileNavigation v-if="jobPost && applied">
        <div class="w-full h-full flex p-1 justify-between">
            <div class="h-full rounded-full text-left flex flex-col justify-center pl-6">
                <p class="text-size-S">€{{getPriceLabel()}}</p>
                <p class="text-size-XS text-[#3C3C3C]">gig</p>
            </div>
            <button class="h-full py-2 px-6 rounded-full bg-[#D2ACB0] text-white">cancel application</button>
        </div>
    </MobileNavigation>
</template>