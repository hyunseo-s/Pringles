import express, { json, Request, Response } from 'express';
import config from './config.json';
import cors from 'cors';
import process from 'process';
// import { login, register } from './funcs/auth';
import morgan from 'morgan';
import { initDB } from './initDb';
import { login, register } from './funcs/auth';

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
})

// ====================================================================
//  =============================== AUTH ==============================
// ====================================================================

app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const args = req.body;
		console.log(args)
    const newToken = await register(args);
    res.status(201).json(newToken);
  } catch (error) {
		console.log(error)
    return res.status(400).json({ error: error.message })
  }
})

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    // Check if the token is still valid:
    const { email, password } = req.body;
    const newToken = await login(email, password);
    res.status(200).json(newToken);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/auth/logout', async (req: Request, res: Response) => {
  try {
    // TO DO
  } catch (error) {
    res.status(400).json({ error: error.message });
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
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);

	initDB()
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});

