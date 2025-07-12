export interface Database {
	users: User[];
}

export interface RegisterObj {
	nameFirst: string;
	nameLast: string;
	email: string;
	username: string;
	password: string;
	role: 'student' | 'teacher';
	profileImg: string;
}

export interface User {
	id: string;
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