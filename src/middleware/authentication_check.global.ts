import type {RouteLocationNormalized} from "#vue-router";
import {checkUnguarded} from "~/src/utils/GuardChecker";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (checkUnguarded(to)) return;
    const {login, loggedIn} = useOidcAuth();
    if(!loggedIn.value) {
        await login();
    }
});