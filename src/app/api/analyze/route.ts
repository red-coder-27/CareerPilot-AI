import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { parseResume } from '@/lib/parser';
import { saveResume, saveAnalysis } from '@/lib/db';
import { auth } from '@/auth';

// Define Zod Schema for validation
const technicalSkillSchema = z.object({
  name: z.string(),
  category: z.enum([
    'Frontend', 'Backend', 'Databases', 'Cloud', 'AI/ML', 'DevOps', 'Cybersecurity', 'Problem Solving', 'Other'
  ])
});

const missingSkillSchema = z.object({
  name: z.string(),
  category: z.string(),
  importance: z.enum(['High', 'Medium', 'Low'])
});

const atsAnalysisSchema = z.object({
  structureScore: z.number().min(0).max(100),
  formattingScore: z.number().min(0).max(100),
  keywordDensityScore: z.number().min(0).max(100),
  contactInfoPresent: z.boolean(),
  risks: z.array(z.string()),
  recommendations: z.array(z.string())
});

const projectRecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  technologies: z.array(z.string()),
  completionTime: z.string(),
  learningOutcomes: z.array(z.string())
});

const interviewQuestionSchema = z.object({
  question: z.string(),
  category: z.enum(['Technical', 'HR', 'Resume-Based', 'Project', 'Weakness-Oriented', 'Behavioral', 'System Design']),
  hint: z.string()
});

const careerPathRoleSchema = z.object({
  title: z.string(),
  skills: z.array(z.string()),
  certifications: z.array(z.string()),
  projects: z.array(z.string()),
  timeline: z.string()
});

const careerPathSchema = z.object({
  currentLevel: z.string(),
  nextRole: careerPathRoleSchema,
  midLevelRole: careerPathRoleSchema,
  seniorRole: careerPathRoleSchema
});

const explainableAISchema = z.object({
  extractionLogic: z.string(),
  roadmapReasoning: z.string(),
  atsLogic: z.string(),
  skillGapJustification: z.string()
});

const learningResourceSchema = z.object({
  title: z.string(),
  type: z.enum([
    'Official Documentation', 'Course', 'YouTube Resource', 'Practice Platform', 'Mini Project', 'Advanced Project',
    'Documentation', 'YouTube', 'Practice', 'Project', 'GitHub'
  ]),
  url: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedHours: z.number(),
  learningPriority: z.enum(['High', 'Medium', 'Low']),
  reasonRecommended: z.string().optional(),
  learningOutcome: z.string().optional()
});

const roadmapPlanSchema = z.object({
  tasks: z.array(z.string()),
  skills: z.array(z.string()).optional(),
  focus: z.string().optional(),
  projects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    techs: z.array(z.string())
  })).optional(),
  resources: z.array(learningResourceSchema).optional()
});

const jobMatchAnalysisSchema = z.object({
  jobMatch: z.number().min(0).max(100),
  missingSkills: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  criticalKeywords: z.array(z.string()),
  strengthAreas: z.array(z.string()),
  recommendations: z.array(z.string()),
  hiringReadiness: z.string(),
  roleFitExplanation: z.string(),
  topPrioritySkill: z.string(),
  estimatedImprovementPotential: z.number().min(0).max(100)
});

const recruiterPerspectiveSchema = z.object({
  hireReadiness: z.string(),
  summary: z.string(),
  strengths: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendedRoles: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
  hireRecommendation: z.enum(['Strong Hire', 'Hire', 'Consider', 'Needs Improvement'])
});

const actionCenterItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['Missing Skill', 'Weak ATS Score', 'Portfolio Gap', 'Interview Weakness']),
  description: z.string(),
  actionLabel: z.string(),
  associatedGap: z.string()
});

const careerAnalysisSchema = z.object({
  resumeScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  industryReadiness: z.enum(['High', 'Medium', 'Low']),
  roleMatchPercentage: z.number().min(0).max(100),
  summary: z.string(),
  technicalSkills: z.array(technicalSkillSchema),
  softSkills: z.array(z.string()),
  missingSkills: z.array(missingSkillSchema),
  recommendedSkills: z.array(technicalSkillSchema),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(z.string()),
  recommendedRoles: z.array(z.string()),
  careerSuggestions: z.array(z.string()),
  
  atsAnalysis: atsAnalysisSchema,
  
  roadmap: z.object({
    plan30Days: roadmapPlanSchema,
    plan60Days: roadmapPlanSchema,
    plan90Days: roadmapPlanSchema
  }),
  
  interviewQuestions: z.array(interviewQuestionSchema),
  projects: z.array(projectRecommendationSchema),
  careerPath: careerPathSchema,
  explainableAI: explainableAISchema,

  // Enhancements
  recruiterPerspective: recruiterPerspectiveSchema,
  actionItems: z.array(actionCenterItemSchema),
  jobMatchAnalysis: jobMatchAnalysisSchema.nullable().optional()
});

function normalizeAnalysisData(data: any): any {
  if (!data || typeof data !== 'object') return data;

  // Clone to avoid side effects
  const normalized = JSON.parse(JSON.stringify(data));

  // Normalize technicalSkills categories
  if (Array.isArray(normalized.technicalSkills)) {
    normalized.technicalSkills = normalized.technicalSkills.map((s: any) => {
      if (s && typeof s === 'object' && s.category) {
        const cat = s.category.trim().toLowerCase();
        let normalizedCat = 'Other';
        if (cat === 'frontend') normalizedCat = 'Frontend';
        else if (cat === 'backend') normalizedCat = 'Backend';
        else if (cat === 'databases' || cat === 'database') normalizedCat = 'Databases';
        else if (cat === 'cloud') normalizedCat = 'Cloud';
        else if (cat === 'ai/ml' || cat === 'ai' || cat === 'ml') normalizedCat = 'AI/ML';
        else if (cat === 'devops') normalizedCat = 'DevOps';
        else if (cat === 'cybersecurity') normalizedCat = 'Cybersecurity';
        else if (cat === 'problem solving') normalizedCat = 'Problem Solving';
        s.category = normalizedCat;
      }
      return s;
    });
  }

  // Normalize recommendedSkills categories
  if (Array.isArray(normalized.recommendedSkills)) {
    normalized.recommendedSkills = normalized.recommendedSkills.map((s: any) => {
      if (s && typeof s === 'object' && s.category) {
        const cat = s.category.trim().toLowerCase();
        let normalizedCat = 'Other';
        if (cat === 'frontend') normalizedCat = 'Frontend';
        else if (cat === 'backend') normalizedCat = 'Backend';
        else if (cat === 'databases' || cat === 'database') normalizedCat = 'Databases';
        else if (cat === 'cloud') normalizedCat = 'Cloud';
        else if (cat === 'ai/ml' || cat === 'ai' || cat === 'ml') normalizedCat = 'AI/ML';
        else if (cat === 'devops') normalizedCat = 'DevOps';
        else if (cat === 'cybersecurity') normalizedCat = 'Cybersecurity';
        else if (cat === 'problem solving') normalizedCat = 'Problem Solving';
        s.category = normalizedCat;
      }
      return s;
    });
  }

  // Normalize missingSkills importance
  if (Array.isArray(normalized.missingSkills)) {
    normalized.missingSkills = normalized.missingSkills.map((s: any) => {
      if (s && typeof s === 'object' && s.importance) {
        const imp = s.importance.trim().toLowerCase();
        let normalizedImp = 'Medium';
        if (imp === 'high') normalizedImp = 'High';
        else if (imp === 'medium') normalizedImp = 'Medium';
        else if (imp === 'low') normalizedImp = 'Low';
        s.importance = normalizedImp;
      }
      return s;
    });
  }

  // Normalize recruiterPerspective fields
  if (normalized.recruiterPerspective && typeof normalized.recruiterPerspective === 'object') {
    const rp = normalized.recruiterPerspective;
    if (rp.hireRecommendation) {
      const rec = rp.hireRecommendation.trim().toLowerCase();
      let normalizedRec = 'Consider';
      if (rec === 'strong hire' || rec === 'stronghire') normalizedRec = 'Strong Hire';
      else if (rec === 'hire') normalizedRec = 'Hire';
      else if (rec === 'consider') normalizedRec = 'Consider';
      else if (rec === 'needs improvement' || rec === 'needs-improvement' || rec === 'needsimprovement') normalizedRec = 'Needs Improvement';
      rp.hireRecommendation = normalizedRec;
    }
  }

  // Normalize actionItems types
  if (Array.isArray(normalized.actionItems)) {
    normalized.actionItems = normalized.actionItems.map((item: any) => {
      if (item && typeof item === 'object' && item.type) {
        const typeClean = item.type.trim().toLowerCase();
        let normalizedType = 'Missing Skill';
        if (typeClean === 'missing skill' || typeClean === 'missingskill') normalizedType = 'Missing Skill';
        else if (typeClean === 'weak ats score' || typeClean === 'weakats' || typeClean === 'ats score') normalizedType = 'Weak ATS Score';
        else if (typeClean === 'portfolio gap' || typeClean === 'portfoliogap') normalizedType = 'Portfolio Gap';
        else if (typeClean === 'interview weakness' || typeClean === 'interview') normalizedType = 'Interview Weakness';
        item.type = normalizedType;
      }
      if (item && typeof item === 'object' && !item.id) {
        item.id = Math.random().toString(36).substring(2, 9);
      }
      return item;
    });
  }

  // Normalize resource lists in roadmap plans
  const normalizeResource = (res: any) => {
    if (res && typeof res === 'object') {
      if (res.type) {
        const typeClean = res.type.trim().toLowerCase();
        let normalizedType = 'Documentation';
        if (typeClean.includes('doc')) normalizedType = 'Documentation';
        else if (typeClean.includes('youtube') || typeClean.includes('video')) normalizedType = 'YouTube';
        else if (typeClean.includes('course') || typeClean.includes('class')) normalizedType = 'Course';
        else if (typeClean.includes('practice') || typeClean.includes('code')) normalizedType = 'Practice';
        else if (typeClean.includes('project') || typeClean.includes('hands-on')) normalizedType = 'Project';
        else if (typeClean.includes('github') || typeClean.includes('repo')) normalizedType = 'GitHub';
        res.type = normalizedType;
      }
      if (res.difficulty) {
        const diff = res.difficulty.trim().toLowerCase();
        let normalizedDiff = 'Intermediate';
        if (diff === 'beginner') normalizedDiff = 'Beginner';
        else if (diff === 'intermediate') normalizedDiff = 'Intermediate';
        else if (diff === 'advanced') normalizedDiff = 'Advanced';
        res.difficulty = normalizedDiff;
      }
      if (res.learningPriority) {
        const prio = res.learningPriority.trim().toLowerCase();
        let normalizedPrio = 'Medium';
        if (prio === 'high') normalizedPrio = 'High';
        else if (prio === 'medium') normalizedPrio = 'Medium';
        else if (prio === 'low') normalizedPrio = 'Low';
        res.learningPriority = normalizedPrio;
      }
      if (typeof res.estimatedHours !== 'number') {
        res.estimatedHours = Number(res.estimatedHours) || 4;
      }
    }
    return res;
  };

  if (normalized.roadmap && typeof normalized.roadmap === 'object') {
    ['plan30Days', 'plan60Days', 'plan90Days'].forEach((planKey) => {
      const plan = normalized.roadmap[planKey];
      if (plan && typeof plan === 'object' && Array.isArray(plan.resources)) {
        plan.resources = plan.resources.map(normalizeResource);
      }
    });
  }

  // Normalize interviewQuestions categories
  if (Array.isArray(normalized.interviewQuestions)) {
    normalized.interviewQuestions = normalized.interviewQuestions.map((q: any) => {
      if (q && typeof q === 'object' && q.category) {
        const cat = q.category.trim();
        const allowed = ['Technical', 'HR', 'Resume-Based', 'Project', 'Weakness-Oriented', 'Behavioral', 'System Design'];
        if (!allowed.includes(cat)) {
          const lower = cat.toLowerCase();
          if (lower.includes('design') || lower.includes('architect') || lower.includes('system')) {
            q.category = 'System Design';
          } else if (lower.includes('behavior') || lower.includes('soft') || lower.includes('culture')) {
            q.category = 'Behavioral';
          } else if (lower.includes('hr') || lower.includes('personal') || lower.includes('fit')) {
            q.category = 'HR';
          } else if (lower.includes('project') || lower.includes('portfolio')) {
            q.category = 'Project';
          } else if (lower.includes('weak') || lower.includes('fail') || lower.includes('mistake')) {
            q.category = 'Weakness-Oriented';
          } else if (lower.includes('resume') || lower.includes('cv') || lower.includes('background')) {
            q.category = 'Resume-Based';
          } else {
            q.category = 'Technical';
          }
        }
      }
      return q;
    });
  }

  // Ensure jobMatchAnalysis is present if not set
  if (normalized.jobMatchAnalysis === undefined) {
    normalized.jobMatchAnalysis = null;
  }

  return normalized;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to analyze your resume.' }, { status: 401 });
    }
    const userId = session.user.id;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetRole = formData.get('targetRole') as string | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (!targetRole) {
      return NextResponse.json({ error: 'No target role selected.' }, { status: 400 });
    }

    // File validation: check type
    const mimeType = file.type;
    if (mimeType !== 'application/pdf' && mimeType !== 'text/plain') {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and TXT are supported.' }, { status: 400 });
    }

    // File validation: check size (10 MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 10MB limit.' }, { status: 400 });
    }

    // Parse resume content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await parseResume(buffer, mimeType);

    if (!resumeText.trim()) {
      return NextResponse.json({ error: 'The uploaded file appears to be empty.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // Construct JD Context
    const jobDescText = jobDescription && jobDescription.trim() 
      ? `\nAdditionally, compare the resume against the following pasted Job Description:\n"""\n${jobDescription}\n"""`
      : '';

    const prompt = `You are a world-class AI Career Advisor and Resume Expert. Analyze the following resume text against the target role: "${targetRole}".${jobDescText}

Provide a comprehensive career analysis in strict JSON format.

Resume text:
"""
${resumeText}
"""

Guidelines for content generation:
1. "resumeScore": Rate the overall quality, completeness, and value of the resume from 0 to 100.
2. "atsScore": Rate the ATS compatibility from 0 to 100, focusing on structure, keywords, and format.
3. "industryReadiness": Assess readiness as "High", "Medium", or "Low".
4. "roleMatchPercentage": Compare their profile with the target role "${targetRole}" and give a percentage match from 0 to 100.
5. "summary": Provide a professional, encouraging summary of their profile and career potential (3-4 sentences).
6. "technicalSkills": Extract their technical skills. Assign each skill to one of these exact categories: 'Frontend', 'Backend', 'Databases', 'Cloud', 'AI/ML', 'DevOps', 'Cybersecurity', 'Problem Solving', 'Other'.
7. "softSkills": Extract list of soft skills (e.g. Communication, Leadership).
8. "missingSkills": Identify missing skills required for "${targetRole}". Specify category and importance ('High', 'Medium', or 'Low').
9. "recommendedSkills": Suggest technical skills they should learn next to level up for "${targetRole}", with categories.
10. "strengths", "weaknesses", "improvements": Provide actionable insights (at least 3 of each).
11. "recommendedRoles", "careerSuggestions": Suggest typical career roles and suggestions for progression.
12. "atsAnalysis": Include specific scores for structure, formatting, keyword density, a boolean for whether contact info (email/phone) is present, a list of potential risks, and recommendations to optimize.
13. "roadmap": Create an actionable, highly practical 90-day learning roadmap:
    - plan30Days: Daily tasks, beginner projects, and relevant resources.
    - plan60Days: Tasks, intermediate skills to focus on, focus areas, and resources.
    - plan90Days: Tasks, advanced topics, interview prep focus, and resources.
    - Each plan's "resources" MUST be a list of 2-3 specific learning resources (Official Documentation, Courses, YouTube, Practice Platforms, etc.) complete with title, type, realistic url (e.g., reputable learning paths like docs.docker.com, react.dev, udemy.com, etc.), difficulty, estimatedHours, and learningPriority.
14. "interviewQuestions": Generate exactly 15 to 20 realistic interview questions customized to their resume and target role. Include behavioral, system design, and technical categories, and provide a brief hint.
15. "projects": Recommend 3 distinct practical project ideas tailored to fill their missing skills. Generate exactly one 'Beginner', one 'Intermediate', and one 'Advanced' project.
16. "careerPath": Map out a realistic, inspiring career progression beginning at their estimated current level to next, mid-level, and senior roles.
17. "explainableAI": Fill in the extraction logic, roadmap reasoning, ats logic, and skill gap justification.
18. "recruiterPerspective": Generate a dedicated recruiter-oriented analysis detailing candidate readiness ("High", "Medium", "Low"), a summary of suitability, strengths, risk concerns, recommended roles, recruiter confidence score, and a hireRecommendation ('Strong Hire' | 'Hire' | 'Consider' | 'Needs Improvement').
19. "actionItems": Create 3-5 centralized actionable items for the Action Center. Types must be one of: 'Missing Skill', 'Weak ATS Score', 'Portfolio Gap', 'Interview Weakness'. E.g., for missing Docker: title "Install & Learn Docker", type "Missing Skill", description "Containerize your local apps", actionLabel "Generate Docker Plan", associatedGap "Docker".
20. "jobMatchAnalysis": ${jobDescription && jobDescription.trim() ? 'Generate a detailed job description match object containing: jobMatch (0-100), missingSkills, missingKeywords, criticalKeywords, strengthAreas, recommendations, hiringReadiness, roleFitExplanation, topPrioritySkill, estimatedImprovementPotential.' : 'Do not include this object, or output it as null.'}

Ensure the output is valid JSON matching this schema structure:
{
  "resumeScore": number,
  "atsScore": number,
  "industryReadiness": "High" | "Medium" | "Low",
  "roleMatchPercentage": number,
  "summary": string,
  "technicalSkills": [{"name": string, "category": "Frontend" | "Backend" | "Databases" | "Cloud" | "AI/ML" | "DevOps" | "Cybersecurity" | "Problem Solving" | "Other"}],
  "softSkills": [string],
  "missingSkills": [{"name": string, "category": string, "importance": "High" | "Medium" | "Low"}],
  "recommendedSkills": [{"name": string, "category": "Frontend" | "Backend" | "Databases" | "Cloud" | "AI/ML" | "DevOps" | "Cybersecurity" | "Problem Solving" | "Other"}],
  "strengths": [string],
  "weaknesses": [string],
  "improvements": [string],
  "recommendedRoles": [string],
  "careerSuggestions": [string],
  "atsAnalysis": {
    "structureScore": number,
    "formattingScore": number,
    "keywordDensityScore": number,
    "contactInfoPresent": boolean,
    "risks": [string],
    "recommendations": [string]
  },
  "roadmap": {
    "plan30Days": {
      "tasks": [string],
      "projects": [{"title": string, "description": string, "techs": [string]}],
      "resources": [{"title": string, "type": "Official Documentation" | "Course" | "YouTube Resource" | "Practice Platform" | "Mini Project" | "Advanced Project", "url": string, "difficulty": "Beginner" | "Intermediate" | "Advanced", "estimatedHours": number, "learningPriority": "High" | "Medium" | "Low"}]
    },
    "plan60Days": {
      "tasks": [string],
      "skills": [string],
      "focus": string,
      "resources": [{"title": string, "type": "Official Documentation" | "Course" | "YouTube Resource" | "Practice Platform" | "Mini Project" | "Advanced Project", "url": string, "difficulty": "Beginner" | "Intermediate" | "Advanced", "estimatedHours": number, "learningPriority": "High" | "Medium" | "Low"}]
    },
    "plan90Days": {
      "tasks": [string],
      "skills": [string],
      "focus": string,
      "resources": [{"title": string, "type": "Official Documentation" | "Course" | "YouTube Resource" | "Practice Platform" | "Mini Project" | "Advanced Project", "url": string, "difficulty": "Beginner" | "Intermediate" | "Advanced", "estimatedHours": number, "learningPriority": "High" | "Medium" | "Low"}]
    }
  },
  "interviewQuestions": [
    {
      "question": string,
      "category": "Technical" | "HR" | "Resume-Based" | "Project" | "Weakness-Oriented" | "Behavioral" | "System Design",
      "hint": string
    }
  ],
  "projects": [
    {
      "title": string,
      "description": string,
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "technologies": [string],
      "completionTime": string,
      "learningOutcomes": [string]
    }
  ],
  "careerPath": {
    "currentLevel": string,
    "nextRole": { "title": string, "skills": [string], "certifications": [string], "projects": [string], "timeline": string },
    "midLevelRole": { "title": string, "skills": [string], "certifications": [string], "projects": [string], "timeline": string },
    "seniorRole": { "title": string, "skills": [string], "certifications": [string], "projects": [string], "timeline": string }
  },
  "explainableAI": {
    "extractionLogic": string,
    "roadmapReasoning": string,
    "atsLogic": string,
    "skillGapJustification": string
  },
  "recruiterPerspective": {
    "hireReadiness": string,
    "summary": string,
    "strengths": [string],
    "concerns": [string],
    "recommendedRoles": [string],
    "confidenceScore": number,
    "hireRecommendation": "Strong Hire" | "Hire" | "Consider" | "Needs Improvement"
  },
  "actionItems": [
    {
      "id": string,
      "title": string,
      "type": "Missing Skill" | "Weak ATS Score" | "Portfolio Gap" | "Interview Weakness",
      "description": string,
      "actionLabel": string,
      "associatedGap": string
    }
  ]
  ${jobDescription && jobDescription.trim() ? ',\n  "jobMatchAnalysis": {\n    "jobMatch": number,\n    "missingSkills": [string],\n    "missingKeywords": [string],\n    "criticalKeywords": [string],\n    "strengthAreas": [string],\n    "recommendations": [string],\n    "hiringReadiness": string,\n    "roleFitExplanation": string,\n    "topPrioritySkill": string,\n    "estimatedImprovementPotential": number\n  }' : ''}
}`;

    let attempts = 0;
    const maxAttempts = 3;
    let geminiResponseText = '';

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const result = await model.generateContent(
          attempts === 1 
            ? prompt 
            : `${prompt}\n\nIMPORTANT: Your previous output failed Zod schema validation. Please make absolutely sure the JSON object matches the schema structure, especially categories and enum types. Double check that categories match the exactly allowed strings.`
        );
        
        geminiResponseText = result.response.text();
        
        // Parse the JSON
        const parsedData = JSON.parse(geminiResponseText);
        
        // Normalize the structure to avoid validation crashes
        const normalizedData = normalizeAnalysisData(parsedData);
        
        // Validate with Zod
        const validatedData = careerAnalysisSchema.parse(normalizedData);
        
        // Save to Database
        try {
          const savedResume = await saveResume(file.name, mimeType, file.size, resumeText, userId);
          const savedAnalysis = await saveAnalysis(savedResume.id, targetRole, validatedData, userId);
          
          // Return the analysis with database IDs included
          return NextResponse.json({
            ...validatedData,
            id: savedAnalysis.id,
            resumeId: savedResume.id
          });
        } catch (dbErr) {
          console.error('Failed to persist analysis in DB, returning validation data directly:', dbErr);
          return NextResponse.json(validatedData);
        }
        
      } catch (err: any) {
        console.warn(`Gemini parsing attempt ${attempts} failed:`, err.message);
        if (attempts >= maxAttempts) {
          return NextResponse.json({ 
            error: 'Failed to generate a valid analysis structure from Gemini.', 
            details: err.message,
            rawText: geminiResponseText 
          }, { status: 422 });
        }
      }
    }

    return NextResponse.json({ error: 'Failed to process career analysis.' }, { status: 500 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during analysis.' }, { status: 500 });
  }
}
