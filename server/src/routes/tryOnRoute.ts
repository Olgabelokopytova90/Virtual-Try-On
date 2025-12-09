import { Router } from "express";
import { createTryOnSession, getTryOnSessionById, getAllTryOnSessions } from "../controllers/tryOnController.js";

export const tryOnRouter = Router();

//create a new session
tryOnRouter.post('/', createTryOnSession);

//get all sessions
tryOnRouter.get('/', getAllTryOnSessions);

//get one session
tryOnRouter.get('/:id', getTryOnSessionById)