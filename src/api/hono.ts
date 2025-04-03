import {Hono} from "hono";

import {initializeHonoRouter} from "~/src/api/router";
import createApp from "./src/lib/createApp";
import {serverSupabaseClient, serverSupabaseUser} from "#supabase/server";
import SupabaseServer from "~/src/api/utils/supabaseServerClient";

let app: Hono = createApp();

initializeHonoRouter(app);

const publicRoutes = [
    { method: 'GET', path: '/jobposts' },
    { method: 'GET', path: '/jobposts/:id' },
    { method: 'GET', path: '/profiles/:handle' },
    { method: 'GET', path: '/work/:id'}
];

export default defineEventHandler(async (event) => {
    try {
        event.node.req.originalUrl = '';
        const webReq = toWebRequest(event);
        if (event.path.startsWith('/webhook')) {
            return app.fetch(webReq);
        }
        const isUnprotected = publicRoutes.some(route => {
            const methodMatch = event.method === route.method;
            // Allow for query parameters after the :id part
            const pathMatch = new RegExp(`^${route.path.replace(/:[^/]+/g, '([^/]+)')}(\\?.*)?$`).test(event.path);
            return methodMatch && pathMatch;
        });

        if (isUnprotected) {
            return app.fetch(webReq); // Skip authentication
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
