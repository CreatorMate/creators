<script setup lang='ts'>
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import Sidebar from "~/src/components/Sidebar/Sidebar.vue";

    const accountState = useAccountState();
</script>

<template>
    <main v-if="accountState.user" class="text-background-text flex screen-size max-screen-size">
        <Sidebar/>
        <div class="p-12 flex flex-grow">
            <slot></slot>
        </div>

    </main>

</template>