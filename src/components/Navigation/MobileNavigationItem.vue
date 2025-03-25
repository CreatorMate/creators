<script setup lang='ts'>
    import {Icon} from "@iconify/vue";
    import {onMounted} from "vue";
    import {useAccountState} from "~/src/utils/Auth/AccountState";

    const {name, iconName, linkTo} = defineProps<{
        name: string,
        iconName: string,
        linkTo: string,
    }>();
    const route = useRoute();

    const accountState = useAccountState();

    const isHoveringParent = ref(false)
    const show = ref(false)
    function isActive(path: string) {
        return route.fullPath === path
    }

</script>

<template>
    <NuxtLink :to="linkTo" @mouseenter="isHoveringParent = true" @mouseleave="isHoveringParent = false" :class="{
        'bg-[#F8F8F8]' : isActive(linkTo)
    }" @click="show = !show" class="flex text-black items-center cursor-pointer py-2 px-6 hover:bg-[#E9E9E9] rounded-full">
        <div class="flex items-center gap-3 transition duration-100 font-medium">
            <Icon class="text-[#3C3C3C]" width="24" :icon="iconName"/>
            <p v-if="isActive(linkTo)" class="text-sm">{{name}}</p>
        </div>
    </NuxtLink>
</template>