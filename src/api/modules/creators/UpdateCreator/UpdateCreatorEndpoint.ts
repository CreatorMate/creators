
import {Endpoint} from "~/src/api/utils/Endpoint";
import type {Context} from "hono";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {errorResponse, successResponse} from "~/src/api/utils/HonoResponses";
import {AccountStatus} from "~/src/utils/SupabaseTypes";

export class UpdateCreatorEndpoint extends Endpoint {
    protected readonly method: string = 'put'
    protected readonly route: string = '/creators/me'

    protected async handle(context: Context) {
        const honoUser = this.getHonoUser(context);
        const {username, based_in, additional_info, project_types, tiktok, status} = await context.req.json();
        const updated = await this.prismaClient.creators.updateMany({
            where: {
                sub: honoUser.sub,
                email: honoUser.email,
            },
            data: {
                username: username,
                based_in: based_in,
                project_types: project_types,
                tik_tok: tiktok,
                status: status
            }
        });
        if(!updated) {
            return errorResponse(context, "Something went wrong while updating the creator");
        }

        return successResponse(context, updated);
    }


}