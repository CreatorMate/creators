import {Hono} from "hono";
import dotenv from "dotenv";
import {logger} from "hono/logger";
import NotFound from "~/src/api/src/middleware/NotFound";
import onError from "~/src/api/src/middleware/OnError";

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

    return app;
}