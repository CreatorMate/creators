<script setup lang='ts'>
    import type {Brand, User} from "~/src/utils/SupabaseTypes";
    import Label from "~/src/components/Core/Label.vue";
    import {Icon} from "@iconify/vue";
    import ContactItem from "~/src/modules/Profile/components/ContactItem.vue";

    const {user, editable} = defineProps<{
        user: User,
        editable: boolean
    }>();
</script>

<template>
    <div class="flex flex-col gap-1">
        <div class="flex w-full justify-between items-center">
            <Label text="about me"/>
            <Icon v-if="editable" width="20" class="text-[#8D8D8D]" icon="material-symbols:edit-square-outline"></Icon>
        </div>
        <p class="text-size-M text-[#616161] font-medium mt-1 mb-6">I’m a young and innovative filmmaker based in Amsterdam, driven by a passion for crafting compelling visuals that tell stories and create impact. I specialise in dynamic video production, delivering branding and commercial videos that resonate with audiences and elevate brands.</p>
        <div class="divider"></div>
        <div class="flex w-full justify-between items-center mt-6">
            <Label text="clients"/>
            <Icon v-if="editable" width="20" class="text-[#8D8D8D]" icon="material-symbols:edit-square-outline"></Icon>
        </div>
        <div class="flex gap-1 flex-wrap mt-1 mb-6">
            <div class="py-1 pl-1 pr-3 rounded-full bg-[#F8F8F8] text-size-XS flex items-center gap-3">
                <NuxtImg class="rounded-full w-9 h-9 object-cover" src="/icons/sony.webp"/>
                <p>sony</p>
            </div>
            <div class="py-1 pl-1 pr-3 rounded-full bg-[#F8F8F8] text-size-XS flex items-center gap-3">
                <NuxtImg class="rounded-full w-9 h-9 object-cover" src="/icons/nrc.png"/>
                <p>nrc</p>
            </div>
            <div class="py-1 pl-1 pr-3 rounded-full bg-[#F8F8F8] text-size-XS flex items-center gap-3">
                <NuxtImg class="rounded-full w-9 h-9 object-cover" src="/icons/otrium.png"/>
                <p>otrium</p>
            </div>
        </div>
        <div class="divider"></div>
        <div class="flex w-full justify-between items-center mt-6">
            <Label text="skills"/>
            <Icon v-if="editable" width="20" class="text-[#8D8D8D]" icon="material-symbols:edit-square-outline"></Icon>
        </div>
        <div class="flex gap-1 flex-wrap mt-1">
            <p class="py-2 px-3 rounded-full bg-[#F8F8F8] text-size-XS">filmmaking</p>
            <p class="py-2 px-3 rounded-full bg-[#F8F8F8] text-size-XS">photography</p>
            <p class="py-2 px-3 rounded-full bg-[#F8F8F8] text-size-XS">premiere pro</p>
        </div>
    </div>
</template>

<style scoped>
.divider {
    @apply w-full my-3 h-[1px] bg-[#F1F1F1]
}
</style>