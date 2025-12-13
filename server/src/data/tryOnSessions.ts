import { TryOnSession } from "../types/types.js";
import { nanoid } from "nanoid";
import fs from 'fs';
import path from 'path';



const DATA_FILE = path.join(process.cwd(), 'data', 'sessions.json');

// Helper to load sessions from disk
const loadSessions = (): TryOnSession[] => {

  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading sessions:", error);
  }
  return [];
};

// Initialize with data from file instead of empty array
export const tryOnSessions : TryOnSession[] = loadSessions();

// Helper to save sessions to disk
export const saveSessions = () => {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(tryOnSessions, null, 2));
    } catch (error) {
        console.error("Error saving sessions:", error);
    }
}

//helper to generate id
export const createSessionId = () => nanoid()
