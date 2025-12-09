import { GoogleGenAI } from "@google/genai";
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey})


// Helper to determine mime type
const getMimeType = (filetype: string) => {
    const ext = path.extname(filetype).toLowerCase();
    if(ext === 'png') return 'image/png'
    if(ext === 'jpg' || ext === 'jpeg') return 'image/jpg'
    if(ext === 'webp') return 'image/webp'
    return 'image/jpeg'
}

export const generateTryOn = async (userImagePath: string, clothingImagePaths: string[]) => {


    if (!apiKey) {
        throw new Error("GEMINI API KEY MISSING")
    }

    // Read user image
    const imageData = fs.readFileSync(path.resolve(userImagePath))
    const base64Image = imageData.toString('base64')

    const userImagePart = {
        inlineData: {
            mimeType: getMimeType(userImagePath),
            data: base64Image
        }
    };

    const clothingParts = clothingImagePaths.map(imgPath => {
        const buffer = fs.readFileSync(path.resolve(imgPath))
        return {
            inlineData: {
                mimeType: getMimeType(imgPath),
                data: buffer.toString('base64')
            }
        }
    })

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: [{
                role: 'user',
                parts: [
                    {text: "Generate a photorealistic image of the person in the first image wearing clothing in the subsequent images. Maintain the person's pose, facial features, and the background"},
                    userImagePart,
                    ...clothingParts
                ]
            }
        ]
        });

        const candidates = response.candidates;
        if(candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
            const parts = candidates[0].content.parts

            // Check for image outputs
            const imagePart = parts.find(p => p.inlineData);
            if (imagePart && imagePart.inlineData){
                return {
                    type: 'image',
                    data: imagePart.inlineData.data,
                    mimeType: imagePart.inlineData.mimeType
                }
            }
            // Check for text outputs
            const textPart = parts.find(p => p.text)
            if (textPart){
                return {type: "text", text: textPart.text}
            }
            return {type: 'unknown', response}
        }
    }catch(err){
        console.error("Gemini API error:", err)
        throw err;
    }
}

