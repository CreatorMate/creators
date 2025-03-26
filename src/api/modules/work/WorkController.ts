import type {Context, Hono} from "hono";
import {errorResponse, inheritResponse, successResponse} from "~/src/api/utils/HonoResponses";
import {CreatorAPI} from "~/src/api/utils/CreatorAPI/CreatorAPI";
import {context} from "esbuild";
import {BaseController} from "~/src/api/utils/BaseController";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {usePrisma} from "~/src/api/src/lib/prisma";
import {serverSupabaseClient} from "#supabase/server";
import SupabaseServer from "~/src/api/utils/supabaseServerClient";

export class WorkController extends BaseController {
    config = useRuntimeConfig();
    async endpoints() {
        this.app.get('/work/:id',  async (context: Context): Promise<any> => {
            const id = context.req.param('id');

            const workItems = await this.getPrisma().work_items.findMany({
                where: {user_id: id}
            });

            return successResponse(context, workItems ?? []);
        });

        this.app.post('/work',  async (context: Context): Promise<any> => {
            const user = this.getHonoUser(context);
            const {title, job_title, image, link_to} = await context.req.json();

            const addWorkItemRequest = await this.getPrisma().work_items.create({
                data: {
                    user_id: user.id,
                    title,
                    job_title,
                    image,
                    link_to
                },
            });

            if(!addWorkItemRequest) return errorResponse(context, 'something went wrong');

            return successResponse(context, addWorkItemRequest);
        });

        this.app.delete('/work/:id',  async (context: Context): Promise<any> => {
            const user = this.getHonoUser(context);
            const id = context.req.param('id');

            const fetchToDeleteItem = await this.getPrisma().work_items.findFirst({
                where: {id: Number(id), user_id: user.id}
            });

            if(!fetchToDeleteItem) return errorResponse(context, 'ITEM_NOT_FOUND');

            const client = SupabaseServer.getClient(user.id);

            if(!client) return errorResponse(context, 'SUPABASE_NOT_FOUND');

            await client.storage.from('work-images').remove([fetchToDeleteItem.image])

            const deleteRequest = await this.getPrisma().work_items.delete({
                where: {id: Number(id), user_id: user.id}
            });

            if(!deleteRequest) return errorResponse(context, 'something went wrong');

            return successResponse(context, deleteRequest);
        });
    }
}