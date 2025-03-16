import type {Context, Hono} from "hono";
import {usePrisma} from "~/src/api/src/lib/prisma";
import type {HonoUser} from "~/src/api/utils/HonoComposables";

export abstract class BaseController {
    protected app: Hono;
    constructor(app: Hono) {
        this.app = app;
    }

    getPrisma() {
        return usePrisma();
    }

    protected getHonoUser(ctx: Context): HonoUser {
        return ctx.get('user');
    }

    abstract endpoints(): Promise<any>
}