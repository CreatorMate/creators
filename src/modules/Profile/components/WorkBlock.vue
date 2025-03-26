<script setup lang='ts'>
    import type {Brand, User, WorkItem} from "~/src/utils/SupabaseTypes";
    import {Icon} from "@iconify/vue";
    import type {Ref} from "vue";
    import Label from "~/src/components/Core/Label.vue";
    import {API} from "~/src/utils/API/API";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import SupabaseImage from "~/src/components/Core/SupabaseImage.vue";

    const {user} = defineProps<{
        user: User
    }>();

    const workItems: Ref<WorkItem[]> = ref([]);

    onMounted(async () => {
       await loadItems();
    })

    async function loadItems() {
        workItems.value = [];
        const workItemsRequest: APIResponse<WorkItem[]> = await API.ask(`/work/${user.id}`);
        if(!workItemsRequest.success) return;

        workItems.value = workItemsRequest.data;
    }

    async function deleteItem(workItem: WorkItem) {
        await API.ask(`/work/${workItem.id}`, 'DELETE');
        await loadItems();
    }
</script>

<template>
    <div v-if="workItems.length > 0" class="grid grid-cols-2 gap-2">
        <div class="w-full mb-2 flex flex-col gap-1 relative" v-for="workItem of workItems">
            <SupabaseImage class="w-full h-[120px] object-cover rounded-lg" bucket="work-images" :name="workItem.image"/>
            <p class="text-size-S">{{workItem.title}}</p>
            <p class="text-size-XS text-[#616161]">{{workItem.job_title}}</p>
            <div class="absolute w-6 h-6 bg-white rounded-full text-black flex justify-center items-center top-1 right-1 z-10">
                <Icon @click="deleteItem(workItem)" icon="material-symbols:close"></Icon>
            </div>
        </div>
    </div>
    <div v-else class="mt-24 w-full flex items-center flex flex-col">
        <Label class="font-semibold" text="no media was uploaded..."/>
        <div class="flex items-center text-size-XS text-[#151515] gap-1">
            <p>upload work using the</p>
            <div class=" bg-black rounded-full flex items-center justify-center text-white w-8 h-8">
                <Icon icon="material-symbols:add-2"/>
            </div>
            <p>icon</p>
        </div>
    </div>

    <RouterLink to="/work/add" class="fixed z-50 bg-black rounded-full flex items-center justify-center text-white w-10 h-10 bottom-20 right-4">
        <Icon icon="material-symbols:add-2"/>
    </RouterLink>
</template>