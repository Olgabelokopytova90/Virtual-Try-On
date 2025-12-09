import { Request, Response, NextFunction } from "express";
//import in-memory array and fn to create unique id
import { tryOnSessions, createSessionId } from "../data/tryOnSessions.js";
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
        userImageUrl,
        clothingImageUrl,
        resultImageUrl: null, // No result image yet.
        status: 'pending'   // Session is not processed yet. 
    };

    tryOnSessions.push(newSession);


    // Convert URLs to local paths for the service
    const toLocalPath = (url: string) => {
        if(!url) return ''
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        return path.join(process.cwd(), cleanUrl)
    }

    // Process images in background
    try{
        const userPath = toLocalPath(userImageUrl);
        const clothingPaths = clothingImageUrl.map((item: any) => {

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
        }else if(result.type === 'text'){
            console.log("Gemini returned text instead of image:", result.text)
            newSession.status = "failed"
        }else{
            console.log("Unknown response type from Gemini")
            newSession.status = "failed"
        }

    }catch(apiError){
        console.error("Failed to process try-on", apiError)
        newSession.status = "failed"
    }

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

export const getAllTryOnSessions = (req: Request, res: Response, next: NextFunction) => {
try {
    const complited = tryOnSessions.filter((ses) => ses.userImageUrl !== null);

    return res.status(200).json(complited)

} catch (error) {
    return next(error)
}
}