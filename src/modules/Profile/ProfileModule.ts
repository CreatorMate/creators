import BaseModule from "../../utils/Modules/BaseModule";
import type {NuxtPage} from "@nuxt/schema";

export class ProfileModule extends BaseModule {
    protected moduleRoutes: NuxtPage[] = [
        {
            name: 'profile',
            file: '@/src/modules/Profile/pages/Profile.vue',
            path: '/profile'
        },
        {
            name: 'profile/:id',
            file: '@/src/modules/Profile/pages/Profile.vue',
            path: '/profile/:id'
        },
    ]
}