import {Endpoint} from "~/src/api/utils/Endpoint";
import type {Context} from "hono";
import {errorResponse, successResponse} from "~/src/api/utils/HonoResponses";

export class AddAccountEndpoint extends Endpoint {
    protected readonly method: string = 'post'
    protected readonly route: string = '/creators/:id/accounts'

    protected async handle(context: Context) {
        const id = context.req.param('id');
        const {accountId, platformId } = await context.req.json();
        const account = await this.prismaClient.connected_accounts.create({
            data: {
                account_id: accountId,
                platform_id: platformId,
                user_id: id
            }
        });

        if(!account) return errorResponse(context, 'something went wrong while trying to add your account');

        return successResponse(context, account);
    }
}