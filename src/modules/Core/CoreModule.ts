import BaseModule from "../../utils/Modules/BaseModule";
import type {NuxtPage} from "@nuxt/schema";

export class CoreModule extends BaseModule {
    protected moduleRoutes: NuxtPage[] = [
        {
            name: 'home',
            file: '@/src/modules/Core/pages/DashboardView.vue',
            path: '/'
        },
        {
            name: 'hire',
            file: '@/src/modules/Core/pages/Hire.vue',
            path: '/hire'
        },
        {
            name: "settings",
            file: '@/src/modules/Core/pages/Settings.vue',
            path: "/settings", // This catches all undefined routes
        },
        {
            name: "error-404",
            file: '@/src/modules/Core/pages/Error404.vue',
            path: "/:catchAll(.*)*", // This catches all undefined routes
        },
    ]
}