import {Hono} from "hono";

import dotenv from 'dotenv';
import {initializeHonoRouter} from "~/src/api/router";
import createApp from "./src/lib/createApp";
import {serverSupabaseUser} from "#supabase/server";

let app: Hono = createApp();

initializeHonoRouter(app);
export default defineEventHandler(async (event) => {
    try {
        const user = await serverSupabaseUser(event);
        if(!user) {
            throw createError({ // Use createError
                statusCode: 401,
                statusMessage: 'Unauthorized',
            });
        }
        event.node.req.originalUrl = '';
        const webReq = toWebRequest(event);
        (webReq as any)['user'] = user;
        return app.fetch(webReq);
    } catch (error) {
        throw createError({ // Use createError
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }
});
