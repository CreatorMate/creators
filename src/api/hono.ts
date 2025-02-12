import {Hono} from "hono";

//@ts-ignore
import {getUserSession} from 'nuxt-oidc-auth/runtime/server/utils/session.js'
import dotenv from 'dotenv';
import {initializeHonoRouter} from "~/src/api/router";
import createApp from "./src/lib/createApp";

let app: Hono = createApp();

initializeHonoRouter(app);
export default defineEventHandler(async (event) => {
    event.node.req.originalUrl = '';
    const webReq = toWebRequest(event);
    const session = await getUserSession(event);
    (webReq as any)['user'] = session.userInfo;
    return app.fetch(webReq);
});
