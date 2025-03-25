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
	roles: any;
	rights: any;
};

export enum AccountStatus {
	NEW = "NEW",
	IN_REVIEW = "IN_REVIEW",
	ACCEPTED = "ACCEPTED",
}

export type Brand = {
	id: number;
	name: string;
	is_premium: string;
	customer_id: string;
};
