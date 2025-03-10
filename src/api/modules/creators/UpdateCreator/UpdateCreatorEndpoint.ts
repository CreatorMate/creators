
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
        const user = await this.prismaClient.users.findFirst({
           where: { email: honoUser.email, external_id: honoUser.sub},
            include: {
               creators: true
            }
        });
        if(!user || !user.creators) return errorResponse(context, 'USER_NOT_FOUND');
        const data = await context.req.json();
        const updated = await this.prismaClient.creators.update({
            where: {
                id: user.creators.id,
            },
            data: {
                ...data
            }
        });
        if(!updated) {
            return errorResponse(context, "Something went wrong while updating the creator");
        }

        return successResponse(context, updated);
    }


}