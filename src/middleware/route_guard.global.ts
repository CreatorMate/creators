import type {RouteLocationNormalized} from "#vue-router";
import {checkUnguarded} from "~/src/utils/AuthGuard/GuardChecker";
import {useAccountState} from "~/src/utils/Auth/AccountState";
import {AccountStatus} from "~/src/utils/SupabaseTypes";
import {appSettings} from "~/src/GlobalSettings";
import {protectedRoutes} from "~/src/utils/AuthGuard/ProtectedRoutes";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (checkUnguarded(to.path)) return;
    const runtimeConfig = useRuntimeConfig();
    appSettings.baseUrl = runtimeConfig.public.BASE_URL;

    const accountStore = useAccountState();
    if(!accountStore.user) {
        await accountStore.initialize();
    }
    if(accountStore.user) {
        if((accountStore.user.status == AccountStatus.NEW || accountStore.user.status == AccountStatus.IN_REVIEW)  && (to.path !== '/submission/status' && to.path !== '/apply')) {
            return navigateTo('/submission/status');
        }
        if(protectedRoutes.has(to.path) && !accountStore.rights.includes(protectedRoutes.get(to.path) as string)) {
            return navigateTo('/');
        }
    }
});