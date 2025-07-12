export interface Database {
	users: User[];
}

export interface RegisterObj {
	email: string;
	password: string;
	nameFirst: string;
	nameLast: string;
	role: string;
}

export interface multiAnswerQueObj {
	studentId: number;
	topicId: number;
	sessionId: number;
	questionId: number;
	answer: string;
	correct: boolean;
}

export interface answerQueObj {
	studentId: number;
	topicId: number;
	sessionId: number;
	questionId: number;
	answer: string;
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