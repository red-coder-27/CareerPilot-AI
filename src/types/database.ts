import {
  TechnicalSkill,
  MissingSkill,
  ATSAnalysis,
  RoadmapPlan,
  CareerPath as UICareerPath,
  ExplainableAI as UIExplainableAI,
  InterviewQuestion,
  ProjectRecommendation,
  RecruiterPerspective
} from './index';

export interface UserProfileDTO {
  id: string;
  email: string | null;
  name: string | null;
  githubUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResumeDTO {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  parsedText: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ATSReportDTO {
  id: string;
  structureScore: number;
  formattingScore: number;
  keywordDensityScore: number;
  contactInfoPresent: boolean;
  risks: string[]; // JSON Array
  recommendations: string[]; // JSON Array
}

export interface RoadmapDTO {
  id: string;
  plan30Days: RoadmapPlan;
  plan60Days: RoadmapPlan;
  plan90Days: RoadmapPlan;
}

export interface CareerPathDTO {
  id: string;
  currentLevel: string;
  nextRole: any; // CareerPathRole
  midLevelRole: any; // CareerPathRole
  seniorRole: any; // CareerPathRole
}

export interface ExplainableAIDTO {
  id: string;
  extractionLogic: string;
  roadmapReasoning: string;
  atsLogic: string;
  skillGapJustification: string;
}

export interface AnalysisHistoryDTO {
  id: string;
  resumeId: string;
  targetRole: string;
  matchPercentage: number;
  resumeScore: number;
  atsScore: number;
  roleMatchPercentage: number;
  industryReadiness: 'High' | 'Medium' | 'Low';
  summary: string;
  technicalSkills: TechnicalSkill[];
  softSkills: string[];
  missingSkills: MissingSkill[];
  recommendedSkills: TechnicalSkill[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  recommendedRoles: string[];
  careerSuggestions: string[];
  interviewQuestions: InterviewQuestion[];
  projects: ProjectRecommendation[];
  atsAnalysisId: string;
  roadmapId: string;
  careerPathId: string;
  explainableAIId: string;
  userId: string | null;
  createdAt: Date;
  
  // Relations (optional loading)
  atsAnalysis?: ATSReportDTO;
  roadmap?: RoadmapDTO;
  careerPath?: CareerPathDTO;
  explainableAI?: ExplainableAIDTO;
}

export interface InterviewSessionDTO {
  id: string;
  analysisId: string;
  targetRole: string;
  questions: InterviewQuestion[];
  userAnswers: Record<number, string>;
  feedback: Record<number, any>; // Record<number, QuestionFeedback>
  overallScore: number | null;
  userId: string | null;
  createdAt: Date;
}

export interface ResumeVersionDTO {
  id: string;
  resumeId: string;
  versionNumber: number;
  label: string;
  contentText: string;
  originalScore: number;
  improvedScore: number;
  skillCoverageScore: number;
  improvements: string[];
  userId: string | null;
  createdAt: Date;
}
