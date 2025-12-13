import { Request, Response, NextFunction } from "express";
// Import saveSessions helper
import { tryOnSessions, createSessionId, saveSessions } from "../data/tryOnSessions.js";
import type { TryOnSession } from "../types/types.js";
import path from "path";
import fs from 'fs'
import { generateTryOn } from "../services/gemini.js";
import { ApiError } from "@google/genai";



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
        originUserImageUrl: userImageUrl,
        selectedItems: clothingImageUrl,
        resultImageUrl: null, // No result image yet.
        status: 'pending'   // Session is not processed yet. 
    };

    tryOnSessions.push(newSession);
    saveSessions(); // Save immediately so we don't lose the pending session

    // Convert URLs to local paths for the service
    const toLocalPath = (url: string) => {
        if(!url) return ''
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        return path.join(process.cwd(), cleanUrl)
    }

    // Process images in background
    try{
        const userPath = toLocalPath(newSession.originUserImageUrl);
        const clothingPaths = newSession.selectedItems.map((item: any) => {

            if (typeof item === 'string') {
                 return toLocalPath(item);
             }

             return toLocalPath(item.imageUrl)

        })


        console.log("Starting image generation with Gemini...")

        const result: any = await generateTryOn(userPath, clothingPaths)

        if(result.type === 'image' && result.data) {
            // Save generated image
            const resultFilename = `result-${id}.png`
            const resultPath = path.join(process.cwd(), 'uploads', 'others', resultFilename);
            fs.writeFileSync(resultPath, Buffer.from(result.data, 'base64'))

            newSession.resultImageUrl = `/uploads/others/${resultFilename}`
            newSession.status = 'completed'
            saveSessions(); // Save on success
        }else if(result.type === 'text'){
            console.log("Gemini returned text instead of image:", result.text)
            newSession.status = "failed"
            saveSessions(); // Save on failure
        }else{
            console.log("Unknown response type from Gemini")
            newSession.status = "failed"
            saveSessions(); // Save on failure
        }

    }catch(apiError){
        console.error("Failed to process try-on", apiError)
        newSession.status = "failed"
        saveSessions(); // Save on error
    }

// Save this session into our "database" array
    return res.status(201).json(newSession);
          
    } catch(err) {
        return next(err)
    }
};

//GET /api/try-on
export const getAllTryOnSessions = (_req: Request, res: Response, next: NextFunction) => {
    try {
        // Filter sessions that have a result image
        const completedSessions = tryOnSessions.filter(session => session.status === 'completed' || session.resultImageUrl);
        return res.status(200).json(completedSessions);
    } catch (error) {
        return next(error);
    }
};

//api/try-on/:id/continue

export const continueTryOnSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { clothingImageUrl } = req.body;

    const session = tryOnSessions.find(s => s.id === id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    if (!Array.isArray(clothingImageUrl) || clothingImageUrl.length === 0) {
      return res.status(400).json({ error: 'clothingImageUrl array is required' });
    }

    const normalizedNewItems = clothingImageUrl.map((item: any) => {
      if (typeof item === 'string') return { imageUrl: item, category: 'top' };
      return { imageUrl: item.imageUrl, category: item.category ?? 'top' };
    });

    session.selectedItems = [...session.selectedItems, ...normalizedNewItems];
    session.status = 'processing';

    const toLocalPath = (url: string) => {
      if (!url) return '';
      const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
      return path.join(process.cwd(), cleanUrl);
    };

    try {
      const userPath = toLocalPath(session.originUserImageUrl);
      const clothingPaths = session.selectedItems.map(item => toLocalPath(item.imageUrl));

      const result: any = await generateTryOn(userPath, clothingPaths);

      if (result.type === 'image' && result.data) {
        const resultFilename = `result-${id}-${Date.now()}.png`;
        const resultPath = path.join(process.cwd(), 'uploads', 'others', resultFilename);
        fs.writeFileSync(resultPath, Buffer.from(result.data, 'base64'));

        session.resultImageUrl = `/uploads/others/${resultFilename}`;
        session.status = 'completed';
      } else {
        session.status = 'failed';
      }
    } catch (error) {
      console.error('Failed to process continue try-on', error);
      session.status = 'failed';
    }

    return res.status(200).json(session);
  } catch (error) {
    return next(error);
  }
}

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

