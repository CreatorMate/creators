import type {RouteLocationNormalized} from "#vue-router";
import {appSettings} from "~/src/GlobalSettings";

export function checkUnguarded(to: string) {
    return appSettings.unGuardedRoutes.some((routePattern: string | RegExp) => {
        if (routePattern instanceof RegExp) {
            return routePattern.test(to);
        }

        return routePattern === to;
    })
}