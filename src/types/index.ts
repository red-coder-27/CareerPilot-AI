export interface TechnicalSkill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Databases' | 'Cloud' | 'AI/ML' | 'DevOps' | 'Cybersecurity' | 'Problem Solving' | 'Other';
}

export interface MissingSkill {
  name: string;
  category: string;
  importance: 'High' | 'Medium' | 'Low';
}

export interface ATSAnalysis {
  structureScore: number;
  formattingScore: number;
  keywordDensityScore: number;
  contactInfoPresent: boolean;
  risks: string[];
  recommendations: string[];
}

export interface ProjectRecommendation {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  completionTime: string;
  learningOutcomes: string[];
}

export interface InterviewQuestion {
  question: string;
  category: 'Technical' | 'HR' | 'Resume-Based' | 'Project' | 'Weakness-Oriented' | 'Behavioral' | 'System Design';
  hint: string;
}

export interface CareerPathRole {
  title: string;
  skills: string[];
  certifications: string[];
  projects: string[];
  timeline: string;
}

export interface CareerPath {
  currentLevel: string;
  nextRole: CareerPathRole;
  midLevelRole: CareerPathRole;
  seniorRole: CareerPathRole;
}

export interface ExplainableAI {
  extractionLogic: string;
  roadmapReasoning: string;
  atsLogic: string;
  skillGapJustification: string;
}

export interface LearningResource {
  title: string;
  type: 'Official Documentation' | 'Course' | 'YouTube Resource' | 'Practice Platform' | 'Mini Project' | 'Advanced Project' | 'Documentation' | 'YouTube' | 'Practice' | 'Project' | 'GitHub';
  url: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  learningPriority: 'High' | 'Medium' | 'Low';
  reasonRecommended?: string;
  learningOutcome?: string;
}

export interface RoadmapPlan {
  tasks: string[];
  skills?: string[];
  focus?: string;
  projects?: { title: string; description: string; techs: string[] }[];
  resources?: LearningResource[];
}

export interface JobMatchAnalysis {
  jobMatch: number;
  missingSkills: string[];
  missingKeywords: string[];
  criticalKeywords: string[];
  strengthAreas: string[];
  recommendations: string[];
  hiringReadiness: string;
  roleFitExplanation: string;
  topPrioritySkill: string;
  estimatedImprovementPotential: number;
}

export interface RecruiterPerspective {
  hireReadiness: string; // "High", "Medium", "Low"
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendedRoles: string[];
  confidenceScore: number;
  hireRecommendation: 'Strong Hire' | 'Hire' | 'Consider' | 'Needs Improvement';
}

export interface ActionCenterItem {
  id: string;
  title: string;
  type: 'Missing Skill' | 'Weak ATS Score' | 'Portfolio Gap' | 'Interview Weakness';
  description: string;
  actionLabel: string;
  associatedGap: string;
}

export interface CareerAnalysis {
  id?: string;
  resumeId?: string;
  resumeScore: number;
  atsScore: number;
  industryReadiness: 'High' | 'Medium' | 'Low';
  roleMatchPercentage: number;
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
  
  atsAnalysis: ATSAnalysis;
  
  roadmap: {
    plan30Days: RoadmapPlan;
    plan60Days: RoadmapPlan;
    plan90Days: RoadmapPlan;
  };
  
  interviewQuestions: InterviewQuestion[];
  projects: ProjectRecommendation[];
  careerPath: CareerPath;
  explainableAI: ExplainableAI;

  // Enhancements
  jobMatchAnalysis?: JobMatchAnalysis;
  recruiterPerspective?: RecruiterPerspective;
  actionItems?: ActionCenterItem[];
}

export interface GitHubAnalysis {
  portfolioScore: number;
  strengths: string[];
  improvements: string[];
  recommendedProjects: string[];
  industryReadiness: string;
  reposAnalysed?: Array<{
    name: string;
    stars: number;
    language: string;
    description: string;
    qualityAssessment: string;
  }>;
  contributionsAssessment?: string;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  sampleBetterAnswer: string;
  confidenceLevel: string;
  communicationRating: number; // 1-5
}

export interface ResumeVersionComparison {
  beforeScore: number;
  afterScore: number;
  beforeAts: number;
  afterAts: number;
  skillCoverageBefore: number;
  skillCoverageAfter: number;
  missingSkillsRemoved: string[];
  jobMatchBefore?: number;
  jobMatchAfter?: number;
  improvementsApplied: string[];
}
