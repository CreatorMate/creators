
import {Endpoint} from "~/src/api/utils/Endpoint";
import type {Context} from "hono";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {errorResponse, successResponse} from "~/src/api/utils/HonoResponses";
import {AccountStatus} from "~/src/utils/SupabaseTypes";

export class UpdateSelfEndpoint extends Endpoint {
    protected readonly method: string = 'put'
    protected readonly route: string = '/users/me'

    protected async handle(context: Context) {
        const honoUser = this.getHonoUser(context);

        const data = await context.req.json();
        const updated = await this.prismaClient.users.update({
            where: {
                id: honoUser.id,
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