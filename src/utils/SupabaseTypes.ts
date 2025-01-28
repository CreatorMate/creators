export type User = {
    id: string,
    email: string,
    brand_id: number,
    picture: string,
    full_name: string
}

export type Creator = {
    id: string,
    status: string,
    email: string,
    type: string,
    accepted: boolean|null,
    brand_id: number,
    country: string,
    created: string,
    username: string
}

export type Brand = {
    id: number,
    name: string,
    is_premium: string,
    customer_id: string
}