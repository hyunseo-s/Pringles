import { getDbConnection } from '../db';
import { askGemini } from '../gemini/client';
import { answerQueObj } from '../interface';

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
        `SELECT level FROM topic_student WHERE topicid = ${topicId} AND studentid = ${studentId}`
    );

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
export async function generateQuestion(studentLevel: string, topicName: string, easyQuestion: string, medQuestion: string, hardQuestion: string, easyQuestionLevel: string, medQuestionLevel: string, hardQuestionLevel: string) {
		
    const prompt = `
        Generate a single multiple-choice question on the topic: "${topicName}". 
        This is a level ${easyQuestionLevel} difficulty question that you can base it off to generate (easy question): "${easyQuestion}".
        This is a level ${medQuestionLevel} difficulty question that you can base it off to generate (medium question): "${medQuestion}".
        This is a level ${hardQuestionLevel} difficulty question that you can base it off to generate (hard question): "${hardQuestion}".
        The generated question should have the difficulty level ${studentLevel} out of 10 with 10 being the most difficult.
        
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

export const answerQuestion = async ({ studentId, topicId, sessionId, questionId, answer }: answerQueObj) => {
	const db = await getDbConnection();

	const question = await db.get(`SELECT question FROM questions WHERE questionid = '${questionId}'`);


	/** Example Prompt:
	 * 
	 * Given the question: "What are elements made of?", determine if the answer: "Elements are made up of tiny electrons, neutrons and protons and can be combined to form compounds. All elements can react with any other element" is correct without calculation errors and provide a maximum
		150 word rationale as to why the answer is correct or incorrect and return the output
		as JSON in the format:
		{
			"correct": boolean
			"rationale": string
		}
	 */

	const prompt = `
		Given the question: "${question}", determine if the answer: "${answer}" is correct without calculation errors and provide a maximum
		150 word rationale as to why the answer is correct or incorrect and return the output
		as JSON in the format:
		{
			"correct": boolean
			"rationale": string
		}
	
	`
	const res = await askGemini(prompt);

	let increment;
	const mark = JSON.parse(res);
	if (mark.correct) {
		increment = "numRight";

		// Student has answered question correctly
		await db.run(
			`INSERT INTO question_student (questionid, studentid) VALUES (?, ?)`,[questionId, studentId]
		);
	} else {
		increment = "numWrong";
	}
	
	// Increment numWrong or numRight in session
	const currValStr = await db.get(`SELECT ${increment} FROM questions WHERE topicid = '${topicId}'`);
	let currVal = parseInt(currValStr)

	await db.run(
		`UPDATE sessions SET ${increment} = ? WHERE sessionid = ?`,
		[++currVal, sessionId]
	);

	await db.run(
		`UPDATE questions SET ${increment} = ? WHERE questionid = ?`,
		[currVal, questionId]
	);

	await db.run(
		`INSERT INTO answers (questionid, studentid, sessonid, answer, correct) VALUES (?, ?, ?, ?, ?)`,
		[questionId, studentId, sessionId, answer, mark.correct]
	);

	return res;
}

// export const endSession = async (topicId, sessionId) => {
// 	const db = await getDbConnection();
// 	const { numWrong, numRight } = await db.all(`
// 		SELECT numWrong, numRight FROM sessions WHERE sessionid = '${sessionId}'`
// 	);	
// }
