import { prisma } from '../prisma';
import fs from 'fs';
import path from 'path';
import { ATSReportDTO } from '@/types/database';

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

export async function saveATSReport(
  structureScore: number,
  formattingScore: number,
  keywordDensityScore: number,
  contactInfoPresent: boolean,
  risks: string[],
  recommendations: string[]
): Promise<ATSReportDTO> {
  try {
    const report = await prisma.aTSReport.create({
      data: {
        structureScore,
        formattingScore,
        keywordDensityScore,
        contactInfoPresent,
        risks: risks as any,
        recommendations: recommendations as any
      }
    });
    return {
      ...report,
      risks: (report.risks as string[]) || [],
      recommendations: (report.recommendations as string[]) || []
    };
  } catch (e) {
    console.warn('Prisma saveATSReport failed, using local fallback:', e);
    const db = readLocalDb();
    const report: ATSReportDTO = {
      id: Math.random().toString(36).substring(2, 9),
      structureScore,
      formattingScore,
      keywordDensityScore,
      contactInfoPresent,
      risks,
      recommendations
    };
    db.atsReports.push(report);
    writeLocalDb(db);
    return report;
  }
}

export async function getATSReport(id: string): Promise<ATSReportDTO | null> {
  try {
    const report = await prisma.aTSReport.findUnique({
      where: { id }
    });
    if (!report) return null;
    return {
      ...report,
      risks: (report.risks as string[]) || [],
      recommendations: (report.recommendations as string[]) || []
    };
  } catch (e) {
    console.warn('Prisma getATSReport failed, using local fallback:', e);
    const db = readLocalDb();
    return db.atsReports.find((r: any) => r.id === id) || null;
  }
}
