import { prisma } from './prisma';
import fs from 'fs';
import path from 'path';

// Local JSON File Database Fallback
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
        resumeVersions: [],
        verifiedResources: []
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
      resumeVersions: [],
      verifiedResources: []
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

// Re-export new modular service methods
export {
  saveResume,
  getResume,
  saveResumeVersion,
  getResumeVersions
} from './db/resume.service';

export {
  saveAnalysis,
  getAnalysis,
  getAnalysesForResume,
  getAllAnalyses
} from './db/analysis.service';

export {
  saveRoadmap,
  getRoadmap
} from './db/roadmap.service';

export {
  saveATSReport,
  getATSReport
} from './db/ats.service';

export {
  saveExplainableAI,
  getExplainableAI
} from './db/explainable.service';

export {
  saveCareerPath,
  getCareerPath
} from './db/career.service';

export {
  saveInterviewSession,
  saveInterviewSession as createInterviewSession, // Alias for backward compatibility
  updateInterviewSession,
  getInterviewSession,
  getInterviewSessionsForAnalysis,
  getAllInterviewSessions
} from './db/interview.service';

// Core operations maintained in entry point
export async function getOrCreateUserProfile(email: string, name?: string, githubUrl?: string) {
  try {
    let profile = await prisma.user.findUnique({
      where: { email }
    });
    if (!profile) {
      profile = await prisma.user.create({
        data: { email, name, githubUrl }
      });
    } else if (githubUrl && profile.githubUrl !== githubUrl) {
      profile = await prisma.user.update({
        where: { email },
        data: { githubUrl }
      });
    }
    return profile;
  } catch (e) {
    console.warn('Postgres profile query failed, using local fallback:', e);
    const db = readLocalDb();
    let profile = db.userProfiles.find((p: any) => p.email === email);
    if (!profile) {
      profile = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name: name || null,
        githubUrl: githubUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.userProfiles.push(profile);
      writeLocalDb(db);
    } else if (githubUrl) {
      profile.githubUrl = githubUrl;
      profile.updatedAt = new Date().toISOString();
      writeLocalDb(db);
    }
    return profile;
  }
}

export async function getVerifiedResource(url: string) {
  try {
    return await prisma.verifiedResource.findUnique({
      where: { url }
    });
  } catch (e) {
    console.warn('Prisma getVerifiedResource failed, using local fallback:', e);
    const db = readLocalDb();
    db.verifiedResources = db.verifiedResources || [];
    return db.verifiedResources.find((r: any) => r.url === url) || null;
  }
}

export async function saveVerifiedResource(url: string, verified: boolean, title?: string) {
  try {
    return await prisma.verifiedResource.upsert({
      where: { url },
      update: { verified, title, lastChecked: new Date() },
      create: { url, verified, title }
    });
  } catch (e) {
    console.warn('Prisma saveVerifiedResource failed, using local fallback:', e);
    const db = readLocalDb();
    db.verifiedResources = db.verifiedResources || [];
    const idx = db.verifiedResources.findIndex((r: any) => r.url === url);
    const record = {
      id: Math.random().toString(36).substring(2, 9),
      url,
      verified,
      title: title || null,
      lastChecked: new Date().toISOString()
    };
    if (idx > -1) {
      db.verifiedResources[idx] = record;
    } else {
      db.verifiedResources.push(record);
    }
    writeLocalDb(db);
    return record;
  }
}
