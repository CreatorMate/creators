import type {RouteLocationNormalized} from "#vue-router";
import {checkUnguarded} from "~/src/utils/GuardChecker";
import {useAccountStore} from "~/src/utils/Auth/AccountStore";
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

    const accountStore = useAccountStore();
    if(!accountStore.user) {
        await accountStore.initialize();
    }
    if(accountStore.user) {
        if((accountStore.user.status == AccountStatus.NEW || accountStore.user.status == AccountStatus.IN_REVIEW)  && (to.path !== '/submission/status' && to.path !== '/apply' )) {
            return navigateTo('/submission/status');
        }
        if((accountStore.user.status == AccountStatus.ACCEPTED || accountStore.user.status == AccountStatus.INVITED)  && (to.path !== '/submission/status' && to.path !== '/apply' ) && !accountStore.user.linked) {
            return navigateTo('/submission/status');
        }
    }
});