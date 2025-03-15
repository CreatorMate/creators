import {Endpoint} from "~/src/api/utils/Endpoint";
import type {Context} from "hono";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {errorResponse, successResponse} from "~/src/api/utils/HonoResponses";
import hono from "~/src/api/hono";

export class GetSelfEndpoint extends Endpoint {
    protected readonly method: string = 'get'
    protected readonly route: string = '/users/me'

    protected async handle(context: Context) {
        const honoUser = this.getHonoUser(context);
        let user = await this.getUser(honoUser.id);

        if(!user) return errorResponse(context, 'USER_NOT_FOUND');

        if (!user) return errorResponse(context, "User not found or could not be created");

        return successResponse(context, user);
    }
    private async getUser(id: string) {
        return this.prismaClient.users.findUnique({
            where: {id: id},
        });
    }
}