import type {APIResponse} from "~/src/api/utils/HonoResponses";
import {useToastState} from "~/src/utils/Toast/ToastState";
import {tryCatch} from "~/src/utils/utils";

export class API {
    private static cache = new Map<string, { data: any; expiry: number }>();
    private static cacheDuration = 0.5 * 60 * 1000; //30 minutes
    public static async ask<T>(path: string, method: 'GET'|'POST'|'PUT'|'DELETE' = 'GET', data: object = {}): Promise<APIResponse<T>>  {
        const config = useRuntimeConfig();
        const baseURL = config.public.BASE_URL;

        const cacheKey = `api-cache:${method}:${path}:${JSON.stringify(data)}`;

        if (API.cache.has(cacheKey)) {
            const cached = API.cache.get(cacheKey)!;
            if (cached.expiry > Date.now()) {
                console.log('using cache')
                return cached.data;
            } else {
                API.cache.delete(cacheKey);
            }
        }

        const requestObject: RequestInit = {}
        requestObject.method = method;
        if(method !== 'GET') {
            requestObject.body = JSON.stringify(data);
        }
        requestObject.headers = {
            'Accepts': 'application/json',
            'Content-Type': 'application/json'
        }

        const {data: request, error} = await tryCatch(fetch(`${config.public.BASE_URL}${'/API'}${path}`, requestObject));

        if(error) {
            return {success: false, error: 'no'} as APIResponse
        }

        const response: APIResponse<T> = await request.json() as APIResponse;

        API.cache.set(cacheKey, {
            data: response,
            expiry: Date.now() + API.cacheDuration,
        });

        if(response.message) {
            const toastState = useToastState();
            toastState.addToast(response.message, response.success);
        }
        return response;
    }
}