import {Endpoint} from "~/src/api/utils/Endpoint";
import type {Context} from "hono";
import {usePrisma} from "~/src/api/src/lib/prisma";
import {errorResponse, successResponse} from "~/src/api/utils/HonoResponses";

interface Filters {
    status?: {
        in: string[];
    };
    user_id?: string; // Make user_id optional to match the use case
}

export class GetUserApplicationsEndpoint extends Endpoint {
    protected readonly method: string = 'get'
    protected readonly route: string = '/me/applications'

    protected async handle(context: Context) {
        const {status} = context.req.query();
        const user = this.getHonoUser(context);

        const filters: Filters = { user_id: user.id };

        if (status) {
            const roles = (status as string).split(',');
            filters.status = {in: roles};
        }
        const jobPosts = await usePrisma().job_applications.findMany({
            include: {
                job_postings: true
            },
            //@ts-ignore
            where: filters
        });

        if (!jobPosts) return errorResponse(context, 'something_went_wrong');

        return successResponse(context, jobPosts)

    }
}