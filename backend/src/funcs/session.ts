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

	let level = await db.get(`SELECT level FROM topic_student WHERE studentid = '${studentId}' and topicid = '${topicId}'`);
	level = parseInt(level)

	let increment;
	const mark = JSON.parse(res);

	if (mark.correct) {
		// Student has answered question correctly
		increment = "numRight";
		if (level < 10) level++;

		await db.run(
			`INSERT INTO question_student (questionid, studentid) VALUES (?, ?)`,[questionId, studentId]
		);
	} else {
		increment = "numWrong";
		if (level > 1) level--;
	}
	
	// Update student's level for given topic
	await db.run(
		`UPDATE topic_student SET level = ? WHERE topicid = ? and studentid = ?`,
		[level, sessionId, studentId]
	);


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

export const endSession = async (topicId: number, sessionId: number) => {
	const db = await getDbConnection();
	const res = await db.get(`
		SELECT numWrong, numRight FROM sessions WHERE sessionid = '${sessionId}'`
	);

	const answers = await db.all(`
		SELECT q.level, a.correct 
		FROM answers as a 
		JOIN questions as q ON a.questionid = q.questionid
		WHERE a.sessionid = '${sessionId}'`
	);

	const easyQsTotal = answers.filter((a: {level: number, correct: boolean}) => a.level <= 3);
	const easyCorrect = easyQsTotal.filter((q: {level: number, correct: boolean}) => q.correct).length;
	const medQsTotal = answers.filter((a: {level: number, correct: boolean}) => a.level > 3 && a.level <= 7);
	const medCorrect = medQsTotal.filter((q: {level: number, correct: boolean}) => q.correct).length;
	const hardQsTotal = answers.filter((a: {level: number, correct: boolean}) => a.level > 7);
	const hardCorrect = hardQsTotal.filter((q: {level: number, correct: boolean}) => q.correct).length;


	return {
		numWrong: res.numWrong,
		numRight: res.numRight,
		easyCorrect,
		easyQsTotal: easyQsTotal.length,
  	medCorrect,
  	medQsTotal: medQsTotal.length,
		hardCorrect,
		hardQsTotal: hardQsTotal.length,
	}
}