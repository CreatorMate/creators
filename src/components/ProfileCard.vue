<script setup lang='ts'>
    import Label from "~/src/components/Core/Label.vue";
    import {Icon} from "@iconify/vue";
    import SupabaseImage from "~/src/components/Core/SupabaseImage.vue";

    const {name, role, link, image} = defineProps<{
        name: string,
        role: string[],
        link: string,
        image: string
    }>();

    const roles = ref('');
    roles.value = role.join(',');

</script>

<template>
    <NuxtLink :to="link" class="w-full border flex px-3 py-6 rounded-xl bg-[#FCFCFC] justify-between">
        <div class="flex items-center gap-3">
            <SupabaseImage class="rounded-full h-12 w-12 object-fill" bucket="user-pictures" :name="image"/>
            <div>
                <Label :text="name" class="font-medium"/>
                <p class="text-size-S text-[#3C3C3C]">{{roles}}</p>
            </div>
        </div>
        <Icon width="32" icon="material-symbols:arrow-insert" class="rotate-90"/>
    </NuxtLink>
</template>