import { getDbConnection } from '../db';

// Starts the session given the classId and topicId
export async function startSession(classId: string, topicId: string, studentId: string) {

    const db = await getDbConnection();

    const res = await db.run(
        `INSERT INTO sessions (classid, topicid, studentid, numRight, numWrong)
         VALUES (?, ?, ?, ?, ?)`,
        [classId, topicId, studentId, 0, 0]
    );

    return { sessionId: res.lastID };
}

// // gets the question given class, topic and session id
// export async function getQuestions(classId: string, topicId: string, studentId: string) {

//     const db = await getDbConnection();

//     const res = await db.run(
        
//     );

//     return { sessionId: res.lastID };
// }