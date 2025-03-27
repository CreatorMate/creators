import type BaseModule from "./utils/Modules/BaseModule";
import type {NuxtPage} from "@nuxt/schema";
import {OnboardingModule} from "./modules/Onboarding/OnboardingModule";
import {CoreModule} from "./modules/Core/CoreModule";
import {AuthModule} from "./modules/Auth/AuthModule";
import {ProfileModule} from "./modules/Profile/ProfileModule";
import {JobpostModule} from "./modules/Jobposts/JobpostModule";

const modules: BaseModule[] = [
    new OnboardingModule(),
    new CoreModule(),
    new AuthModule(),
    new ProfileModule(),
    new JobpostModule()
];
export function getModuleRoutes() {
    const routes: NuxtPage[] = [];
    for(const module of modules) {
        routes.push(...module.getModuleRoutes());
    }
    return routes;
}