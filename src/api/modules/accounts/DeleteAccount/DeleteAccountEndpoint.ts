import {Endpoint} from "~/src/api/utils/Endpoint";
import type {Context} from "hono";
import {errorResponse, successResponse} from "~/src/api/utils/HonoResponses";

export class DeleteAccountEndpoint extends Endpoint {
    protected readonly method: string = 'delete'
    protected readonly route: string = '/creators/:id/accounts/:accountId'

    protected async handle(context: Context) {
        const id = context.req.param('id');
        const accountId = context.req.param('accountId');
        const account = await this.prismaClient.connected_accounts.deleteMany({
            where: {
                account_id: accountId,
                user_id: id
            }
        });

        if(!account) return errorResponse(context, 'something went wrong while trying to remove your account');

        return successResponse(context, account);
    }
}