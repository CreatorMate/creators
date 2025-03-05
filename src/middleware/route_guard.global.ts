import type {RouteLocationNormalized} from "#vue-router";
import {checkUnguarded} from "~/src/utils/GuardChecker";
import {useAccountState} from "~/src/utils/Auth/AccountState";
import {AccountStatus} from "~/src/utils/SupabaseTypes";
import {appSettings} from "~/src/GlobalSettings";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (checkUnguarded(to)) return;
    const runtimeConfig = useRuntimeConfig();
    appSettings.baseUrl = runtimeConfig.public.BASE_URL;

    const {login, loggedIn} = useOidcAuth();
    if(!loggedIn.value) {
        return navigateTo('/login');
    }

    const accountStore = useAccountState();
    if(!accountStore.user) {
        await accountStore.initialize();
    }
    if(accountStore.user) {
        if((accountStore.creator?.status == AccountStatus.NEW || accountStore.creator?.status == AccountStatus.IN_REVIEW)  && (to.path !== '/submission/status' && to.path !== '/apply' && to.path !== '/oauth/link-instagram')) {
            return navigateTo('/submission/status');
        }
        if((accountStore.creator?.status== AccountStatus.ACCEPTED || accountStore.creator?.status== AccountStatus.INVITED)  && (to.path !== '/submission/status' && to.path !== '/apply' && to.path !== '/oauth/link-instagram' ) && !accountStore.instagramAccount) {
            return navigateTo('/submission/status');
        }
    }
});