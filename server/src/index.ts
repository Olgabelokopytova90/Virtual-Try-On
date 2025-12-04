import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tryOnRouter } from './routes/tryOnRoute.js';
import uploadRouter from "./routes/uploadRoutes.js"
import path from "path"

dotenv.config();

export const app = express();
app.use(express.json());

//static for uploaded files
app.use('/uploads', express.static(path.resolve('uploads')))

const PORT = process.env.PORT || 3000;

app.use(cors());



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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

