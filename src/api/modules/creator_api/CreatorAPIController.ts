import type {Context, Hono} from "hono";
import {errorResponse, inheritResponse, successResponse} from "~/src/api/utils/HonoResponses";
import {CreatorAPI} from "~/src/api/utils/CreatorAPI/CreatorAPI";
import {context} from "esbuild";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {BaseController} from "~/src/api/utils/BaseController";

export class CreatorAPIController extends BaseController {
    async endpoints() {
        this.app.all('/creator_api/*', async (context: Context): Promise<any> => {
            let path = context.req.path.replace('/creator_api', '');
            const url = new URL(context.req.url);
            const queryParams = url.search;
            path = path + queryParams;

            let body = {};
            const method = context.req.method as 'GET' | 'POST' | 'PUT' | 'DELETE';

            if (method == 'POST' || method == 'PUT') {
                body = await context.req.json();
            }

            const localUser: HonoUser = this.getHonoUser(context);
            const user = await this.getPrisma().users.findFirst({
                where: {external_id: localUser.sub, email: localUser.email},
                include: {brands: true}
            });

            if (user && user.brands) {
                path = path.replace('brand_id', user.brands.id.toString())
                path = path.replace('user_id', user.id)
            }

            const request = await CreatorAPI.ask(path, method, body);

            return inheritResponse(context, request.response, request.code);
        });
    }
}