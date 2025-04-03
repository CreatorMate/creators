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
            name: 'profile/:handle',
            file: '@/src/modules/Profile/pages/Profile.vue',
            path: '/profile/:handle',
            meta: {
                layout: 'public',
            }
        },
        {
            name: 'work/add',
            file: '@/src/modules/Profile/pages/AddWork.vue',
            path: '/work/add'
        },
    ]
}