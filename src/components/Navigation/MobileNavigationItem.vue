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
        'text-[#3C3C3C]' : isActive(linkTo), 'text-[#D6D6D6]': !isActive(linkTo)
    }" @click="show = !show" class="flex items-center cursor-pointer py-2 px-6 rounded-full ">
        <div class="flex items-center gap-3 transition duration-100 font-medium">
            <Icon class="" width="24" :icon="iconName"/>
        </div>
    </NuxtLink>
</template>