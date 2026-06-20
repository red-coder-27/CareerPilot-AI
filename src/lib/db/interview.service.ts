import { prisma } from '../prisma';
import fs from 'fs';
import path from 'path';
import { InterviewSessionDTO } from '@/types/database';
import { InterviewQuestion } from '@/types';

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

export async function saveInterviewSession(
  analysisId: string,
  targetRole: string,
  questions: InterviewQuestion[],
  userId?: string
): Promise<InterviewSessionDTO> {
  try {
    const session = await prisma.interviewSession.create({
      data: {
        analysis: { connect: { id: analysisId } },
        targetRole,
        questions: questions as any,
        userAnswers: {},
        feedback: {},
        user: userId ? { connect: { id: userId } } : undefined
      }
    });
    return {
      ...session,
      questions: session.questions as unknown as InterviewQuestion[],
      userAnswers: session.userAnswers as Record<number, string>,
      feedback: session.feedback as Record<number, any>
    };
  } catch (e) {
    console.warn('Prisma saveInterviewSession failed, using local fallback:', e);
    const db = readLocalDb();
    const session: InterviewSessionDTO = {
      id: Math.random().toString(36).substring(2, 9),
      analysisId,
      targetRole,
      questions,
      userAnswers: {},
      feedback: {},
      overallScore: null,
      userId: userId || null,
      createdAt: new Date()
    } as any;
    db.interviewSessions.push(session);
    writeLocalDb(db);
    return session;
  }
}

export async function updateInterviewSession(
  id: string,
  userAnswers: Record<number, string>,
  feedback: Record<number, any>,
  overallScore: number
): Promise<InterviewSessionDTO | null> {
  try {
    const session = await prisma.interviewSession.update({
      where: { id },
      data: {
        userAnswers: userAnswers as any,
        feedback: feedback as any,
        overallScore
      }
    });
    return {
      ...session,
      questions: session.questions as unknown as InterviewQuestion[],
      userAnswers: session.userAnswers as Record<number, string>,
      feedback: session.feedback as Record<number, any>
    };
  } catch (e) {
    console.warn('Prisma updateInterviewSession failed, using local fallback:', e);
    const db = readLocalDb();
    const session = db.interviewSessions.find((s: any) => s.id === id);
    if (session) {
      session.userAnswers = userAnswers;
      session.feedback = feedback;
      session.overallScore = overallScore;
      writeLocalDb(db);
      return {
        ...session,
        createdAt: new Date(session.createdAt)
      };
    }
    return null;
  }
}

export async function getInterviewSession(id: string, userId?: string): Promise<InterviewSessionDTO | null> {
  try {
    const session = await prisma.interviewSession.findFirst({
      where: { 
        id,
        ...(userId ? { userId } : {})
      }
    });
    if (!session) return null;
    return {
      ...session,
      questions: session.questions as unknown as InterviewQuestion[],
      userAnswers: session.userAnswers as Record<number, string>,
      feedback: session.feedback as Record<number, any>
    };
  } catch (e) {
    console.warn('Prisma getInterviewSession failed, using local fallback:', e);
    const db = readLocalDb();
    const session = db.interviewSessions.find((s: any) => s.id === id && (!userId || s.userId === userId));
    if (!session) return null;
    return {
      ...session,
      createdAt: new Date(session.createdAt)
    };
  }
}

export async function getInterviewSessionsForAnalysis(analysisId: string, userId?: string): Promise<InterviewSessionDTO[]> {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: { 
        analysisId,
        ...(userId ? { userId } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
    return sessions.map(s => ({
      ...s,
      questions: s.questions as unknown as InterviewQuestion[],
      userAnswers: s.userAnswers as Record<number, string>,
      feedback: s.feedback as Record<number, any>
    }));
  } catch (e) {
    console.warn('Prisma getInterviewSessionsForAnalysis failed, using local fallback:', e);
    const db = readLocalDb();
    return db.interviewSessions
      .filter((s: any) => s.analysisId === analysisId && (!userId || s.userId === userId))
      .map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt)
      }))
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function getAllInterviewSessions(userId?: string): Promise<InterviewSessionDTO[]> {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' }
    });
    return sessions.map(s => ({
      ...s,
      questions: s.questions as unknown as InterviewQuestion[],
      userAnswers: s.userAnswers as Record<number, string>,
      feedback: s.feedback as Record<number, any>
    }));
  } catch (e) {
    console.warn('Prisma getAllInterviewSessions failed, using local fallback:', e);
    const db = readLocalDb();
    return db.interviewSessions
      .filter((s: any) => !userId || s.userId === userId)
      .map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt)
      }))
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
