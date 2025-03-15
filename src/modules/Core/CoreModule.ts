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
            name: 'profile',
            file: '@/src/modules/Core/pages/Profile.vue',
            path: '/profile'
        },
        {
            name: 'profile/:id',
            file: '@/src/modules/Core/pages/UserProfile.vue',
            path: '/profile/:id'
        },
        {
            name: 'hire',
            file: '@/src/modules/Core/pages/Hire.vue',
            path: '/hire'
        },
    ]
}