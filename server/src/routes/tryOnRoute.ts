import { Router } from "express";
import { createTryOnSession, getTryOnSessionById, getAllTryOnSessions, continueTryOnSession } from "../controllers/tryOnController.js";

export const tryOnRouter = Router();

//create a new session
tryOnRouter.post('/', createTryOnSession);

tryOnRouter.post('/:id/continue', continueTryOnSession)

//get all sessions
tryOnRouter.get('/', getAllTryOnSessions);

//get one session
tryOnRouter.get('/:id', getTryOnSessionById);
