import { Router } from "express";
import { createTryOnSession, getTryOnSessionById } from "../controllers/tryOnController.js";

export const tryOnRouter = Router();

//create a new session
tryOnRouter.post('/', createTryOnSession);

//get one session
tryOnRouter.get('/:id', getTryOnSessionById)