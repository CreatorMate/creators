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
            const {role} = context.req.query();

            const filters: { looking_for?: { in: string[] } } = {};

            if(role) {
                const roles = (role as string).split(',');
                filters.looking_for = { in: roles };
            }
            const jobPosts = await usePrisma().job_postings.findMany({
                include: {
                    creative_lead: true
                },
                where: {
                    active: true,
                    ...filters
                }
            });

            if(!jobPosts) return errorResponse(context, 'something_went_wrong');

            return successResponse(context, jobPosts);
        });

        this.app.get('/jobposts/:id', async (context: Context): Promise<any> => {
            const id = context.req.param('id') as string;
            const jobPost = await usePrisma().job_postings.findFirst({
                where: {id: Number(id)},
                include: {
                    creative_lead: true,
                    client: true,
                    job_applications: {
                        include: {
                            users: true
                        }
                    }
                }
            });

            if(!jobPost) return errorResponse(context, 'something_went_wrong');

            return successResponse(context, jobPost);
        });

        this.app.get('/profiles/:id', async (context: Context): Promise<any> => {
            const id = context.req.param('id') as string;
            const user = await usePrisma().users.findUnique({
                where: {id: id}
            });

            if(!user) return errorResponse(context, 'something_went_wrong');

            return successResponse(context, user);
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

        this.app.post('/jobposts/:id/submit', async (context: Context): Promise<any> => {
            const data = await context.req.json();
            const id = context.req.param('id') as string;
            //@ts-ignore
            const added = await usePrisma().job_applications.create({
                data: {
                    ...data
                }
            });
            if (!added) {
                return errorResponse(context, "Something went wrong while updating the creator");
            }

            return successResponse(context, added, 'applied to job post', 'applied to job post');
        });
    }
}