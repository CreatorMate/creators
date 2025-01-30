export type User = {
    id: string,
    email: string,
    brand_id: number,
    picture: string,
    full_name: string
}

export type Creator = {
    id: string,
    sub: string,
    status: AccountStatus,
    handle: string,
    email: string,
    based_in: string,
    project_types: string,
    created_at: string,
    date_of_birth: string,
    additional_info: string,
    tik_tok: string
    linked: boolean
}

export enum AccountStatus {
    NEW = "NEW",
    INVITED = "INVITED",
    IN_REVIEW = "IN_REVIEW",
    ACCEPTED = "ACCEPTED"
}

export type Brand = {
    id: number,
    name: string,
    is_premium: string,
    customer_id: string
}