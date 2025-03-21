import type {Context, Hono} from "hono";
import {usePrisma} from "~/src/api/src/lib/prisma";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import type {User} from "@supabase/auth-js";

export abstract class BaseController {
    protected app: Hono;
    constructor(app: Hono) {
        this.app = app;
    }

    getPrisma() {
        return usePrisma();
    }

    protected getHonoUser(ctx: Context): User {
        return ctx.get('user');
    }

    abstract endpoints(): Promise<any>
}