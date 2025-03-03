import {Endpoint} from "~/src/api/utils/Endpoint";
import type {Context} from "hono";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {errorResponse, successResponse} from "~/src/api/utils/HonoResponses";

export class GetSelfEndpoint extends Endpoint {
    protected readonly method: string = 'get'
    protected readonly route: string = '/creators/me'

    protected async handle(context: Context) {
        const honoUser = this.getHonoUser(context);
        let user = await this.getUser(honoUser);
        if (!user) {
            const newUser = await this.createUser(honoUser);
            if (!newUser) return errorResponse(context, "Something went wrong while creating the new creator");
            const newCreator = await this.createCreator(newUser);
            user = await this.getUser(honoUser);
        } else if(user.creators.length === 0) {
            const newCreator = await this.createCreator(user);
            user = await this.getUser(honoUser);
        }

        if (!user || !user.creators) return errorResponse(context, "User not found or could not be created");

        return successResponse(context, user);
    }

    private async createUser(honoUser: HonoUser) {
        return this.prismaClient.users.create({
            data: {
                external_id: honoUser.sub,
                email: honoUser.email,
                full_name: honoUser.nickname
            }
        });
    }

    private async createCreator(user: any) {
        return this.prismaClient.creators.create({
            data: {
                user_id: user.id,
                email: user.email
            }
        });
    }

    private async getUser(honoUser: HonoUser) {
        return this.prismaClient.users.findFirst({
            where: {external_id: honoUser.sub, email: honoUser.email},
            include: {
                creators: true
            }
        });
    }
}