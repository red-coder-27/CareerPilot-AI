import { prisma } from '../prisma';
import fs from 'fs';
import path from 'path';
import { AnalysisHistoryDTO } from '@/types/database';

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

export async function saveAnalysis(
  resumeId: string,
  targetRole: string,
  analysisData: any,
  userId?: string
): Promise<any> {
  const { atsAnalysis, roadmap, careerPath, explainableAI, ...rest } = analysisData;

  try {
    const analysis = await prisma.analysisHistory.create({
      data: {
        resume: { connect: { id: resumeId } },
        targetRole,
        user: userId ? { connect: { id: userId } } : undefined,
        matchPercentage: rest.roleMatchPercentage || rest.resumeScore || 0,
        resumeScore: rest.resumeScore || 0,
        atsScore: rest.atsScore || 0,
        roleMatchPercentage: rest.roleMatchPercentage || 0,
        industryReadiness: rest.industryReadiness || 'Medium',
        summary: rest.summary || '',
        technicalSkills: rest.technicalSkills || [],
        softSkills: rest.softSkills || [],
        missingSkills: rest.missingSkills || [],
        recommendedSkills: rest.recommendedSkills || [],
        strengths: rest.strengths || [],
        weaknesses: rest.weaknesses || [],
        improvements: rest.improvements || [],
        recommendedRoles: rest.recommendedRoles || [],
        careerSuggestions: rest.careerSuggestions || [],
        interviewQuestions: rest.interviewQuestions || [],
        projects: rest.projects || [],
        
        atsAnalysis: {
          create: {
            structureScore: atsAnalysis.structureScore || 0,
            formattingScore: atsAnalysis.formattingScore || 0,
            keywordDensityScore: atsAnalysis.keywordDensityScore || 0,
            contactInfoPresent: !!atsAnalysis.contactInfoPresent,
            risks: atsAnalysis.risks || [],
            recommendations: atsAnalysis.recommendations || []
          }
        },
        
        roadmap: {
          create: {
            plan30Days: roadmap.plan30Days || {},
            plan60Days: roadmap.plan60Days || {},
            plan90Days: roadmap.plan90Days || {}
          }
        },
        
        careerPath: {
          create: {
            currentLevel: careerPath.currentLevel || '',
            nextRole: careerPath.nextRole || {},
            midLevelRole: careerPath.midLevelRole || {},
            seniorRole: careerPath.seniorRole || {}
          }
        },
        
        explainableAI: {
          create: {
            extractionLogic: explainableAI.extractionLogic || '',
            roadmapReasoning: explainableAI.roadmapReasoning || '',
            atsLogic: explainableAI.atsLogic || '',
            skillGapJustification: explainableAI.skillGapJustification || ''
          }
        }
      } as any,
      include: {
        atsAnalysis: true,
        roadmap: true,
        careerPath: true,
        explainableAI: true
      }
    });
    return analysis;
  } catch (e) {
    console.warn('Prisma saveAnalysis transaction failed, using local fallback:', e);
    
    const db = readLocalDb();
    const analysisId = Math.random().toString(36).substring(2, 9);
    const atsId = Math.random().toString(36).substring(2, 9);
    const roadmapId = Math.random().toString(36).substring(2, 9);
    const pathId = Math.random().toString(36).substring(2, 9);
    const expId = Math.random().toString(36).substring(2, 9);

    const atsRecord = { id: atsId, ...atsAnalysis };
    const roadmapRecord = { id: roadmapId, ...roadmap };
    const pathRecord = { id: pathId, ...careerPath };
    const expRecord = { id: expId, ...explainableAI };

    db.atsReports.push(atsRecord);
    db.roadmaps.push(roadmapRecord);
    db.careerPaths.push(pathRecord);
    db.explainableAIs.push(expRecord);

    const analysisRecord = {
      id: analysisId,
      resumeId,
      targetRole,
      userId: userId || null,
      matchPercentage: rest.roleMatchPercentage || rest.resumeScore || 0,
      resumeScore: rest.resumeScore || 0,
      atsScore: rest.atsScore || 0,
      roleMatchPercentage: rest.roleMatchPercentage || 0,
      industryReadiness: rest.industryReadiness || 'Medium',
      summary: rest.summary || '',
      technicalSkills: rest.technicalSkills || [],
      softSkills: rest.softSkills || [],
      missingSkills: rest.missingSkills || [],
      recommendedSkills: rest.recommendedSkills || [],
      strengths: rest.strengths || [],
      weaknesses: rest.weaknesses || [],
      improvements: rest.improvements || [],
      recommendedRoles: rest.recommendedRoles || [],
      careerSuggestions: rest.careerSuggestions || [],
      interviewQuestions: rest.interviewQuestions || [],
      projects: rest.projects || [],
      atsAnalysisId: atsId,
      roadmapId: roadmapId,
      careerPathId: pathId,
      explainableAIId: expId,
      createdAt: new Date().toISOString()
    };

    db.analyses.push(analysisRecord);
    writeLocalDb(db);

    return {
      ...analysisRecord,
      createdAt: new Date(analysisRecord.createdAt),
      atsAnalysis: atsRecord,
      roadmap: roadmapRecord,
      careerPath: pathRecord,
      explainableAI: expRecord
    };
  }
}

export async function getAnalysis(id: string, userId?: string): Promise<any> {
  try {
    return await prisma.analysisHistory.findFirst({
      where: { 
        id,
        ...(userId ? { userId } : {})
      },
      include: {
        atsAnalysis: true,
        roadmap: true,
        careerPath: true,
        explainableAI: true,
        interviewSessions: true
      }
    });
  } catch (e) {
    console.warn('Prisma getAnalysis failed, using local fallback:', e);
    const db = readLocalDb();
    const analysis = db.analyses.find((a: any) => a.id === id && (!userId || a.userId === userId));
    if (!analysis) return null;

    const atsAnalysis = db.atsReports.find((r: any) => r.id === analysis.atsAnalysisId);
    const roadmap = db.roadmaps.find((r: any) => r.id === analysis.roadmapId);
    const careerPath = db.careerPaths.find((p: any) => p.id === analysis.careerPathId);
    const explainableAI = db.explainableAIs.find((e: any) => e.id === analysis.explainableAIId);
    const interviewSessions = db.interviewSessions.filter((s: any) => s.analysisId === id && (!userId || s.userId === userId));

    return {
      ...analysis,
      createdAt: new Date(analysis.createdAt),
      atsAnalysis,
      roadmap,
      careerPath,
      explainableAI,
      interviewSessions
    };
  }
}

export async function getAnalysesForResume(resumeId: string, userId?: string): Promise<any[]> {
  try {
    return await prisma.analysisHistory.findMany({
      where: { 
        resumeId,
        ...(userId ? { userId } : {})
      },
      orderBy: { createdAt: 'desc' },
      include: {
        atsAnalysis: true,
        roadmap: true,
        careerPath: true
      }
    });
  } catch (e) {
    console.warn('Prisma getAnalysesForResume failed, using local fallback:', e);
    const db = readLocalDb();
    const analyses = db.analyses
      .filter((a: any) => a.resumeId === resumeId && (!userId || a.userId === userId))
      .map((a: any) => {
        const atsAnalysis = db.atsReports.find((r: any) => r.id === a.atsAnalysisId);
        const roadmap = db.roadmaps.find((r: any) => r.id === a.roadmapId);
        const careerPath = db.careerPaths.find((p: any) => p.id === a.careerPathId);
        return {
          ...a,
          createdAt: new Date(a.createdAt),
          atsAnalysis,
          roadmap,
          careerPath
        };
      });
    
    return analyses.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function getAllAnalyses(userId?: string): Promise<any[]> {
  try {
    return await prisma.analysisHistory.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        atsAnalysis: true,
        roadmap: true,
        careerPath: true
      }
    });
  } catch (e) {
    console.warn('Prisma getAllAnalyses failed, using local fallback:', e);
    const db = readLocalDb();
    return db.analyses
      .filter((a: any) => !userId || a.userId === userId)
      .map((a: any) => {
        const atsAnalysis = db.atsReports.find((r: any) => r.id === a.atsAnalysisId);
        const roadmap = db.roadmaps.find((r: any) => r.id === a.roadmapId);
        const careerPath = db.careerPaths.find((p: any) => p.id === a.careerPathId);
        return {
          ...a,
          createdAt: new Date(a.createdAt),
          atsAnalysis,
          roadmap,
          careerPath
        };
      })
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
