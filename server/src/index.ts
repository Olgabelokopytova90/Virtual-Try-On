import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tryOnRouter } from './routes/tryOnRoute.js';
import uploadRouter from "./routes/uploadRoutes.js"
import path from "path"
import fs from 'fs';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/users', 'uploads/clothing', 'uploads/others'];
uploadDirs.forEach(dir => {
  const dirPath = path.resolve(dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
});

//static for uploaded files
app.use('/uploads', express.static(path.resolve('uploads')))

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the server!');
});

//health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

//try-on endpoint
app.use('/api/try-on', tryOnRouter);

//upload endpoint
app.use("/api", uploadRouter)

//error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message})
})

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
