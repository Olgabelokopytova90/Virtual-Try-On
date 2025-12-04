import { TryOnSession } from "../types/types.js";
import { nanoid } from "nanoid";


export const tryOnSessions : TryOnSession[] = [];

//helper to generate id
export const createSessionId = () => nanoid()
