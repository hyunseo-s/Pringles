export interface Database {
	users: User[];
}

export interface RegisterObj {
	email: string;
	username: string;
	password: string;
}

export interface User {
	id: string;
	username: string;
	email: string;
	password: string;
}

export interface Token {
	access_token: string;
	refresh_token?: string;
	scope: string;
	token_type: string;
	expiry_date: number;
}