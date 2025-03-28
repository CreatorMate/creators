import {Endpoint} from "~/src/api/utils/Endpoint";
import type {Context} from "hono";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {errorResponse, successResponse} from "~/src/api/utils/HonoResponses";
import hono from "~/src/api/hono";
import type {User} from "@supabase/auth-js";

export class GetSelfEndpoint extends Endpoint {
    protected readonly method: string = 'get'
    protected readonly route: string = '/users/me'

    protected async handle(context: Context) {
        const honoUser = this.getHonoUser(context);
        let user = await this.getUser(honoUser.id);

        if(!user) {
            await this.createUser(honoUser);
            user = await this.getUser(honoUser.id);
        }

        if (!user) return errorResponse(context, "User not found or could not be created");

        return successResponse(context, user);
    }

    private async createUser(honoUser: User) {
        await this.prismaClient.users.create({
            data: {
                id: honoUser.id,
                email: honoUser.email ?? '',
            }
        });
    }

    private async getUser(id: string) {
        return this.prismaClient.users.findUnique({
            where: {id: id},
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                rights: {
                                    include: {
                                        right: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}