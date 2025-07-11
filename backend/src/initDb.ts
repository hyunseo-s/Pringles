import { getDbConnection } from "./db";

export const initDB = async () => {
  const db = await getDbConnection();

	// Drop all existing tables
  await db.exec(`
    DROP TABLE IF EXISTS users;
    -- Add additional DROP statements for other tables here if needed
    DROP TABLE IF EXISTS classes;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS topics;
    DROP TABLE IF EXISTS sessions;
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      userid INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
      nameFirst TEXT NOT NULL,
      nameLast TEXT NOT NULL,
      profileImg TEXT,
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
    CREATE TABLE IF NOT EXISTS topics (
      topicid INTEGER PRIMARY KEY AUTOINCREMENT,
      classid INTEGER NOT NULL,
      topicname TEXT NOT NULL,
			FOREIGN KEY(classid) REFERENCES classes(classid)
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
  
  return db;
}

