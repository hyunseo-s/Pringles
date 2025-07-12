import { getDbConnection } from '../db';
import { askGemini } from '../gemini/client';
import { answerQueObj, multiAnswerQueObj } from '../interface';

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
export async function getQuestions(topicId: string) {

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
export async function generateQuestion(
    studentLevel: string, 
    topicId: string, 
    easyQuestion: string, 
    medQuestion: string, 
    hardQuestion: string, 
    easyQuestionLevel: string, 
    medQuestionLevel: string, 
    hardQuestionLevel: string,
    topicName: string){

    const state = Math.random() >= 0.5;
    const selectedMode = state ? "written-response" : "multiple-choice";

    const formatMultipleChoice = `
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
    `

    const formatWrittenResponse = `Format the response as a plain string that asks the question clearly.`;

    const formatInstruction =
        selectedMode === "multiple-choice"
        ? formatMultipleChoice
        : formatWrittenResponse;


    const prompt = `
    Generate a single "${selectedMode}" question on the topic: "${topicName}". 
			
    Use the following questions as inspiration:
    - Level "${easyQuestionLevel}" (easy): "${easyQuestion}"
    - Level "${medQuestionLevel}" (medium): "${medQuestion}"
    - Level "${hardQuestionLevel}" (hard): "${hardQuestion}"

    The new question should be at difficulty level "${studentLevel}".

    ${formatInstruction}
    `;

    const response = await askGemini(prompt);
    return { mode: selectedMode, question: response }
}

// save the multiple choice question and the answers
export async function saveMultipleChoice(jsonString: string, topicId: string, studentLevel: string) {

    const db = await getDbConnection();

    const match = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
    const resultingString = match[1];

    let parsed;
    try {
        parsed = JSON.parse(resultingString);
    } catch (err) {
        throw new Error("Invalid JSON string");
    }

    console.log(parsed)

    const { question, options } = parsed;

    // 1. Insert the question into the `questions` table
    const insertQuestionStmt = await db.run(
        `
        INSERT INTO questions (topicId, question, level, type, numWrong, numRight)
        VALUES (?, ?, ?, ?, ?, ?)
    `,
        [topicId, question, studentLevel, "multi", 0, 0]
    );

    const questionId = insertQuestionStmt.lastID;

    // 2. Insert all the answer options
    for (const option of options) {
        await db.run(
        `
        INSERT INTO question_answerq (questionid, answer, correct)
        VALUES (?, ?, ?)
        `,
        [questionId, option.text, option.is_correct]
        );
    }

    // 3. Return metadata
    return {
        questionId,
        topicId,
        question,
        level: studentLevel,
        type: "multi",
        numWrong: 0,
        numRight: 0,
    };
}

// save the written response question
export async function saveWrittenResponse(question: string, topicId: string, studentLevel: string) {

    const db = await getDbConnection();

    const res = await db.run(
        `
        INSERT INTO questions (topicId, question, level, type, numWrong, numRight)
        VALUES (?, ?, ?, ?, ?, ?)
    `,
        [topicId, question, studentLevel, "written", 0, 0]
    );
  
     // 3. Return metadata
    return {
        questionId: res.lastID,
        topicId: topicId,
        question: question,
        level: studentLevel,
        type: "written",
        numWrong: 0,
        numRight: 0,
    };
}

export const multiAnswerQuestion = async ({ studentId, topicId, sessionId, questionId, answer, correct }: multiAnswerQueObj) => {
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
	let level = await db.get(`SELECT level FROM topic_student WHERE studentid = '${studentId}' and topicid = '${topicId}'`);
	level = parseInt(level);


	if (correct) {
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

	return {}
}

export const answerQuestion = async ({ studentId, topicId, sessionId, questionId, answer }: answerQueObj) => {
	const db = await getDbConnection();
	console.log(topicId, sessionId, questionId, answer)

	const question = await db.get(`SELECT question FROM questions WHERE questionid = '${questionId}'`);
    console.log(question)

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
		Given the question: "${question.question}", determine if the answer: "${answer}" is correct without calculation errors and provide a maximum
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
	level = parseInt(level.level)

	let increment;

    const match = res.match(/```json\s*([\s\S]*?)\s*```/);
    const resultingString = match[1];

	const mark = JSON.parse(resultingString);

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
    console.log(currValStr)
	let currVal = parseInt(currValStr.numWrong)

	await db.run(
		`UPDATE sessions SET ${increment} = ? WHERE sessionid = ?`,
		[++currVal, sessionId]
	);

	await db.run(
		`UPDATE questions SET ${increment} = ? WHERE questionid = ?`,
		[currVal, questionId]
	);

	await db.run(
		`INSERT INTO answers (questionid, studentid, sessionid, answer, correct) VALUES (?, ?, ?, ?, ?)`,
		[questionId, studentId, sessionId, answer, mark.correct]
	);

	return resultingString;
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
