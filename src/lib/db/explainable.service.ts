import { prisma } from '../prisma';
import fs from 'fs';
import path from 'path';
import { ExplainableAIDTO } from '@/types/database';

const DB_FILE_PATH = path.join(process.cwd(), 'db.json');

function readLocalDb(): any {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initialDb = {
        userProfiles: [],
        resumes: [],
        analyses: [],
        atsReports: [],
        roadmaps: [],
        careerPaths: [],
        explainableAIs: [],
        interviewSessions: [],
        resumeVersions: []
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return {
      userProfiles: [],
      resumes: [],
      analyses: [],
      atsReports: [],
      roadmaps: [],
      careerPaths: [],
      explainableAIs: [],
      interviewSessions: [],
      resumeVersions: []
    };
  }
}

function writeLocalDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write to local DB file:', e);
  }
}

export async function saveExplainableAI(
  extractionLogic: string,
  roadmapReasoning: string,
  atsLogic: string,
  skillGapJustification: string
): Promise<ExplainableAIDTO> {
  try {
    const explainable = await prisma.explainableAI.create({
      data: {
        extractionLogic,
        roadmapReasoning,
        atsLogic,
        skillGapJustification
      }
    });
    return explainable;
  } catch (e) {
    console.warn('Prisma saveExplainableAI failed, using local fallback:', e);
    const db = readLocalDb();
    const explainable: ExplainableAIDTO = {
      id: Math.random().toString(36).substring(2, 9),
      extractionLogic,
      roadmapReasoning,
      atsLogic,
      skillGapJustification
    };
    db.explainableAIs.push(explainable);
    writeLocalDb(db);
    return explainable;
  }
}

export async function getExplainableAI(id: string): Promise<ExplainableAIDTO | null> {
  try {
    return await prisma.explainableAI.findUnique({
      where: { id }
    });
  } catch (e) {
    console.warn('Prisma getExplainableAI failed, using local fallback:', e);
    const db = readLocalDb();
    return db.explainableAIs.find((x: any) => x.id === id) || null;
  }
}
