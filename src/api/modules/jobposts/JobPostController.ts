import type {Context, Hono} from "hono";
import {errorResponse, inheritResponse, successResponse} from "~/src/api/utils/HonoResponses";
import {CreatorAPI} from "~/src/api/utils/CreatorAPI/CreatorAPI";
import {context} from "esbuild";
import {BaseController} from "~/src/api/utils/BaseController";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {usePrisma} from "~/src/api/src/lib/prisma";

export class JobPostController extends BaseController {
    async endpoints() {
        this.app.get('/jobposts', async (context: Context): Promise<any> => {
            const jobPosts = await usePrisma().job_postings.findMany();

            if(!jobPosts) return errorResponse(context, 'something_went_wrong');

            return successResponse(context, {job_posts: jobPosts});
        });

        this.app.get('/jobposts/:id', async (context: Context): Promise<any> => {
            const id = context.req.param('id') as string;
            const jobPosts = await usePrisma().job_postings.findMany({
                where: {posted_by: id}
            });

            if(!jobPosts) return errorResponse(context, 'something_went_wrong');

            return successResponse(context, {job_posts: jobPosts});
        });

        this.app.post('/jobposts', async (context: Context): Promise<any> => {
            const data = await context.req.json();
            //@ts-ignore
            const added = await usePrisma().job_postings.create({
                data: {
                    ...data
                }
            });
            if (!added) {
                return errorResponse(context, "Something went wrong while updating the creator");
            }

            return successResponse(context, added);
        });
    }
}