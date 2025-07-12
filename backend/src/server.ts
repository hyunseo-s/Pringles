import express, { json, Request, Response } from 'express';
import config from './config.json';
import cors from 'cors';
import process from 'process';
import morgan from 'morgan';
import { initDB } from './initDb';
import { login, register } from './funcs/auth';
import { decodeJWT } from './utils';
import { addStudents, createClass, getClass, getClasses } from './funcs/classes';
import { getQuestions, saveMultipleChoice, saveWrittenResponse, multiAnswerQuestion, endSession, generateQuestion, getLevel, startSession, answerQuestion  } from './funcs/session';
import { addQuestion, createTopics, getStudentsLevels, getStudentTopicData, getTeacherTopicData, getTopics, getTopicName, getTopic } from './funcs/topics';
import { getUser } from './funcs/user';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

app.get('/echo', async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'echo' })
});

// ====================================================================
//  ============================== AUTH ==============================
// ====================================================================

app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const args = req.body;
    const newToken = await register(args);
    res.status(201).json(newToken);
  } catch (error) {
		console.log(error)
    res.status(400).json({ error: error.message })
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    // Check if the token is still valid:
    const { email, password } = req.body;
    const newToken = await login(email, password);
    res.status(200).json(newToken);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});

app.post('/auth/logout', async (req: Request, res: Response) => {
  try {
    // TO DO
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/user', async (req: Request, res: Response) => {
  try {
    // Check if the token is still valid:
    const token = req.header('Authorization').split(" ")[1];
    const userId = decodeJWT(token);
		const json = await getUser(parseInt(userId));
    res.status(200).json(json);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});

// ====================================================================
//  ============================ CLASSES =============================
// ====================================================================

app.get('/classes', async (req: Request, res: Response) => {
  try {
		const token = req.header('Authorization').split(" ")[1];
    const userId = decodeJWT(token);
    const classes = await getClasses(userId);
    res.status(200).json(classes);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/classes/:classId/add', async (req: Request, res: Response) => {
  try {
    console.log(req.params)
    const { classId } = req.params;
    const { students } = req.body;

    console.log(classId)
    const addedStudents = await addStudents(classId, students);
    res.status(200).json(addedStudents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/classes/create', async (req: Request, res: Response) => {
  try {
    const { name, students, classImg } = req.body;
    const token = req.header('Authorization').split(" ")[1];
    const teacherId = decodeJWT(token);
    console.log(teacherId)
    const classId = await createClass(name, students, classImg, teacherId);
    res.status(200).json(classId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/classes/:classId', (req: Request, res: Response) => {
  const { classId } = req.params;
  try {
    const classInfo = getClass(classId);
    res.status(200).json(classInfo);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// app.get('/classes/:classId/data', (req: Request, res: Response) => {
//   const classId = parseInt(req.params.classId);
//   try {
//     const classData = getClassData(classId);
//     res.status(200).json(classData);
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// });


// ====================================================================
//  ============================= TOPICS =============================
// ====================================================================


app.post('/topics/:classId/create', async (req: Request, res: Response) => {
  try {
    const classId = req.params.classId
    const { topics } = req.body;
    const topicId = await createTopics(classId, topics);
    res.status(200).json(topicId);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/topics/:classId', async (req: Request, res: Response) => {
  const classId = parseInt(req.params.classId);
  try {
    const topics = await getTopics(classId);
    res.status(200).json(topics);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/topic/:topicId', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  try {
    const topic = await getTopic(topicId);
    res.status(200).json(topic);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/topic/:topicId/name', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  try {
    const topic = await getTopicName(topicId);
    res.status(200).json(topic);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/topics/:topicId/question', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  const { question, level } = req.body;
  try {
    const questionId = await addQuestion(topicId, level, question);
    res.status(200).json(questionId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/topic/:topicId/teacher/data', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  try {
    const token = req.header('Authorization').split(" ")[1];
    const teacherId = parseInt(decodeJWT(token));
    const topicData = await getTeacherTopicData(teacherId, topicId);
    res.status(200).json(topicData);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/topic/:topicId/student/data', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  try {
    const token = req.header('Authorization').split(" ")[1];
    const studentId = parseInt(decodeJWT(token));
    const topicData = await getStudentTopicData(studentId, topicId);
    res.status(200).json(topicData);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/topic/:classId/students/level', async (req: Request, res: Response) => {
  const classId = parseInt(req.params.classId);
  try {
    const token = req.header('Authorization').split(" ")[1];
    const teacherId = parseInt(decodeJWT(token));
    const topicData = getStudentsLevels(teacherId, classId);
    res.status(200).json(topicData)
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ====================================================================
//  =========================== SESSIONS =============================
// ====================================================================

app.post('/session/:classId/:topicId/start', async (req: Request, res: Response) => {
  try {
    const { classId, topicId } = req.params;
    const token = req.header('Authorization').split(" ")[1];
    const studentId = decodeJWT(token);
    const sessionId = await startSession(classId, topicId, studentId);
    res.status(200).json(sessionId);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});

app.get('/session/:topicId/:sessionId/question', async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;

    const token = req.header('Authorization').split(" ")[1];
    const studentId = decodeJWT(token);

    // Given the topicId and studentId, find the level of that student
    const level = await getLevel(studentId, topicId)

    // get random question that is of the matching topic
    const question = await getQuestions(topicId)

    const studentLevel = level.level

    const easyQuestion = question.easy.question
    const medQuestion = question.medium.question
    const hardQuestion = question.hard.question

    const easyQuestionLevel = easyQuestion.level
    const medQuestionLevel = medQuestion.level
    const hardQuestionLevel = hardQuestion.level

    const topicName = await getTopicName(parseInt(topicId));
    // with the question, generate one of that level (for now multiple choice)
    const newQuestion = await generateQuestion(
      studentLevel, 
      topicId, 
      easyQuestion,
      medQuestion, 
      hardQuestion, 
      easyQuestionLevel, 
      medQuestionLevel,
      hardQuestionLevel,
      topicName
    );

    if (newQuestion.mode == "multiple-choice") {
      
      const res = await saveMultipleChoice(newQuestion.question, topicId, studentLevel)
      console.log(res)

    } else if (newQuestion.mode == "written-response") {

      const res = await saveWrittenResponse(newQuestion.question, topicId, studentLevel)
      console.log(res)
    }

    
    res.status(200).json(newQuestion.question);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/session/:topicId/:sessionId/:questionId/multi/answer', async (req: Request, res: Response) => {
  const { topicId, sessionId, questionId } = req.params;
  const { answer, correct } = req.body;
  const token = req.header('Authorization').split(" ")[1];
  const studentId = parseInt(decodeJWT(token));

  const resObj = {
    studentId,
    topicId: parseInt(topicId),
    sessionId: parseInt(sessionId), 
    questionId: parseInt(questionId), 
    answer,
    correct
  }

  try {
    const result = await multiAnswerQuestion(resObj);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/session/:topicId/:sessionId/:questionId/answer', async (req: Request, res: Response) => {
  const { topicId, sessionId, questionId } = req.params;
  const { answer } = req.body;
  const token = req.header('Authorization').split(" ")[1];
  const studentId = parseInt(decodeJWT(token));

  const resObj = {
    studentId,
    topicId: parseInt(topicId), 
    sessionId: parseInt(sessionId), 
    questionId: parseInt(questionId), 
    answer
  }

  try {
    const result = await answerQuestion(resObj);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/session/:topicId/:sessionId/end', async (req: Request, res: Response) => {
  try {
    const { topicId, sessionId } = req.params;
    const results = await endSession(parseInt(topicId), parseInt(sessionId));
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// start server
const server = app.listen(PORT, HOST, async () => {
	console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
	await initDB();
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});

