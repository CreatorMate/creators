<script setup lang='ts'>
    import {Icon} from "@iconify/vue";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    const accountState = useAccountState();
</script>

<template>
    <div class="bg-background-foreground rounded-t-xl p-2 flex justify-between items-center text-text-light border-[#E2E2E2]">
        <div class="flex gap-4 items-center">
            <nuxt-img  class="rounded-xl w-12 h-12" src="/apple-touch-icon.png"></nuxt-img>
            <div class="flex flex-col">
                <p class="text-sm text-text-dark lowercase">{{accountState.user.first_name}} {{accountState.user.last_name}}</p>
            </div>
        </div>
        <Icon size="20" class="mr-4 hover:text-black cursor-pointer transition duration-100 text-gray-950" @click="accountState.logout()" icon="material-symbols:logout"></Icon>
    </div>
</template>