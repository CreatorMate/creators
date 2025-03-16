<script setup lang='ts'>

    import {Icon} from "@iconify/vue";
    import {API} from "~/src/utils/API/API";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import {load} from "yaml-ast-parser";

    const {jobPost} = defineProps<{
        jobPost: { title: string, id: number, looking_for: string, place: string, date: string, description: string, job_applications: any[]}
    }>();

    const application = ref('');
    const comparibleWork = ref('');

    const loading = ref(false);
    const accountState = useAccountState();

    const emits = defineEmits(['close', 'update']);

    const alreadyExist = ref(false);

    async function addJobPost() {
        loading.value = true;
        const project = await API.ask(`/jobposts/${jobPost.id}/submit`, 'POST', {
            job_post: jobPost.id,
            user_id: accountState.user?.id,
            application: application.value,
            portfolio: comparibleWork.value
        });
        loading.value = false;

        if(!project.success) {
            if(project.error === 'PROJECT_ALREADY_EXISTS') alreadyExist.value = true;
            return;
        }

        alreadyExist.value = false;
        emits('update');
    }

</script>

<template>
    <div class="bg-white w-[60vw] rounded-3xl p-6 popup ">
        <div class="w-full flex justify-between items-center">
            <h1 class="font-semibold text-3xl text-black ">
                {{jobPost.looking_for}}
                <span class="text-black text-opacity-40"> needed for a </span>
                {{jobPost.title}}
                <span class="text-black text-opacity-40"> in </span>
                {{jobPost.place}}
                <span class="text-black text-opacity-40"> in </span>
                {{jobPost.date}}
            </h1>
            <Icon @click="emits('close')" class="cursor-pointer" icon="material-symbols:close"/>
        </div>
        <div class="w-full mt-3">
            <p class="text-xl text-black text-opacity-60">applications</p>
            <div class="flex justify-between items-center mt-4" v-for="jobApplicant of jobPost.job_applications">
                <p>{{jobApplicant.users.first_name}} {{jobApplicant.users.last_name}}</p>
                <NuxtLink :to="`/profile/${jobApplicant.user_id}`" class="p-1 px-4 border text-white bg-black rounded-full ">view profile</NuxtLink>
            </div>
        </div>
    </div>
</template>