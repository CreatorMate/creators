export type User = {
    id: string;
    handle: string;
    email: string;
    status: AccountStatus;
    profile_picture: string;
    based_in: string;
    project_types: string[];
    date_of_birth: string;
    additional_info: string;
    first_name: string;
    last_name: string;
    work_types: string[];
    website: string;
    phone_number: string;
    languages: string[],
    gear: string[]
    roles: any;
    rights: any;
    visibility: boolean,
    notifications: boolean
};

export type WorkItem = {
    id: number,
    title: string,
    job_title: string,
    link_to: string,
    user_id: string,
    image: string
}

export type JobPost = {
    id: number,
    posted_by: string,
    title: string,
    looking_for: string,
    date: string,
    description: string,
    place: string,
    active: boolean,
    available_slots: number,
    client_id: number,
    closes_on: string,
    creative_load_id: string,
    labels: string[],
    price: number,
    requirements: string,
    creative_lead: User,
    users: User,
    videos: string[],
    client: Client,
    job_applications: JobApplication[],
    payment_type: PaymentType,
    tally: string,
    created_at: string
}

export enum PaymentType {
    BUDGET = "BUDGET",
    HOURLY = "HOURLY",
    DAILY = "DAILY"
}

export type JobApplication = {
    id: string,
    user_id: string,
    status: ApplicationStats,
    job_postings: JobPost,
    favorite: boolean

}

export type Client = {
    id: number,
    name: string,
    headquarters: string,
    employees: string,
    industry: string,
    linkedin: string,
    wikipedia: string,
    x: string,
    image: string,
    website: string,
    instagram: string,
    youtube: string
}

export enum AccountStatus {
    NEW = "NEW",
    IN_REVIEW = "IN_REVIEW",
    IN_PROCESS = "IN_PROCESS",
    ACCEPTED = "ACCEPTED",
}

export enum ApplicationStats {
    HIRED = "HIRED",
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    DENIED = "DENIED"
}

export type Brand = {
    id: number;
    name: string;
    is_premium: string;
    customer_id: string;
};
