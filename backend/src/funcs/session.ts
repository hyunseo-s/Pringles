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

// // gets the question given class, topic and session id
// export async function getQuestions(classId: string, topicId: string, studentId: string) {

//     const db = await getDbConnection();

//     const res = await db.run(
        
//     );

//     return { sessionId: res.lastID };
// }

export const answerQuestion = async ({ studentId, topicId, sessionId, questionId, answer }: answerQueObj) => {
	const db = await getDbConnection();
	console.log(topicId, sessionId, questionId, answer)

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
	console.log(res);

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

	return res;
}