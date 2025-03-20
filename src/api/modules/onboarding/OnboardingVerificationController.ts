import type {Context, Hono} from "hono";
import {errorResponse, inheritResponse, successResponse} from "~/src/api/utils/HonoResponses";
import {CreatorAPI} from "~/src/api/utils/CreatorAPI/CreatorAPI";
import {context} from "esbuild";
import {BaseController} from "~/src/api/utils/BaseController";
import type {HonoUser} from "~/src/api/utils/HonoComposables";
import {usePrisma} from "~/src/api/src/lib/prisma";

export class OnboardingVerificationController extends BaseController {
    async endpoints() {
        this.app.get('/onboarding/verification',  async (context: Context): Promise<any> => {
           const handle = context.req.query('handle') as string;
           const user = this.getHonoUser(context);
           if(!handle) {
               const getVerification = await this.getPrisma().instagram_account.findFirst({
                   where: {user_id: user.id}
               });
               return successResponse(context, getVerification);
           }

           const getVerification = await this.getPrisma().instagram_account.findFirst({
               where: {user_id: user.id, handle: handle}
           });

           if(getVerification) {
               return successResponse(context, getVerification);
           }

           const code = this.generateRandomString(30);

           const verification = await this.getPrisma().instagram_account.create({
               data: {
                   user_id: user.id,
                   handle: handle,
                   verification_code: code,
               }
            });

           if(!verification) return errorResponse(context, 'something went wrong generating verification code.');

           return successResponse(context, verification);
        });

        this.app.delete('/onboarding/verification',  async (context: Context): Promise<any> => {
            const handle = context.req.query('handle') as string;
            if(!handle) return errorResponse(context, 'invalid_request');
            const user = this.getHonoUser(context);
            const getVerification = await this.getPrisma().instagram_account.deleteMany({
                where: {user_id: user.id, handle: handle}
            });

            return successResponse(context, getVerification);
        });

        this.app.get('/webhook',  async (c: Context): Promise<any> => {
            const challenge = c.req.query('hub.challenge');

            if (challenge) {
                return c.text(challenge, 200, { 'Content-Type': 'text/plain' });
            }

            return c.text('no', 400);
        });

        this.app.post('/webhook',  async (c: Context): Promise<any> => {
            const challenge = c.req.query('hub.challenge');
            const data = await c.req.json();

            const { senderId, text } = this.processInstagramUpdate(data);

            if (senderId && text && text.includes('verify')) {
                const key = process.env.INSTAGRAM_KEY;
                const url = `https://graph.instagram.com/v22.0/${senderId}?fields=name,username,profile_pic,follower_count,is_user_follow_business,is_business_follow_user&access_token=${key}`;

                const response = await fetch(url);

                if (!response.ok) {
                    // Handle HTTP errors (e.g., 400, 401, 500)
                    console.error(`HTTP error! Status: ${response.status}`);
                    await this.sendMessage(senderId, 'Instagram verification service down try again later');
                    return null;
                }

                const data: {username: string, follower_count: number} = await response.json();
                const parts = text.split(':');

                const check = await usePrisma().instagram_account.findFirst({
                    where: {verification_code: parts[1], handle: data.username},
                });

                if(!check) {
                    await this.sendMessage(senderId, 'Error: Username does not match the associated Instagram account')
                    return c.text('no', 200);
                }

                const verification = await usePrisma().instagram_account.updateMany({
                    where: {verification_code: parts[1], handle: data.username},
                    data: {
                        verified: true,
                        sender_id: senderId,
                        follower_count: data.follower_count
                    }
                });
                await this.sendMessage(senderId, 'Your account was successfully verified!')
            }


            return c.text('no', 200);
        })
    }

    private generateRandomString(length: number): string {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length),
            );
            if ((i + 1) % 5 === 0 && i !== length - 1) {
                result += '-';
            }
        }
        return result;
    }

    private async sendMessage(senderId: string, message: string) {
        const ig_id = "17841454960888679";
        const key = process.env.INSTAGRAM_KEY;
        const url = `https://graph.instagram.com/v22.0/${ig_id}/messages?access_token=${key}`;
        const send = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipient: {
                    id: senderId
                },
                message: {
                    text: message
                }
            })
        });
    }

    private processInstagramUpdate(payload: any): {
        senderId: string | null;
        text: string | null;
    } {
        try {
            const update = payload as InstagramUpdate;


            if (
                update.object === 'instagram' &&
                update.entry &&
                update.entry.length > 0 &&
                update.entry[0].messaging &&
                update.entry[0].messaging.length > 0
            ) {
                const messagingEvent = update.entry[0].messaging[0];
                const senderId = messagingEvent.sender.id;
                const text = messagingEvent.message.text;


                return { senderId, text };
            } else {
                console.warn('Unexpected Instagram update format:', payload);
                return { senderId: null, text: null }; // Or throw an error
            }
        } catch (error) {
            console.error('Error processing Instagram update:', error);
            return { senderId: null, text: null }; // Or re-throw the error
        }
    }

}

interface InstagramUpdate {
    object: 'instagram';
    entry: [
        {
            time: number;
            id: string;
            messaging: [
                {
                    sender: { id: string };
                    recipient: { id: string };
                    timestamp: number;
                    message: { mid: string; text: string };
                }
            ];
        }
    ];
}