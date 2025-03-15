<script setup lang='ts'>

    import {Icon} from "@iconify/vue";
    import {API} from "~/src/utils/API/API";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import {load} from "yaml-ast-parser";

    const {jobPost} = defineProps<{
        jobPost: { title: string, id: number, looking_for: string, place: string, date: string, description: string}
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
        <p>{{jobPost.description}}</p>
        <div class="w-full mt-3">
            <p>application</p>
            <textarea type="text" v-model="application" class="w-full bg-[#FCFCFC] p-2 mt-2 border h-40"></textarea>
        </div>
        <div class="w-full mt-3">
            <p>comparible work</p>
            <textarea type="text" v-model="comparibleWork" class="w-full bg-[#FCFCFC] p-2 mt-2 border h-40"></textarea>
        </div>

        <div class="flex justify-end gap-2 items-center mt-6">
            <button v-if="!loading" @click="addJobPost()" class="flex gap-2 items-center p-2 rounded-full bg-black text-white">
                submit application
            </button>
            <button disabled v-if="loading" class="flex gap-2 items-center p-2 rounded-full bg-black text-white">
                <Icon class="cursor-pointer" icon="line-md:loading-loop"/>
                create
            </button>
        </div>
    </div>
</template>