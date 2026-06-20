import { prisma } from '../prisma';
import fs from 'fs';
import path from 'path';
import { RoadmapDTO } from '@/types/database';
import { RoadmapPlan } from '@/types';

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

export async function saveRoadmap(
  plan30Days: RoadmapPlan,
  plan60Days: RoadmapPlan,
  plan90Days: RoadmapPlan
): Promise<RoadmapDTO> {
  try {
    const roadmap = await prisma.roadmap.create({
      data: {
        plan30Days: plan30Days as any,
        plan60Days: plan60Days as any,
        plan90Days: plan90Days as any
      }
    });
    return roadmap as unknown as RoadmapDTO;
  } catch (e) {
    console.warn('Prisma saveRoadmap failed, using local fallback:', e);
    const db = readLocalDb();
    const roadmap: RoadmapDTO = {
      id: Math.random().toString(36).substring(2, 9),
      plan30Days,
      plan60Days,
      plan90Days
    };
    db.roadmaps.push(roadmap);
    writeLocalDb(db);
    return roadmap;
  }
}

export async function getRoadmap(id: string): Promise<RoadmapDTO | null> {
  try {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id }
    });
    return roadmap as unknown as RoadmapDTO | null;
  } catch (e) {
    console.warn('Prisma getRoadmap failed, using local fallback:', e);
    const db = readLocalDb();
    return db.roadmaps.find((r: any) => r.id === id) || null;
  }
}
