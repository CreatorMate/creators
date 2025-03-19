<script setup lang="ts">
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import {API} from "~/src/utils/API/API";
    import type {APIResponse} from "~/src/api/utils/HonoResponses";
    import ToggleButton from "~/src/components/Core/ToggleButton.vue";
    import {useSupabaseUser} from "#imports";
    import {Icon} from "@iconify/vue";
    import {onMounted} from "vue";

    const router = useRouter();
    const accountState = useAccountState();
    const user = useSupabaseUser();
    const isOn = ref(false);
</script>

<template>
    <section class="flex flex-col w-full">
        <div class="flex items-center justify-between w-full">
            <div class="flex gap-6">
                <div class="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center">{{accountState.user.first_name.charAt(0)}}{{accountState.user.last_name.charAt(0)}}</div>
                <div class="flex flex-col mt-4">
                    <p class="text-2xl">{{accountState.user?.first_name}} {{accountState.user?.last_name}}</p>
                    <div class="flex gap-2 text-black text-opacity-40">
                        <p class="text-lg" v-for="item of accountState.user?.project_types">{{item}},</p>
                    </div>
                    <div class="flex items-center gap-2 mt-4">
                        <Icon width="32" icon="material-symbols:location-on"/>
                        <p>{{accountState.user?.based_in}}</p>
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <button class="p-1 px-4 border rounded-full bg-black text-white">connect</button>
                <button class="p-1 px-4 border rounded-full">invite to job</button>
            </div>
        </div>
        <div class="flex">
            <div class="mt-12 gap-4 flex">
                <button class="p-1 px-4 border rounded-full bg-gray-200">Work</button>
                <button class="p-1 px-4 border rounded-full">About</button>
            </div>
        </div>
    </section>
    <Navigation/>
</template>
