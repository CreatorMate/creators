import type {RouterRoute} from "hono/dist/types/types";
import {context} from "esbuild";
import type {Context} from "hono";
import type {User} from "@supabase/auth-js";
import {usePrisma} from "~/src/api/src/lib/prisma";
import {Rights} from "~/src/utils/AuthGuard/Rights";

interface UserAccessInfo {
    roles: string[];
    rights: string[];
}

const adminAccessCache = new Map<string, UserAccessInfo>();
const ADMIN_CACHE_TTL = 300 * 1000; // 15 minutes (900 seconds)

export async function access_control(context: Context, route: RouterRoute): Promise<boolean> {
    if(!route) return true;

    const user = context.get('user') as User;

    //ensure local cache is loaded when the user retrieves his profile
    if(route.path == '/users/me') {
        const rolesAndRights = await getUserRolesAndRights(user.id, true);
        adminAccessCache.set(user.id, rolesAndRights);
    }

    const neededRight = authMap.get(`${route.path}.${route.method}`);

    if(!neededRight) return true;

    const userAccessInfo = await getUserRolesAndRights(user.id);

    return userAccessInfo.rights.includes(neededRight);
}

async function getUserRolesAndRights(userId: string, forceRefresh: boolean = false): Promise<UserAccessInfo> {
    if (adminAccessCache.has(userId) && !forceRefresh) {
        const cachedData = adminAccessCache.get(userId)!;
        return cachedData;
    }
    try {
        const user = await usePrisma().users.findUnique({
            where: {
                id: userId,
            },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                rights: {
                                    include: {
                                        right: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if(!user) return { roles: [], rights: [] };

        const roles = user.roles.map((userRole) => userRole.role.name);
        let rights = user.roles.flatMap((userRole) => {
            return userRole.role.rights.map((roleRight) => roleRight.right.name)
        });

        rights = [...new Set(rights)];

        const accessInfo: UserAccessInfo = { roles, rights };
        adminAccessCache.set(userId, accessInfo);

        setTimeout(() => {
            adminAccessCache.delete(userId);
        }, ADMIN_CACHE_TTL);

        return { roles, rights};
    } catch (error) {
        return { roles: [], rights: [] };
    }
}

const authMap = new Map<string, string>();
// authMap.set('/jobposts/:id.GET', Rights.HIRING);
authMap.set('/jobposts.POST', Rights.HIRING);