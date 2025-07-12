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
		for (let j = 1; j <= 27; j++)  {
			await db.exec(`
				INSERT INTO topic_student (topicid, studentid, level) VALUES (${j}, ${i}, ${Math.random() * 10});
			`);
		}
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

	await db.exec(`
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (1, 31, 100, 3, 'I think food chains are like the weather patterns.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (2, 31, 100, 4, 'A food chain is when animals live together in groups.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (3, 31, 100, 5, 'It shows who eats whom in nature, e.g., plant → deer → lion.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (4, 31, 100, 6, 'Its the DNA of animals that make them a chain.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (5, 31, 100, 7, 'A food chain shows how energy flows, like grass → rabbit → fox.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (6, 31, 100, 8, 'A food chain is a link from producer to top consumer: algae → fish → eagle.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (7, 31, 100, 9, 'I dont know what a food chain is.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (8, 31, 100, 10, 'Energy passes from plant to herbivore to carnivore, like grass → insect → bird.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (9, 32, 100, 3, 'They return essential elements back to the environment.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (10, 32, 100, 4, 'Bacteria and fungi help decompose dead material and keep the ecosystem healthy.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (11, 32, 100, 5, 'Decomposers are plants that grow in dark places.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (12, 32, 100, 6, 'They make food using sunlight like producers.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (13, 32, 100, 7, 'Decomposers break down dead things and recycle nutrients into the soil.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (14, 32, 100, 8, 'Decomposers are at the top of the food chain.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (15, 32, 100, 9, 'Decomposers clean up waste and return matter to the cycle.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (16, 32, 100, 10, 'I dont really know what decomposers do.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (17, 33, 100, 3, 'CO2 is taken in by plants and then cycled back by breathing organisms.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (18, 33, 100, 4, 'I dont understand what the carbon cycle is.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (19, 33, 100, 5, 'Carbon is absorbed by plants in photosynthesis and released by animals through respiration.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (20, 33, 100, 6, 'Its a process only happening in volcanoes.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (21, 33, 100, 7, 'Plants fix carbon, and animals release it again via respiration.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (22, 33, 100, 8, 'It involves turning carbon into gold using sunlight.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (23, 33, 100, 9, 'The cycle moves carbon between atmosphere, plants, and animals.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (24, 33, 100, 10, 'The carbon cycle is when carbon melts into the ground.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (25, 34, 100, 3, 'Plants are in the first trophic level; herbivores are in the second.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (26, 34, 100, 4, 'Not sure what trophic means here.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (27, 34, 100, 5, 'I think its a kind of pyramid structure in rocks.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (28, 34, 100, 6, 'Each trophic level represents a feeding stage, like producer or predator.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (29, 34, 100, 7, 'Trophic level is the position of an organism in a food chain, like primary consumer.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (30, 34, 100, 8, 'Trophic level is a tropical weather event.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (31, 34, 100, 9, 'Its the size of an animal in its habitat.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (32, 34, 100, 10, 'Its the layer in the food chain an organism belongs to.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (33, 35, 100, 3, 'Producers have more energy; top consumers have less.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (34, 35, 100, 4, 'No idea about this pyramid of energy.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (35, 35, 100, 5, 'Only about 10% of energy is passed to the next level.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (36, 35, 100, 6, 'I think energy is constant between levels.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (37, 35, 100, 7, 'Energy increases as you go up the pyramid.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (38, 35, 100, 8, 'The pyramid grows energy for animals to use.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (39, 35, 100, 9, 'Energy decreases at each level due to heat loss and metabolism.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (40, 35, 100, 10, 'Most energy is lost through respiration and waste.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (41, 36, 100, 3, 'The nucleus holds DNA, and cytoplasm is where reactions happen.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (42, 36, 100, 4, 'The nucleus helps with digestion in cells.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (43, 36, 100, 5, 'Only red blood cells have organelles.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (44, 36, 100, 6, 'Mitochondria = energy, nucleus = control, membrane = border.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (45, 36, 100, 7, 'Nucleus controls the cell, mitochondria produce energy, membrane controls entry.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (46, 36, 100, 8, 'Cell membrane protects; mitochondria make ATP; ribosomes build proteins.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (47, 36, 100, 9, 'The animal cell is just a big empty circle.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (48, 36, 100, 10, 'I dont know the cell parts.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (49, 37, 100, 3, 'Plant cells have walls, chloroplasts, and large vacuoles; animals dont.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (50, 37, 100, 4, 'Both plant and animal cells have chloroplasts.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (51, 37, 100, 5, 'Plant cells dont have any organelles.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (52, 37, 100, 6, 'They are completely identical.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (53, 37, 100, 7, 'Im not sure about their differences.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (54, 37, 100, 8, 'Only plant cells have chloroplasts and rigid walls.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (55, 37, 100, 9, 'Plant cells do photosynthesis; animal cells do not.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (56, 37, 100, 10, 'Animal cells are rounder and lack chloroplasts.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (57, 38, 100, 3, 'Mitochondria help in making blood cells.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (58, 38, 100, 4, 'They store water in the cell.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (59, 38, 100, 5, 'Mitochondria release energy from glucose during respiration.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (60, 38, 100, 6, 'They produce ATP using oxygen and glucose.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (61, 38, 100, 7, 'They break down sugar and release energy for the cell.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (62, 38, 100, 8, 'Mitochondria convert chemical energy into usable cellular energy.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (63, 38, 100, 9, 'I think mitochondria are found only in bacteria.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (64, 38, 100, 10, 'No idea about what they do.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (65, 39, 100, 3, 'They are part of the nervous system.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (66, 39, 100, 4, 'I think ribosomes make glucose.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (67, 39, 100, 5, 'Ribosomes help cells reproduce.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (68, 39, 100, 6, 'Not sure what ribosomes do.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (69, 39, 100, 7, 'They translate RNA into proteins.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (70, 39, 100, 8, 'Protein synthesis happens on ribosomes.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (71, 39, 100, 9, 'Ribosomes are where proteins are synthesized from amino acids.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (72, 39, 100, 10, 'Ribosomes build proteins using the cells genetic code.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (73, 40, 100, 3, 'All cells must have a nucleus.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (74, 40, 100, 4, 'Im not sure why they lack a nucleus.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (75, 40, 100, 5, 'They can hold more hemoglobin without a nucleus.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (76, 40, 100, 6, 'No nucleus makes them more flexible for travel.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (77, 40, 100, 7, 'Red blood cells dont need oxygen.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (78, 40, 100, 8, 'More room for oxygen transport since theres no nucleus.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (79, 40, 100, 9, 'They have extra nuclei to store oxygen.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (80, 40, 100, 10, 'No nucleus allows red blood cells to carry more oxygen.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (81, 41, 100, 3, 'They react similarly because of their electron structure.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (82, 41, 100, 4, 'Elements in the same group have the same number of valence electrons.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (83, 41, 100, 5, 'Group means the elements are all metals.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (84, 41, 100, 6, 'I dont know what a group is.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (85, 41, 100, 7, 'Same group = same outer shell configuration.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (86, 41, 100, 8, 'They show similar chemical behavior.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (87, 41, 100, 9, 'They have the same atomic number.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (88, 41, 100, 10, 'Groups are just a way to color code the table.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (89, 42, 100, 3, 'They all have the same reactivity.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (90, 42, 100, 4, 'Group 1 are not reactive at all.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (91, 42, 100, 5, 'They become less reactive down the group.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (92, 42, 100, 6, 'Group 1 elements become more reactive down the group.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (93, 42, 100, 7, 'Potassium is more reactive than lithium.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (94, 42, 100, 8, 'I dont remember the trend.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (95, 42, 100, 9, 'Larger atoms lose electrons more easily down Group 1.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (96, 42, 100, 10, 'Reactivity increases due to weaker attraction to outer electron.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (97, 43, 100, 3, 'It defines an elements identity.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (98, 43, 100, 4, 'No idea about atomic numbers.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (99, 43, 100, 5, 'It represents protons and electrons in a neutral atom.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (100, 43, 100, 6, 'Atomic number is the number of molecules.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (101, 43, 100, 7, 'Atomic number equals the number of protons.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (102, 43, 100, 8, 'It shows how many neutrons are present.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (103, 43, 100, 9, 'Each element has a unique atomic number.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (104, 43, 100, 10, 'Atomic number is how heavy the atom is.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (105, 44, 100, 3, 'I dont understand balancing equations.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (106, 44, 100, 4, 'You just add water to make it work.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (107, 44, 100, 5, 'Na + H2O → NaOH + H2 is already balanced.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (108, 44, 100, 6, 'Balance is not needed in this case.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (109, 44, 100, 7, 'Sodium and water react to form hydroxide and hydrogen gas.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (110, 44, 100, 8, 'Balanced form is 2Na + 2H2O → 2NaOH + H2.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (111, 44, 100, 9, 'Double sodium and water for balance.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (112, 44, 100, 10, '2Na + 2H2O → 2NaOH + H2 is balanced.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (113, 45, 100, 3, 'They are already stable and dont react.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (114, 45, 100, 4, 'I dont know why they dont react.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (115, 45, 100, 5, 'They need more electrons to become stable.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (116, 45, 100, 6, 'They dont gain or lose electrons easily.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (117, 45, 100, 7, 'They are highly reactive metals.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (118, 45, 100, 8, 'Noble gases are unreactive due to full outer shells.', true);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (119, 45, 100, 9, 'Noble gases react a lot with water.', false);
INSERT INTO answers (answerid, questionid, sessionid, studentid, answer, correct) VALUES (120, 45, 100, 10, 'Their stable electron configuration makes them inert.', true);
		`)

  return db;
}

