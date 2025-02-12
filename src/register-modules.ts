import type BaseModule from "./utils/Modules/BaseModule";
import type {NuxtPage} from "@nuxt/schema";
import {OnboardingModule} from "./modules/Onboarding/OnboardingModule";
import {CoreModule} from "./modules/Core/CoreModule";
import {AuthModule} from "./modules/Auth/AuthModule";

const modules: BaseModule[] = [
    new OnboardingModule(),
    new CoreModule(),
    new AuthModule()
];
export function getModuleRoutes() {
    const routes: NuxtPage[] = [];
    for(const module of modules) {
        routes.push(...module.getModuleRoutes());
    }
    return routes;
}