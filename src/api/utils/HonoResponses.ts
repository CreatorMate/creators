import type {Context} from "hono";
import type {StatusCode} from "hono/dist/types/utils/http-status";

export type APIResponse<T = any> = {
    success: true,
    data: T,
    meta: any,
    message?: string,
} | {
    success: false,
    error: string,
    message?: string,
}

export function successResponse<T>(context: Context, data: any, meta: any = null, message: string = '',) {
    return {
        success: true,
        data: data,
        meta: meta,
        message: message ?? null
    }
}

export function errorResponse(context: Context, error: string, message: string = '', status: number = 500) {
    context.status(<StatusCode>status);
    return context.json({
        success: false,
        error: error,
        message: message ?? null
    });
}

export function inheritResponse(context: Context, response: APIResponse, code: any = 200) {
    context.status(code);
    return context.json(response);
}
