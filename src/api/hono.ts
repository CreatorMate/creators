import {Hono} from "hono";

import {initializeHonoRouter} from "~/src/api/router";
import createApp from "./src/lib/createApp";
import {serverSupabaseClient, serverSupabaseUser} from "#supabase/server";
import SupabaseServer from "~/src/api/utils/supabaseServerClient";

let app: Hono = createApp();

initializeHonoRouter(app);
export default defineEventHandler(async (event) => {
    try {
        event.node.req.originalUrl = '';
        const webReq = toWebRequest(event);
        if (event.path.startsWith('/webhook')) {
            return app.fetch(webReq);
        }

        const user = await serverSupabaseUser(event);
        if(!user) {
            throw createError({ // Use createError
                statusCode: 401,
                statusMessage: 'Unauthorized',
            });
        }

        SupabaseServer.assign(user.id, await serverSupabaseClient(event));

        (webReq as any)['user'] = user;
        return app.fetch(webReq);
    } catch (error) {
        throw createError({ // Use createError
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: ''
        });
    }
});
