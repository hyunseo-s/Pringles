import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RegisterObj } from "../interface";
import { getDbConnection } from '../db';

// Function to create the group, given the name and the members
export function getClasses(studentId: number) {

    const db = await getDbConnection();
    
    const res = await db.run(
        // `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        // [username, email, password]
    );

    // const token = jwt.sign(
    //     { user: res.lastID, email }, JWT_SECRET, { expiresIn: '1h' }
    // );

    // return { message: 'Registration success', token };
;
}