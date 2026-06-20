import { prisma } from '../prisma';
import fs from 'fs';
import path from 'path';
import { CareerPathDTO } from '@/types/database';
import { CareerPathRole } from '@/types';

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

export async function saveCareerPath(
  currentLevel: string,
  nextRole: CareerPathRole,
  midLevelRole: CareerPathRole,
  seniorRole: CareerPathRole
): Promise<CareerPathDTO> {
  try {
    const careerPath = await prisma.careerPath.create({
      data: {
        currentLevel,
        nextRole: nextRole as any,
        midLevelRole: midLevelRole as any,
        seniorRole: seniorRole as any
      }
    });
    return careerPath as unknown as CareerPathDTO;
  } catch (e) {
    console.warn('Prisma saveCareerPath failed, using local fallback:', e);
    const db = readLocalDb();
    const careerPath: CareerPathDTO = {
      id: Math.random().toString(36).substring(2, 9),
      currentLevel,
      nextRole,
      midLevelRole,
      seniorRole
    };
    db.careerPaths.push(careerPath);
    writeLocalDb(db);
    return careerPath;
  }
}

export async function getCareerPath(id: string): Promise<CareerPathDTO | null> {
  try {
    const careerPath = await prisma.careerPath.findUnique({
      where: { id }
    });
    return careerPath as unknown as CareerPathDTO | null;
  } catch (e) {
    console.warn('Prisma getCareerPath failed, using local fallback:', e);
    const db = readLocalDb();
    return db.careerPaths.find((p: any) => p.id === id) || null;
  }
}
