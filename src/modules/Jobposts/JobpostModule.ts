import BaseModule from "../../utils/Modules/BaseModule";
import type {NuxtPage} from "@nuxt/schema";

export class JobpostModule extends BaseModule {
    protected moduleRoutes: NuxtPage[] = [
        {
            name: 'home',
            file: '@/src/modules/Jobposts/pages/Discovery.vue',
            path: '/'
        },
        {
            name: 'hire',
            file: '@/src/modules/Jobposts/pages/Hire.vue',
            path: '/hire'
        },
        {
            name: 'jobs',
            file: '@/src/modules/Jobposts/pages/JobsView.vue',
            path: '/jobs'
        },
        {
            name: 'discovery item',
            file: '@/src/modules/Jobposts/pages/DiscoveryItem.vue',
            path: '/discovery/:id'
        },
        {
            name: 'apply to job',
            file: '@/src/modules/Jobposts/pages/ApplyJobPostView.vue',
            path: '/discovery/:id/apply'
        }
    ]
}