<script setup lang='ts'>
    import type {Brand, User} from "~/src/utils/SupabaseTypes";
    import {Icon} from "@iconify/vue";
    import type {Ref} from "vue";
    import Label from "~/src/components/Core/Label.vue";

    const {user} = defineProps<{
        user: User
    }>();

    type WorkBlock = {
        role: string,
        title: string,
        image: string
    }

    const work: Ref<WorkBlock[]> = ref([

    ]);

    function add() {
        work.value.push({
            title: 'tanzania',
            role: 'filmmaker',
            image: '/icons/work.png'
        });
    }
</script>

<template>
    <div v-if="work.length > 0" class="grid grid-cols-2 gap-2">
        <div class="w-full mb-2 flex flex-col gap-1" v-for="workItem of work">
            <NuxtImg class="w-full h-[120px] object-cover rounded-lg" :src="workItem.image"></NuxtImg>
            <p class="text-size-S">{{workItem.title}}</p>
            <p class="text-size-XS text-[#616161]">{{workItem.role}}</p>
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

    <div @click="add" class="fixed z-50 bg-black rounded-full flex items-center justify-center text-white w-10 h-10 bottom-20 right-4">
        <Icon icon="material-symbols:add-2"/>
    </div>
</template>