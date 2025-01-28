import {PrismaClient} from "@prisma/client";

export function getPrismaClient(): PrismaClient {
    return new PrismaClient();
}

export interface HonoUser {
    sub: string,
    email: string,
    nickname: string
}