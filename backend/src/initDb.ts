import { getDbConnection } from "./db";

export const initDB = async () => {
  const db = await getDbConnection();

	// Drop all existing tables
  await db.exec(`
    DROP TABLE IF EXISTS class_student;
		DROP TABLE IF EXISTS class_teacher;
		DROP TABLE IF EXISTS classes;
    DROP TABLE IF EXISTS question_answerq;
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
      type STRING NOT NULL,
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
      sessionid INTEGER NOT NULL,
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

  await db.exec(`
    CREATE TABLE IF NOT EXISTS question_answerq (
      questionid INTEGER NOT NULL,
      answer STRING NOT NULL,
      correct BOOLEAN NOT NULL,
      PRIMARY KEY(questionid, correct)
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

	// Insert topics
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

	
	// Insert topic student levels into Year 9 Maths
	for (let i = 3; i <= 50; i++ ) {
		await db.exec(`
			INSERT INTO topic_student (topicid, studentid, level) VALUES (1, ${i}, ${Math.random() * 10});
			INSERT INTO topic_student (topicid, studentid, level) VALUES (2, ${i}, ${Math.random() * 10});
			INSERT INTO topic_student (topicid, studentid, level) VALUES (3, ${i}, ${Math.random() * 10});
		`);
	}

	// Insert questions
	await db.exec(`
		-- Basic Trigonometry (topicid: 1)
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (1, 1, 'What is $\\sin(30^\\circ)$?', 1, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (2, 1, 'Given a right triangle with opposite side 3 and hypotenuse 5, find $\\sin(\\theta)$.', 3, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (3, 1, 'Convert $45^\\circ$ to radians.', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (4, 1, 'Solve for $\\theta$: $\\tan(\\theta) = 1$, where $0^\\circ \\leq \\theta < 360^\\circ$.', 4, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (5, 1, 'If $\\cos(\\theta) = 0.5$ and $\\theta$ is in the first quadrant, find $\\theta$ in degrees.', 5, 'written', 0, 0);

-- Quadratic Equations (topicid: 2)
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (6, 2, 'Solve: $x^2 - 5x + 6 = 0$.', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (7, 2, 'Find the discriminant of $x^2 + 4x + 4$.', 3, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (8, 2, 'Sketch the graph of $y = x^2 - 2x - 3$ and label the intercepts.', 6, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (9, 2, 'Find the roots of $2x^2 + 3x - 5 = 0$.', 4, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (10, 2, 'Given the roots of a quadratic are 2 and -3, write the equation in standard form.', 5, 'written', 0, 0);

-- Coordinate Geometry (topicid: 3)
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (11, 3, 'Find the gradient of the line through $(2, 3)$ and $(5, 7)$.', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (12, 3, 'Find the equation of the line with gradient 2 passing through $(1, 4)$.', 3, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (13, 3, 'Are the lines $y = 2x + 1$ and $y = 2x - 3$ parallel?', 1, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (14, 3, 'Find the midpoint of the segment joining $(4, -1)$ and $(-2, 3)$.', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (15, 3, 'Show that the triangle formed by $(0,0)$, $(4,0)$, and $(2,3)$ is isosceles.', 5, 'written', 0, 0);

-- Circle Geometry (topicid: 4)
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (16, 4, 'What angle does a diameter subtend at the circumference of a circle?', 1, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (17, 4, 'Find the area of a circle with radius $7\\text{ cm}$.', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (18, 4, 'Prove that opposite angles of a cyclic quadrilateral sum to $180^\\circ$.', 6, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (19, 4, 'Find the arc length of a sector with radius $10\\text{ cm}$ and angle $60^\\circ$.', 4, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (20, 4, 'A tangent is drawn from a point $5\\text{ cm}$ from a circles center. If the radius is $3\\text{ cm}$, find the tangent length.', 7, 'written', 0, 0);

-- Further Trigonometry (topicid: 5)
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (21, 5, 'Given $\\sin(\\theta) = 0.6$, use $\\sin^2(\\theta) + \\cos^2(\\theta) = 1$ to find $\\cos(\\theta)$.', 3, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (22, 5, 'Solve: $2\\sin(\\theta) = \\sqrt{3}$ for $0^\\circ \\leq \\theta < 360^\\circ$.', 6, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (23, 5, 'Find all $\\theta$ such that $\\cos(2\\theta) = 0.5$ within $0^\\circ \\leq \\theta < 360^\\circ$.', 8, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (24, 5, 'Derive the double angle identity for $\\sin(2\\theta)$.', 7, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (25, 5, 'Prove the identity: $1 + \\tan^2(\\theta) = \\sec^2(\\theta)$.', 5, 'written', 0, 0);

-- Non Linear Geometry (topicid: 6)
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (26, 6, 'Find the distance between $(3, 4)$ and $(-1, -2)$.', 3, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (27, 6, 'Find the gradient of $y = x^2$ at $x = 2$.', 5, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (28, 6, 'Find the point(s) of intersection between $y = x^2$ and $y = 2x + 3$.', 6, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (29, 6, 'Sketch the graph of $y = \\sqrt{x}$ and state its domain.', 4, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (30, 6, 'Describe the symmetry and asymptotes of the curve $y = \\frac{1}{x}$.', 7, 'written', 0, 0);

-- Ecosystems (topicid: 19)
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (31, 19, 'Define a food chain and give an example involving at least three organisms.', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (32, 19, 'Explain the role of decomposers in an ecosystem.', 3, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (33, 19, 'Draw and label a basic carbon cycle including photosynthesis and respiration.', 4, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (34, 19, 'What is meant by the term "trophic level"? Give an example.', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (35, 19, 'Explain how energy is transferred and lost between trophic levels using a pyramid of energy.', 5, 'written', 0, 0);

-- Cells (topicid: 20)
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (36, 20, 'Label the parts of a typical animal cell and describe their functions.', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (37, 20, 'Compare and contrast plant and animal cells using at least three key differences.', 3, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (38, 20, 'Describe the function of mitochondria and relate it to cellular respiration: $\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{energy}$.', 4, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (39, 20, 'What is the role of ribosomes in protein synthesis?', 3, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (40, 20, 'Explain why red blood cells lack nuclei and how this helps their function.', 4, 'written', 0, 0);

-- Periodic Table (topicid: 21)
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (41, 21, 'What do elements in the same group of the periodic table have in common?', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (42, 21, 'Describe the trend in reactivity down Group 1 (alkali metals).', 3, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (43, 21, 'What is the atomic number and what does it represent in terms of protons and electrons?', 2, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (44, 21, 'Balance the chemical equation: $\\text{Na} + \\text{H}_2\\text{O} \\rightarrow \\text{NaOH} + \\text{H}_2$', 5, 'written', 0, 0);
INSERT INTO questions (questionid, topicid, question, level, type, numRight, numWrong) VALUES (45, 21, 'Explain why noble gases in Group 18 are chemically unreactive.', 4, 'written', 0, 0);
	`);

	

  return db;
}

