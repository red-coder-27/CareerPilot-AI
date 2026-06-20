import { prisma } from '../prisma';
import fs from 'fs';
import path from 'path';
import { ResumeDTO, ResumeVersionDTO } from '@/types/database';

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

export async function saveResume(
  filename: string,
  mimeType: string,
  sizeBytes: number,
  parsedText: string,
  userId?: string
): Promise<ResumeDTO> {
  try {
    const resume = await prisma.resume.create({
      data: {
        filename,
        mimeType,
        sizeBytes,
        parsedText,
        userId: userId || null
      }
    });
    return resume;
  } catch (e) {
    console.warn('Postgres saveResume failed, using local fallback:', e);
    const db = readLocalDb();
    const resume: ResumeDTO = {
      id: Math.random().toString(36).substring(2, 9),
      filename,
      mimeType,
      sizeBytes,
      parsedText,
      userProfileId: null,
      userId: userId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any;
    db.resumes.push(resume);
    writeLocalDb(db);
    return resume;
  }
}

export async function getResume(id: string, userId?: string): Promise<any> {
  try {
    return await prisma.resume.findFirst({
      where: { 
        id,
        ...(userId ? { userId } : {})
      },
      include: { analyses: true, versions: true }
    });
  } catch (e) {
    console.warn('Postgres getResume failed, using local fallback:', e);
    const db = readLocalDb();
    const resume = db.resumes.find((r: any) => r.id === id && (!userId || r.userId === userId));
    if (!resume) return null;
    
    const analyses = db.analyses.filter((a: any) => a.resumeId === id && (!userId || a.userId === userId));
    const versions = db.resumeVersions.filter((v: any) => v.resumeId === id && (!userId || v.userId === userId));
    return { ...resume, analyses, versions };
  }
}

export async function saveResumeVersion(
  resumeId: string,
  versionNumber: number,
  label: string,
  contentText: string,
  originalScore: number,
  improvedScore: number,
  skillCoverageScore: number,
  improvements: string[],
  userId?: string
): Promise<ResumeVersionDTO> {
  try {
    const version = await prisma.resumeVersion.create({
      data: {
        resume: { connect: { id: resumeId } },
        versionNumber,
        label,
        contentText,
        originalScore,
        improvedScore,
        skillCoverageScore,
        improvements,
        user: userId ? { connect: { id: userId } } : undefined
      }
    });
    return {
      ...version,
      improvements: (version.improvements as string[]) || []
    };
  } catch (e) {
    console.warn('Prisma saveResumeVersion failed, using local fallback:', e);
    const db = readLocalDb();
    const version: ResumeVersionDTO = {
      id: Math.random().toString(36).substring(2, 9),
      resumeId,
      versionNumber,
      label,
      contentText,
      originalScore,
      improvedScore,
      skillCoverageScore,
      improvements,
      userId: userId || null,
      createdAt: new Date()
    } as any;
    db.resumeVersions.push(version);
    writeLocalDb(db);
    return version;
  }
}

export async function getResumeVersions(resumeId: string, userId?: string): Promise<ResumeVersionDTO[]> {
  try {
    const versions = await prisma.resumeVersion.findMany({
      where: { 
        resumeId,
        ...(userId ? { userId } : {})
      },
      orderBy: { versionNumber: 'asc' }
    });
    return versions.map(v => ({
      ...v,
      improvements: (v.improvements as string[]) || []
    }));
  } catch (e) {
    console.warn('Prisma getResumeVersions failed, using local fallback:', e);
    const db = readLocalDb();
    return db.resumeVersions
      .filter((v: any) => v.resumeId === resumeId && (!userId || v.userId === userId))
      .sort((a: any, b: any) => a.versionNumber - b.versionNumber)
      .map((v: any) => ({
        ...v,
        createdAt: new Date(v.createdAt)
      }));
  }
}
