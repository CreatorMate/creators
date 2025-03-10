<script setup lang="ts">
    import '~/src/assets/css/tailwind.css'
    import ToastArea from "~/src/utils/Toast/ToastArea.vue";
    import {checkUnguarded} from "~/src/utils/GuardChecker";
    import {appSettings} from "~/src/GlobalSettings";
    import {useAccountState} from "~/src/utils/Auth/AccountState";
    import {AccountStatus} from "~/src/utils/SupabaseTypes";
    const colorMode = useColorMode();
    const runtimeConfig = useRuntimeConfig();
    const accountStore = useAccountState();

    const route = useRoute();

    const ready = ref(false);

    //initial page load middleware, the actual middleware runs after page load, problem with that the user can see a flash of the wrong page.
    onBeforeMount(async () => {
        if (checkUnguarded(route.path)) {
            ready.value = true;
            return;
        }
        appSettings.baseUrl = runtimeConfig.public.BASE_URL;

        const {login, loggedIn} = useOidcAuth();
        if(!loggedIn.value) {
            ready.value = true;
            return navigateTo('/login');
        }

        const accountStore = useAccountState();
        if(!accountStore.user) {
            await accountStore.initialize();
        }

        if(accountStore.user) {
            if((accountStore.creator?.status == AccountStatus.NEW || accountStore.creator?.status == AccountStatus.IN_REVIEW)  && (route.path !== '/submission/status' && route.path !== '/apply' && route.path !== '/oauth/link-instagram')) {
                ready.value = true;
                return navigateTo('/submission/status');
            }
            if((accountStore.creator?.status== AccountStatus.ACCEPTED || accountStore.creator?.status== AccountStatus.INVITED)  && (route.path !== '/submission/status' && route.path !== '/apply' && route.path !== '/oauth/link-instagram' ) && !accountStore.instagramAccount) {
                ready.value = true;
                return navigateTo('/submission/status');
            }
        }
        ready.value = true;
    });
</script>

<template>
    <NuxtLayout v-if="ready">
        <NuxtPage/>
    </NuxtLayout>
    <ToastArea></ToastArea>
</template>
