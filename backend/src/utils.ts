import jwt from "jsonwebtoken";
// import { getData } from "./funcs/dataStore";

const SECRET = "TOPSECRET";

interface DecodedToken {
  user: string;
  iat: number;
  exp: number;
}

export function decodeJWT(token: string): string {
  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, SECRET) as DecodedToken;
    return decoded.user;

  } catch (error) {
    console.error("Invalid JWT:", error.message);
  }
}