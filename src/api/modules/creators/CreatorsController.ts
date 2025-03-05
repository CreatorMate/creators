import {BaseController} from "~/src/api/utils/BaseController"
import type {Context} from "hono";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {errorResponse, successResponse} from "~/src/api/utils/HonoResponses";


export class CreatorsController extends BaseController {
    async endpoints() {
        this.app.delete('/creators/ig', async (context: Context): Promise<any> => {
            const apiUser = this.getHonoUser(context);
            const user = await this.getPrisma().users.findFirst({
                where: {email: apiUser.email, external_id: apiUser.sub},
                include: {
                    creators: true
                }
            });

            if(!user || !user.creators || !user.creators.instagram_id) return errorResponse(context,'USER_NOT_FOUND');

            await this.getPrisma().instagram_accounts.delete({
                where: {id: user.creators.instagram_id}
            });

            return successResponse(context, 'instagram connection deleted')
        });
    }

}