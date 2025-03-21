import {type Context, Hono, type Next} from "hono";
import dotenv from "dotenv";
import {logger} from "hono/logger";
import NotFound from "~/src/api/src/middleware/NotFound";
import onError from "~/src/api/src/middleware/OnError";
import {access_control} from "~/src/api/access_control";
import {errorResponse} from "~/src/api/utils/HonoResponses";

export default function createApp(): Hono {
    let app: Hono = new Hono();
    dotenv.config();

    app.use('*', logger());

    app.notFound(NotFound);
    app.onError(onError);

    app.use('*', async (ctx, next) => {
        // @ts-ignore
        const user = ctx.req.raw['user'];
        // @ts-ignore
        ctx.set('user', user);
        await next();
    });

    app.use('*', async (context: Context, next: Next) => {
        const hasAccess = await access_control(context, context.req.matchedRoutes[context.req.matchedRoutes.length-1]);
        if (!hasAccess) {
            return errorResponse(context, 'Unauthorized', '', 401);
        }

        await next();
    });

    return app;
}