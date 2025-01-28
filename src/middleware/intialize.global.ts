import type {RouteLocationNormalized} from "#vue-router";
import {useAccountStore} from "~/src/utils/Auth/AccountStore";
import {appSettings} from "~/src/GlobalSettings";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const accountStore = useAccountStore();
    const runtimeConfig = useRuntimeConfig();
    appSettings.baseUrl = runtimeConfig.public.BASE_URL;
    try {
        if(accountStore.user) return;
        await accountStore.initialize();
    } catch (error) {
        console.error('Failed to initialize session:', error);
    }
});