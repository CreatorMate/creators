import {Endpoint} from "~/src/api/utils/Endpoint";
import type {Context} from "hono";
import {successResponse, errorResponse} from "~/src/api/utils/HonoResponses";
import {decrypt, encrypt} from "~/src/api/utils/Encryption/Encryptor";
import {AccountStatus} from "~/src/utils/SupabaseTypes";

const phyllokey = useRuntimeConfig().PHYLLO_KEY as string

export class GetConnectionEndpoint extends Endpoint {
    protected readonly method: string = 'get'
    protected readonly route: string = '/phyllo'

    protected async handle(context: Context) {
        const { creatorId} = context.req.query();

        let creator = await this.prismaClient.creators.findUnique({
            where: {id: creatorId}
        });

        if(!creator) {
            return errorResponse(context, `this creator does not exist`);
        }

        if(creator.status != AccountStatus.ACCEPTED && creator.status != AccountStatus.INVITED) {
            return errorResponse(context, `this creator cannot link his account before he is accepted into creatormate`);
        }

        let connection = await this.prismaClient.phyllo_connections.findUnique({
            where: {id: creatorId}
        });

        if(!connection) {
            const json = await this.createPhylloConnection(creatorId);
            if(!json) return errorResponse(context, 'could not setup a new connection');
            connection = await this.prismaClient.phyllo_connections.create({
                data: {
                    id: creatorId,
                    user_id: json.id,
                    token: '',
                    expires_on: new Date(json.created_at).toISOString()
                }
            });
        }

        if(!connection) errorResponse(context, 'could not get or create a connection');
        const currentDate = new Date();


        if (!connection.token || !connection.expires_on || currentDate > connection.expires_on) {
            const newTokenRequest = await this.getNewAccessToken(creatorId, connection);

            if(!newTokenRequest) return errorResponse(context, 'could not create a new token');

            const token = encrypt(newTokenRequest.sdk_token)

            connection = await this.prismaClient.phyllo_connections.update({
                where: {id: creatorId},
                data: {
                    token: token,
                    expires_on: new Date(newTokenRequest.expires_at).toISOString()
                }
            });
        }

        connection.token = decrypt(<string>connection.token);

        return successResponse(context, connection);
    }

    private async createPhylloConnection(id: string): Promise<null|{name: string, external_id: string, id: string, created_at: string}> {
        let response = await fetch('https://api.staging.getphyllo.com/v1/users', {
            method: 'POST',
            body: JSON.stringify({
                name: id,
                external_id: id
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${phyllokey}`
            }
        });

        if(!response.ok) {
            response = await fetch(`https://api.staging.getphyllo.com/v1/users/external_id/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${phyllokey}`
                }
            });
        }
        if(!response.ok) return null;
        const json: {
            name: string,
            external_id: string,
            id: string,
            created_at: string
        } = await response.json();

        return json;
    }

    private async getNewAccessToken(id: string, connection: any) : Promise<null|{sdk_token: string, expires_at: string}> {
        const response = await fetch('https://api.staging.getphyllo.com/v1/sdk-tokens', {
            method: 'POST',
            body: JSON.stringify({
                name: id,
                user_id: connection.user_id,
                products: [
                    "IDENTITY", "IDENTITY.AUDIENCE", "ENGAGEMENT", "ENGAGEMENT.AUDIENCE", "INCOME", "ACTIVITY"
                ]
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${phyllokey}`
            }
        });

        if(!response.ok) return null;

        return await response.json();
    }
}