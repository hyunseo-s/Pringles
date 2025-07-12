import { getDbConnection } from "./db";

export const initDB = async () => {
  const db = await getDbConnection();

	// Drop all existing tables
  await db.exec(`
    DROP TABLE IF EXISTS class_student;
		DROP TABLE IF EXISTS class_teacher;
		DROP TABLE IF EXISTS classes;
		DROP TABLE IF EXISTS question_student;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS topics;
		DROP TABLE IF EXISTS topic_student;
    DROP TABLE IF EXISTS sessions;
		DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS answers;
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      userid INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
      nameFirst TEXT NOT NULL,
      nameLast TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      classid INTEGER PRIMARY KEY AUTOINCREMENT,
      classname TEXT NOT NULL,
      classImg TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      questionid INTEGER PRIMARY KEY AUTOINCREMENT,
      topicid INTEGER NOT NULL,
      question TEXT NOT NULL,
      level INTEGER NOT NULL,
			numRight INTEGER NOT NULL,
      numWrong INTEGER NOT NULL,
      FOREIGN KEY(topicid) REFERENCES topics(topicid)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      topicid INTEGER PRIMARY KEY AUTOINCREMENT,
      classid INTEGER NOT NULL,
      topicname TEXT NOT NULL,
			FOREIGN KEY(classid) REFERENCES classes(classid)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      sessionid INTEGER PRIMARY KEY AUTOINCREMENT,
      topicid INTEGER NOT NULL,
      classid INTEGER NOT NULL,
      studentid INTEGER NOT NULL,
      numRight INTEGER NOT NULL,
      numWrong INTEGER NOT NULL,
      FOREIGN KEY(topicid) REFERENCES topics(topicid),
			FOREIGN KEY(classid) REFERENCES classes(classid),
      FOREIGN KEY(studentid) REFERENCES users(userid)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS class_student (
      studentid INTEGER  NOT NULL,
      classid INTEGER NOT NULL,
      FOREIGN KEY(studentid) REFERENCES users(userid),
			FOREIGN KEY(classid) REFERENCES classes(classid),
      PRIMARY KEY(studentid, classid)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS class_teacher (
      teacherid INTEGER  NOT NULL,
      classid INTEGER NOT NULL,
      FOREIGN KEY(teacherid) REFERENCES users(userid),
			FOREIGN KEY(classid) REFERENCES classes(classid),
      PRIMARY KEY(teacherid, classid)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS question_student (
      studentid INTEGER  NOT NULL,
      questionid INTEGER NOT NULL,
      FOREIGN KEY(studentid) REFERENCES users(userid),
			FOREIGN KEY(questionid) REFERENCES questions(questionid),
      PRIMARY KEY(studentid, questionid)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS topic_student (
      studentid INTEGER  NOT NULL,
      topicid INTEGER NOT NULL,
      level INTEGER NOT NULL,
      FOREIGN KEY(studentid) REFERENCES users(userid),
			FOREIGN KEY(topicid) REFERENCES topics(topicid),
      PRIMARY KEY(studentid, topicid)
    )
  `);

	// Insert teachers and students
	await db.exec(`
   	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (1, 'justin@mail.com', '123', 'Justin', 'Son', 'teacher');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (2, 'ezc@mail.com', '123', 'Elizabeth', 'Zhu Chan', 'teacher');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (3, 'ivan@mail.com', '123', 'Ivan', 'Chan', 'student');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (4, 'parker@mail.com', '123', 'Parker', 'Qiu', 'student');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (5, 'felix@mail.com', '123', 'Felix', 'Cao', 'student');
	`);

	for (let i = 1; i <= 50; i++) {
		await db.exec(`
			INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (${i + 5}, 'adam${i}@mail.com', '123', 'Justin', 'Son', 'student');
		`);
	}

	// Insert classes
	await db.exec(`
   	INSERT INTO classes (classid, classname) VALUES (1, 'YEAR 9 MATHS');
		INSERT INTO classes (classid, classname) VALUES (2, 'YEAR 10 MATHS');
		INSERT INTO classes (classid, classname) VALUES (3, 'YEAR 11 MATHS');
		INSERT INTO classes (classid, classname) VALUES (4, 'YEAR 12 MATHS');
		INSERT INTO classes (classid, classname) VALUES (5, 'YEAR 7A ENGLISH');
		INSERT INTO classes (classid, classname) VALUES (6, 'YEAR 7B ENGLISH');
		INSERT INTO classes (classid, classname) VALUES (7, 'YEAR 8A SCIENCE');
		INSERT INTO classes (classid, classname) VALUES (8, 'YEAR 8B SCIENCE');
		INSERT INTO classes (classid, classname) VALUES (9, 'YEAR 8C SCIENCE');
	`);

	// Insert class teacher relationship
	await db.exec(`
   	INSERT INTO class_teacher (classid, teacherid) VALUES (1, 1);
		INSERT INTO class_teacher (classid, teacherid) VALUES (2, 1);
		INSERT INTO class_teacher (classid, teacherid) VALUES (3, 1);
		INSERT INTO class_teacher (classid, teacherid) VALUES (4, 1);
		INSERT INTO class_teacher (classid, teacherid) VALUES (5, 2);
		INSERT INTO class_teacher (classid, teacherid) VALUES (6, 2);
		INSERT INTO class_teacher (classid, teacherid) VALUES (7, 2);
		INSERT INTO class_teacher (classid, teacherid) VALUES (8, 2);
		INSERT INTO class_teacher (classid, teacherid) VALUES (9, 2);
	`);

	// Insert student class relationship
	for (let i = 1; i < 10; i++) {
		await db.exec(`
			INSERT INTO class_student (classid, studentid) VALUES (${i}, 3);
			INSERT INTO class_student (classid, studentid) VALUES (${i}, 4);
			INSERT INTO class_student (classid, studentid) VALUES (${i}, 5);`
		)
	}

	for (let i = 1; i <= 50; i++) {
		for (let j = 1; j < 5; j++) {
			await db.exec(`
				INSERT INTO class_student (classid, studentid) VALUES (${j}, ${i + 5});`
			)
		}
	}

	await db.exec(`
   	INSERT INTO topics (topicid, classid, topicname) VALUES (1, 1, 'Basic Trigonometry');
		INSERT INTO topics (topicid, classid, topicname) VALUES (2, 1, 'Quadratic Equations');
		INSERT INTO topics (topicid, classid, topicname) VALUES (3, 1, 'Coordinate Geometry');
		INSERT INTO topics (topicid, classid, topicname) VALUES (4, 2, 'Circle Geometry');
		INSERT INTO topics (topicid, classid, topicname) VALUES (5, 2, 'Further Trigonometry');
		INSERT INTO topics (topicid, classid, topicname) VALUES (6, 2, 'Non Linear Geometry');
		INSERT INTO topics (topicid, classid, topicname) VALUES (7, 3, 'Solving Inequalities');
		INSERT INTO topics (topicid, classid, topicname) VALUES (8, 3, 'Projectile Motion');
		INSERT INTO topics (topicid, classid, topicname) VALUES (9, 3, 'Differentiation');
		INSERT INTO topics (topicid, classid, topicname) VALUES (10, 4, 'Integration');
		INSERT INTO topics (topicid, classid, topicname) VALUES (11, 4, 'Simple Harmonic Equation');
		INSERT INTO topics (topicid, classid, topicname) VALUES (12, 4, 'Mechanics');

		INSERT INTO topics (topicid, classid, topicname) VALUES (13, 5, 'Creative Writing');
		INSERT INTO topics (topicid, classid, topicname) VALUES (14, 5, 'Macbeth');
		INSERT INTO topics (topicid, classid, topicname) VALUES (15, 5, 'Rime of the Ancient Mariner');
		INSERT INTO topics (topicid, classid, topicname) VALUES (16, 6, 'Creative Writing');
		INSERT INTO topics (topicid, classid, topicname) VALUES (17, 6, 'Macbeth');
		INSERT INTO topics (topicid, classid, topicname) VALUES (18, 6, 'Rime of the Ancient Mariner');

		INSERT INTO topics (topicid, classid, topicname) VALUES (19, 7, 'Ecosystems');
		INSERT INTO topics (topicid, classid, topicname) VALUES (20, 7, 'Cells');
		INSERT INTO topics (topicid, classid, topicname) VALUES (21, 7, 'Periodic Table');
		INSERT INTO topics (topicid, classid, topicname) VALUES (22, 8, 'Ecosystems');
		INSERT INTO topics (topicid, classid, topicname) VALUES (23, 8, 'Cells');
		INSERT INTO topics (topicid, classid, topicname) VALUES (24, 8, 'Periodic Table');
		INSERT INTO topics (topicid, classid, topicname) VALUES (25, 9, 'Ecosystems');
		INSERT INTO topics (topicid, classid, topicname) VALUES (26, 9, 'Cells');
		INSERT INTO topics (topicid, classid, topicname) VALUES (27, 9, 'Periodic Table');
	`);
	
  return db;
}

