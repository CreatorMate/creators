import type BaseModule from "./utils/Modules/BaseModule";
import type {NuxtPage} from "@nuxt/schema";

const modules: BaseModule[] = [
];
export function getModuleRoutes() {
    const routes: NuxtPage[] = [];
    for(const module of modules) {
        routes.push(...module.getModuleRoutes());
    }

    return routes;
}