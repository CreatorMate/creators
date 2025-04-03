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
            const {role, archived} = context.req.query();

            const filters: {
                looking_for?: { in: string[] },
                closes_on?: any;
            } = {};

            if(role) {
                const roles = (role as string).split(',');
                filters.looking_for = { in: roles };
            }

            if (archived === 'true') {
                filters.closes_on = { lt: new Date() }; // Prisma operator for less than current date
            } else {
                filters.closes_on = { gte: new Date() };
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
                    users: true,
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

        this.app.post(`/jobposts/:id/apply`, async (context: Context): Promise<any> => {
            const id = context.req.param('id') as string;
            const jobPost = await usePrisma().job_postings.findFirst({
                where: {id: Number(id)},
                include: {
                    job_applications: true
                }
            });
            if(!jobPost) return errorResponse(context, 'JOBPOST_NOT_FOUND');

            let {application, workItems} = await context.req.json();

            workItems = workItems as number[]

            const user = this.getHonoUser(context);

            let remaining = jobPost.available_slots;
            for(const application of jobPost.job_applications) {
                if(application.status == "HIRED") {
                    remaining--;
                }
            }
            if(remaining <= 0) return errorResponse(context, 'already_full', 'job already full');

            const apply = await usePrisma().job_applications.create({
                data: {
                    application: application,
                    user_id: user.id,
                    job_post: jobPost.id,
                    work_items: {
                        create: workItems.map((workItemId: number) => ({
                            work_items: {
                                connect: {
                                    id: workItemId,
                                },
                            },
                        })),
                    }
                }
            })

            return successResponse(context, apply);
        });

        this.app.get('/profiles/:handle', async (context: Context): Promise<any> => {
            const handle = context.req.param('handle') as string;
            const user = await usePrisma().users.findUnique({
                where: {handle: handle}
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