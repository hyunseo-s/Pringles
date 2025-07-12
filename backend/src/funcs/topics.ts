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

export const getTopicName = async (topicId: number) => {
	const db = await getDbConnection();
	return await db.get(`SELECT topicname FROM topics WHERE topicid = '${topicId}'`);
}

export const addQuestion = async (topicId: number, level: number, question: string) => {
	const db = await getDbConnection();

	const res = await db.run(
		`INSERT INTO questions (topicId, question, level, type, numWrong, numRight) VALUES (?, ?, ?, ?, ?, ?)`,
		[topicId, question, level, "written", 0, 0]
	);

	return { questionid: res.lastID };
}

export const getStudentTopicData = async (studentId: number, topicId: number) => {
	const db = await getDbConnection();

	const user = await db.get(`SELECT * FROM users WHERE userid = '${studentId}' AND role = 'student'`);	

	if (!user) throw new Error("No such student exists");

	// get all questions 
	const level = await db.get(`SELECT level FROM topic_student WHERE topicid = '${topicId}' and studentid = '${studentId}'`);

	const answers = await db.all(`
		SELECT	q.level, a.correct 
		FROM	answers AS a
		JOIN	questions AS q ON a.questionid = q.questionid
		WHERE	q.topicid = '${topicId}' and a.studentid = '${studentId}'
	`);
	
	const easyQsTotal = answers.filter((a: {level: number, correct: boolean}) => a.level <= 3);
	const easyCorrect = easyQsTotal.filter((q: {level: number, correct: boolean}) => q.correct).length;
	const medQsTotal = answers.filter((a: {level: number, correct: boolean}) => a.level > 3 && a.level <= 7);
	const medCorrect = medQsTotal.filter((q: {level: number, correct: boolean}) => q.correct).length;
	const hardQsTotal = answers.filter((a: {level: number, correct: boolean}) => a.level > 7);
	const hardCorrect = hardQsTotal.filter((q: {level: number, correct: boolean}) => q.correct).length;
	
	return {
		easyCorrect,
		easyQsTotal: easyQsTotal.length,
		medCorrect,
		medQsTotal: medQsTotal.length,
		hardCorrect,
		hardQsTotal: hardQsTotal.length,
		level: level.level,
	};
}

export const getTeacherTopicData = async (teacherId: number, topicId: number) => {
	const db = await getDbConnection();
	const user = await db.get(`SELECT * FROM users WHERE userid = '${teacherId}' AND role = 'teacher'`);	

	if (!user) throw new Error("No such teacher exists");

	// get all questions 
	// select all questions with given topic id
	const answers = await db.all(`
		SELECT a.answerid, a.questionid, a.sessionid, a.studentid, a.answer, q.question, a.correct, q.level
		FROM answers a
		JOIN questions q ON q.questionid = a.questionid
		WHERE q.topicid = ${topicId};
	`);

	return { questionData: answers };
}

export const getStudentsLevels = async (teacherId: number, classId: number) => {
	const db = await getDbConnection();
  const topicLevels = [];
	const user = await db.get(`SELECT * FROM users WHERE userid = '${teacherId}' AND role = 'teacher'`);	

	if (!user) throw new Error("No such teacher exists");

  const topics = await db.all(`
		SELECT  topicid, topicname
		FROM    topics
		WHERE	  classid = '${classId}'
	`);

  for (const topic of topics) {
    const levels = await db.all(`
      SELECT  level
      FROM    topic_student
      WHERE	  topicid = '${topic.topicid}'
    `);

    const easy = levels.filter((level: number) => level <= 3).length;
    const med = levels.filter((level:number) => level > 3 && level <= 7).length;
    const hard = levels.filter((level:number) => level > 7).length;
    
    const topicInfo = {
      topicId: topic.topicId,
      topicName: topic.topicname,
      easy,
      med, 
      hard
    }

    topicLevels.push(topicInfo)
  }

  return { topicLevels }
}