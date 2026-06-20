import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { auth } from '@/auth';

const actionPlanResponseSchema = z.object({
  title: z.string(),
  estimatedDays: z.number(),
  steps: z.array(z.object({
    day: z.string(),
    title: z.string(),
    description: z.string(),
    resources: z.array(z.string())
  })),
  deliverable: z.object({
    title: z.string(),
    description: z.string()
  })
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { gapName, gapType, targetRole } = await req.json();

    if (!gapName || !gapType) {
      return NextResponse.json({ error: 'Missing required parameters: gapName and gapType.' }, { status: 400 });
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

    const prompt = `You are a technical mentor and career advisor.
Generate a structured, highly actionable learning/execution plan to resolve a specific gap.

Gap to address: "${gapName}"
Gap Type: ${gapType} (e.g. Missing Skill, Weak ATS Score, Portfolio Gap, Interview Weakness)
Target Career Role: "${targetRole || 'Software Engineer'}"

Provide a detailed guide in JSON format:
1. "title": A professional action-oriented title (e.g., "Docker Mastery & Multi-Container Deployment Plan").
2. "estimatedDays": Total estimated days to complete this plan (e.g. 7, 14, or 30).
3. "steps": An array of step-by-step tasks (4 to 6 items total). Each item should specify a timeline (e.g., "Days 1-2" or "Step 1"), a title, a description, and 1-2 reputable resources/links (e.g., official docs, blogs, practice tools).
4. "deliverable": A final project or check point to prove mastery (e.g. containerize a fullstack app and deploy it on AWS ECS). Include a title and description.

Return valid JSON matching this schema:
{
  "title": string,
  "estimatedDays": number,
  "steps": [
    {
      "day": string,
      "title": string,
      "description": string,
      "resources": [string]
    }
  ],
  "deliverable": {
    "title": string,
    "description": string
  }
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);
    const validatedData = actionPlanResponseSchema.parse(parsedData);

    return NextResponse.json(validatedData);
  } catch (error: any) {
    console.error('Action Plan API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during Action Plan generation.' }, { status: 500 });
  }
}
