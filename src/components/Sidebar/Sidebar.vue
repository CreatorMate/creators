<script setup lang='ts'>
    import NavButton from "~/src/components/Sidebar/NavButton.vue";
    import {useAccountState} from "~/src/utils/Auth/AccountState";

    const accountState = useAccountState();

</script>

<template>
    <aside class="h-full min-w-[200px] w-[200px] max-h-screen flex flex-col overflow-auto border-r">
        <div class="flex mt-8 ml-4 gap-2">
            <NuxtImg class="mt-1" width="48" src="/logo-light.svg"/>
            <p class="text-xs">ALPHA</p>
        </div>

        <nav class="mt-7 flex flex-col flex-grow">
            <NavButton :premium="false" link-to="/"
                       name="find work" icon-name="material-symbols:work-outline"/>
            <NavButton :premium="false" link-to="/hire"
                       name="hire" icon-name="material-symbols:add-notes-outline-sharp"/>
            <NavButton :premium="false" link-to="/content"
                       name="discover" icon-name="material-symbols:animated-images-outline"/>
            <div class="mt-auto flex flex-col gap-3">
                <NavButton :premium="false" link-to="/settings" name="settings" icon-name="uil:cog" :children="[]"/>
                <NavButton :premium="false" link-to="/profile" name="My profile" icon-name="material-symbols:supervised-user-circle" :children="[]"/>
                <LazySidebarSbUserSession/>
            </div>
        </nav>
    </aside>
</template>