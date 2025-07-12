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
<<<<<<< HEAD
    DROP TABLE IF EXISTS answers;
=======
>>>>>>> main
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
    CREATE TABLE IF NOT EXISTS answers (
      answerid INTEGER PRIMARY KEY AUTOINCREMENT,
      questionid INTEGER NOT NULL,
      studentid INTEGER NOT NULL,
      answer TEXT NOT NULL,
      correct BOOLEAN NOT NULL,
      FOREIGN KEY(questionid) REFERENCES question(questionid),
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
<<<<<<< HEAD
=======

	// Insert teachers and students
	await db.exec(`
   	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (1, 'justin@mail.com', 'password', 'Justin', 'Son', 'teacher');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (2, 'ezc@mail.com', 'password', 'Elizabeth', 'Zhu Chan', 'teacher');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (3, 'ivan@mail.com', 'password', 'Ivan', 'Chan', 'student');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (4, 'parker@mail.com', 'password', 'Parker', 'Qiu', 'student');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (5, 'felix@mail.com', 'password', 'Felix', 'Cao', 'student');
	`);

	for (let i = 1; i <= 50; i++) {
		await db.exec(`
			INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (${i + 5}, 'adam${i}@mail.com', 'password', 'Justin', 'Son', 'student');
		`);
	}

	// Insert classes
	await db.exec(`
   	INSERT INTO classes (classid, classname) VALUES (1, 'YEAR 9 MATHS');
		INSERT INTO classes (classid, classname) VALUES (2, 'YEAR 10 MATHS');
		INSERT INTO classes (classid, classname) VALUES (3, 'YEAR 11 MATHS');
		INSERT INTO classes (classid, classname) VALUES (4, 'YEAR 12 MATHS');
		INSERT INTO classes (classid, classname) VALUES (5, 'COMP1511 Wednesday');
		INSERT INTO classes (classid, classname) VALUES (6, 'COMP1511 Thursday');
		INSERT INTO classes (classid, classname) VALUES (7, 'COMP1521 Monday');
		INSERT INTO classes (classid, classname) VALUES (8, 'COMP1521 Tuesday');
		INSERT INTO classes (classid, classname) VALUES (9, 'COMP1531 Friday');
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
  return db;
}
>>>>>>> main

	// Insert teachers and students
	await db.exec(`
   	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (1, 'justin@mail.com', 'password', 'Justin', 'Son', 'teacher');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (2, 'ezc@mail.com', 'password', 'Elizabeth', 'Zhu Chan', 'teacher');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (3, 'ivan@mail.com', 'password', 'Ivan', 'Chan', 'student');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (4, 'parker@mail.com', 'password', 'Parker', 'Qiu', 'student');
	 	INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (5, 'felix@mail.com', 'password', 'Felix', 'Cao', 'student');
	`);

	for (let i = 1; i <= 50; i++) {
		await db.exec(`
			INSERT INTO users (userid, email, password, nameFirst, nameLast, role) VALUES (${i + 5}, 'adam${i}@mail.com', 'password', 'Justin', 'Son', 'student');
		`);
	}

	// Insert classes
	await db.exec(`
   	INSERT INTO classes (classid, classname) VALUES (1, 'YEAR 9 MATHS');
		INSERT INTO classes (classid, classname) VALUES (2, 'YEAR 10 MATHS');
		INSERT INTO classes (classid, classname) VALUES (3, 'YEAR 11 MATHS');
		INSERT INTO classes (classid, classname) VALUES (4, 'YEAR 12 MATHS');
		INSERT INTO classes (classid, classname) VALUES (5, 'COMP1511 Wednesday');
		INSERT INTO classes (classid, classname) VALUES (6, 'COMP1511 Thursday');
		INSERT INTO classes (classid, classname) VALUES (7, 'COMP1521 Monday');
		INSERT INTO classes (classid, classname) VALUES (8, 'COMP1521 Tuesday');
		INSERT INTO classes (classid, classname) VALUES (9, 'COMP1531 Friday');
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
  return db;
}