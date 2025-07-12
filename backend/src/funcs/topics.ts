import { getDbConnection } from "../db";

export const createTopics = async (classId: string , topics: string[]) => {
	const db = await getDbConnection();
	const allTopics = []

	// check classId is valid
	const classes = await db.all(`SELECT * FROM classes WHERE classid = '${classId}'`);
	
	if (classes.length === 0) throw new Error("No class found")

	for (const topic of topics) {
		const res = await db.run(
			`INSERT INTO topics (classid, topicname) VALUES (?, ?)`,[classId, topic]
		);

		allTopics.push({ topicName: topic, topicId: res.lastID });
		
		const students = await db.all(`SELECT * FROM class_student WHERE classid = '${classId}'`);

		for (const student of students) {
			await db.run(
				`INSERT INTO topic_student (topicid, studentid, level) VALUES (?, ?, ?)`, [res.lastID, student.studentid, 5]
			);
		}
	}

  return {topics: allTopics};
}

export const getTopics = async (classId: number) => {
	const db = await getDbConnection();
	const topics = await db.all(`SELECT * FROM topics WHERE classid = '${classId}'`);

	return topics.map((topic) => ({ topicName: topic.topicname, topic: topic.topicid }));
}

export const addQuestion = async (topicId: number, level: number, question: string) => {
	const db = await getDbConnection();

	const res = await db.run(
		`INSERT INTO questions (topicId, question, level, numWrong, numRight) VALUES (?, ?, ?, ?, ?)`,
		[topicId, question, level, 0, 0]
	);

	return {};
}

export const getStudentTopicData = async (studentId: number, topicId: number) => {
	const db = await getDbConnection();

	const user = await db.get(`SELECT * FROM users WHERE userid = '${studentId}' AND role = 'student'`);	

	if (!user) throw new Error("No such student exists");

	// get all questions 
	const level = await db.get(`SELECT level FROM topic_student WHERE topicid = '${topicId}' and studentid = '${studentId}'`);
	console.log(level)

	const answers = await db.all(`
		SELECT	q.level, a.correct 
		FROM	answers AS a
		JOIN	questions AS q ON a.questionid = q.questionid
		WHERE	q.topicid = '${topicId}' and a.studentid = '${studentId}'
	`);
	
	const easyQsTotal = answers.filter((a: {level: number, correct: boolean}) => a.level <= 3).length;
	const easyCorrect = easyQsTotal.filter((q: {level: number, correct: boolean}) => q.correct).length;
	const medQsTotal = answers.filter((a: {level: number, correct: boolean}) => a.level > 3 && a.level <= 7).length;
	const medCorrect = medQsTotal.filter((q: {level: number, correct: boolean}) => q.correct).length;
	const hardQsTotal = answers.filter((a: {level: number, correct: boolean}) => a.level > 7).length;
	const hardCorrect = hardQsTotal.filter((q: {level: number, correct: boolean}) => q.correct).length;
	
	return {
		easyCorrect,
		easyQsTotal,
		medCorrect,
		medQsTotal,
		hardQsTotal,
		hardCorrect,
		level,
	};
}

export const getTeacherTopicData = async (teacherId: number, topicId: number) => {
	const db = await getDbConnection();
	const user = await db.get(`SELECT * FROM users WHERE userid = '${teacherId}' AND role = 'teacher'`);	

	if (!user) throw new Error("No such teacher exists");

	// get all questions 
	// select all questions with given topic id
	const questions = await db.all(`SELECT * FROM questions WHERE topicid = '${topicId}'`);

	return { questionData: questions };
}

// export const getStudentsLevels = async (teacherId: number, topicId: number) => {
// 	const db = await getDbConnection();
// 	const user = await db.get(`SELECT * FROM users WHERE userid = '${teacherId}' AND role = 'teacher'`);	

// 	if (!user) throw new Error("No such teacher exists");

// 	const levels = await db.get(`
// 		SELECT	q.level, a.correct 
// 		FROM	answers AS a
// 		JOIN	questions AS q ON a.questionid = q.questionid
// 		WHERE	q.topicid = '${topicId}' and a.studentid = '${studentId}'
// 	`);
// }