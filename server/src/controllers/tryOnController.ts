import { Request, Response, NextFunction } from "express";
//import in-memory array and fn to create unique id
import { tryOnSessions, createSessionId } from "../data/tryOnSessions.js";
import type { TryOnSession } from "../types/types.js";


//POST /api/try-on
export const createTryOnSession = async (req: Request, res: Response, next: NextFunction) => {

    try{

    const { userImageUrl, clothingImageUrl } = req.body
    //Get values sent from the frontend

    if(!userImageUrl || !Array.isArray(clothingImageUrl) || clothingImageUrl.length === 0) {
        return res.status(400).json({
            error: 'userImageUrl and clothingImageUrl are required'
        });
    };

     // Create a unique ID for this try-on session.
    const id = createSessionId();

    const newSession: TryOnSession = {
        id,
        userImageUrl,
        clothingImageUrl,
        resultImageUrl: null, // No result image yet.
        status: 'pending'   // Session is not processed yet. 
    };

    tryOnSessions.push(newSession);
// Save this session into our "database" array
    return res.status(201).json(newSession);
          
    } catch(err) {
        return next(err)
    }
};

//GET /api/try-on/:id

export const getTryOnSessionById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

    const session = tryOnSessions.find((ses) => ses.id === id);
//find a session with matching id
    if(!session) {
        return res.status(404).json({
            error: 'Try-on session not found'
        })
    };

    return res.status(200).json(session)
    } catch (error) {
        return next(error)
    }
};