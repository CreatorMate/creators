<script setup lang='ts'>

    import {Icon} from "@iconify/vue";
    import {API} from "~/src/utils/API/API";
    import {useAccountState} from "~/src/utils/Auth/AccountState";

    const title = ref('');
    const description = ref('');
    const looking_for = ref('');
    const date = ref('');
    const place = ref('');
    const loading = ref(false);
    const accountState = useAccountState();

    const emits = defineEmits(['close', 'update']);

    const alreadyExist = ref(false);

    async function addJobPost() {
        loading.value = true;
        const project = await API.ask(`/jobposts`, 'POST', {
            title: title.value,
            description: description.value,
            looking_for: looking_for.value,
            date: date.value,
            place: place.value,
            posted_by: accountState.user?.id
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
    <div class="bg-white w-[500px] rounded-3xl p-6 popup ">
        <div class="w-full flex justify-between items-center">
            <h1 class="font-semibold text-3xl">post a job</h1>
            <Icon @click="emits('close')" class="cursor-pointer" icon="material-symbols:close"/>
        </div>

        <div class="w-full mt-3">
            <p>name</p>
            <input type="text" v-model="title" class="w-full bg-[#FCFCFC] p-2 mt-2 border">
        </div>
        <div class="w-full mt-3">
            <p>looking_for</p>
            <input type="text" v-model="looking_for" class="w-full bg-[#FCFCFC] p-2 mt-2 border">
        </div>
        <div class="w-full mt-3">
            <p>date</p>
            <input type="text" v-model="date" class="w-full bg-[#FCFCFC] p-2 mt-2 border">
        </div>
        <div class="w-full mt-3">
            <p>place</p>
            <input type="text" v-model="place" class="w-full bg-[#FCFCFC] p-2 mt-2 border">
        </div>
        <div class="w-full mt-3">
            <p>description</p>
            <input type="text" v-model="description" class="w-full bg-[#FCFCFC] p-2 mt-2 border">
        </div>
        <div class="mt-3">

        </div>
        <div class="flex justify-end gap-2 items-center mt-6">
            <button v-if="!loading" @click="addJobPost()" class="flex gap-2 items-center p-2 rounded bg-black text-white">
                <Icon class="cursor-pointer" icon="material-symbols:add"/>
                create
            </button>
            <button disabled v-if="loading" class="flex gap-2 items-center p-2 rounded bg-black text-white">
                <Icon class="cursor-pointer" icon="line-md:loading-loop"/>
                create
            </button>
        </div>
    </div>
</template>