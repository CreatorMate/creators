<script setup lang="ts">
    import { useAccountState } from "~/src/utils/Auth/AccountState";
    import Sidebar from "~/src/components/Sidebar/Sidebar.vue";

    const accountState = useAccountState();
</script>

<template>
    <main
        v-if="accountState.user"
        class="flex flex-col xs:flex-row text-background-text screen-size max-screen-size overflow-x-hidden overflow-y-scroll relative"
    >
        <Sidebar class="hidden xs:flex" />
        <div class="flex flex-grow justify-center lowercase">
            <div class="max-w-[500px] max-h-full w-full  overflow-x-hidden">
                <div class="max-w-[500px] max-h-full w-full h-full overflow-x-hidden pb-20">
                    <slot></slot>
                </div>
            </div>
        </div>
    </main>
</template>

<!--<template>-->
<!--    <main-->
<!--        v-if="accountState.user"-->
<!--        class="flex flex-col xs:flex-row text-background-text screen-size max-screen-size overflow-x-hidden"-->
<!--    >-->
<!--        <Sidebar class="hidden xs:flex" />-->
<!--        <div class="flex xs:hidden w-full justify-center py-6 mb-3">-->
<!--            <NuxtImg src="/logo-light.svg"/>-->
<!--        </div>-->
<!--        <div class="flex flex-grow justify-center overflow-hidden">-->
<!--            <div class="max-w-[500px] max-h-full overflow-hidden w-full relative overflow-x-hidden h-full">-->
<!--                <div class="max-w-[500px] overflow-hidden max-h-full w-full h-full overflow-x-hidden px-4 py-3 ">-->
<!--                    <slot></slot>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </main>-->
<!--</template>-->
