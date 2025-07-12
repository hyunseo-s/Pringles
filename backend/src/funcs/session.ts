import { getDbConnection } from '../db';
import { askGemini } from '../gemini/client';

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

// gets the level of a student given the studentId and sessionId 
export async function getLevel(studentId: string, topicId: string) {

    const db = await getDbConnection();

    const res = await db.get(
        `SELECT level FROM topic_student WHERE topicid = '${topicId}' AND studentid = '${studentId}'`
    );

    return { level: res.level };
}

// gets a random question from the question db given the level and topicId
export async function getQuestion(level: string, topicId: string) {

    const db = await getDbConnection();

    const question = await db.get(
        `SELECT * FROM questions WHERE topicid = '${topicId}' AND level = '${level}'`
    );

    return { question };
}

// Generate new question given topic and session id
export async function generateQuestion(studentLevel: string, questionLevel: string, topicId: string, sessionId: string, question: string) {

    const prompt = `
        Generate a single multiple-choice question on the topic: "${topicId}". 
        This is a level "${questionLevel}" difficulty question that you can base it off to generate: "${question}".
        The generated question should have the difficulty level "${studentLevel}".
        
        Format the response as JSON:
        {
            "question": "A circle with...",
            "options": [
                {
                    "text": "5",
                    "is_correct": true,
                    "rationale": "The distance..."
                },
                {
                "text": "3",
                "is_correct": false,
                "rationale": "While..."
                },
                {
                "text": "100",
                "is_correct": false,
                "rationale": "This point..."
                },
                {
                "text": "1",
                "is_correct": false,
                "rationale": "This point..."
                }
            ]
        }
    `;

    const result = await askGemini(prompt);
    // const response = await result.response;
    // const text = await response.text();

    return { result }
}
