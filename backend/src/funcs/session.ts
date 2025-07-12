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

    console.log(res)
    return { level: res.level };
}

// gets a random question from the question db given the topicId
export async function getQuestion(topicId: string) {

    const db = await getDbConnection();

    const easyQuestion = await db.get(
      `SELECT * FROM questions WHERE topicid = ? AND level BETWEEN 1 AND 3 ORDER BY RANDOM() LIMIT 1`,
      [topicId]
    );
  
    const mediumQuestion = await db.get(
      `SELECT * FROM questions WHERE topicid = ? AND level BETWEEN 4 AND 7 ORDER BY RANDOM() LIMIT 1`,
      [topicId]
    );
  
    const hardQuestion = await db.get(
      `SELECT * FROM questions WHERE topicid = ? AND level BETWEEN 8 AND 10 ORDER BY RANDOM() LIMIT 1`,
      [topicId]
    );
  
    return {
      easy: easyQuestion,
      medium: mediumQuestion,
      hard: hardQuestion
    };
}

// Generate new question given topic and session id
export async function generateQuestion(studentLevel: string, topicId: string, easyQuestion: string, medQuestion: string, hardQuestion: string, easyQuestionLevel: string, medQuestionLevel: string, hardQuestionLevel: string) {

    const prompt = `
        Generate a single multiple-choice question on the topic: "${topicId}". 
        This is a level "${easyQuestionLevel}" difficulty question that you can base it off to generate (easy question): "${easyQuestion}".
        This is a level "${medQuestionLevel}" difficulty question that you can base it off to generate (easy question): "${medQuestion}".
        This is a level "${hardQuestionLevel}" difficulty question that you can base it off to generate (easy question): "${hardQuestion}".
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
