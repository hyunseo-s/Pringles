import { getDbConnection } from "../db";

export const getUser = async (userId: string) => {
    const db = await getDbConnection();
		const users = await db.all(`SELECT userid, nameFirst, nameLast, role FROM users WHERE userid = ${userId}`);
	
    if (users.length == 0) {
        throw new Error(`User with ID ${userId} not found`);
    }

    return users[0];
}
