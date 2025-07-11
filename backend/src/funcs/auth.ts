import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RegisterObj } from "../interface";
import { getDbConnection } from '../db';

const JWT_SECRET = "TOPSECRET";

// Register a new user
export const register = async ({ username, email, password } : RegisterObj) => {
	const db = await getDbConnection();

	const res = await db.run(
		`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
		[username, email, password]
	);

	const token = jwt.sign(
		{ user: res.lastID, email }, JWT_SECRET, { expiresIn: '1h' }
	);

	return { message: 'Registration success', token };
}

// User login function
export const login = async (email: string, password: string) => {
	const db = await getDbConnection();

	const users = await db.all(`SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`);

	if (users.length == 0) {
			throw new Error("Invalid credentials");
	}

	const token = jwt.sign({ user: users[0].id, email: users[0].email }, JWT_SECRET, { expiresIn: "1h" });

	return { message: "Login success", token };
};

// Middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            throw new Error("Invalid token");
        }
        (req as any).user = decoded;
        next();
    });
};

export const getAllUsers = async () => {
	const db = await getDbConnection();
	const users = await db.all(`SELECT * FROM users`);

	return { users }
}