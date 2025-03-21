import {Rights} from "~/src/utils/AuthGuard/Rights";

export const protectedRoutes = new Map<string, string>([
    ['/hire', Rights.HIRING]
]);
