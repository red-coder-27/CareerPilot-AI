import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { getOrCreateUserProfile } from '@/lib/db';

const githubAnalysisSchema = z.object({
  portfolioScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  recommendedProjects: z.array(z.string()),
  industryReadiness: z.string(),
  reposAnalysed: z.array(z.object({
    name: z.string(),
    stars: z.number(),
    language: z.string(),
    description: z.string(),
    qualityAssessment: z.string()
  })),
  contributionsAssessment: z.string()
});

export async function POST(req: NextRequest) {
  try {
    const { githubUrl, targetRole, email } = await req.json();

    if (!githubUrl) {
      return NextResponse.json({ error: 'Missing required parameter: githubUrl.' }, { status: 400 });
    }

    // Extract username from url: e.g. https://github.com/octocat or github.com/octocat
    const urlClean = githubUrl.replace(/https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');
    const username = urlClean.split('/')[0];

    if (!username) {
      return NextResponse.json({ error: 'Invalid GitHub URL format.' }, { status: 400 });
    }

    // Fetch user profile from GitHub API
    let githubUserResponse: any = {};
    let repos: any[] = [];
    
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: { 'User-Agent': 'CareerPilot-AI' }
      });
      if (userRes.ok) {
        githubUserResponse = await userRes.json();
      }
      
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`, {
        headers: { 'User-Agent': 'CareerPilot-AI' }
      });
      if (reposRes.ok) {
        repos = await reposRes.json();
      }
    } catch (fetchErr) {
      console.warn('Failed to fetch from GitHub API directly (rate-limited or offline), fallback to simulation:', fetchErr);
    }

    // Update user profile in database
    if (email) {
      try {
        await getOrCreateUserProfile(email, githubUserResponse.name || username, githubUrl);
      } catch (dbErr) {
        console.warn('Failed to record github url in user profile:', dbErr);
      }
    }

    const reposContext = repos.map(r => ({
      name: r.name,
      description: r.description || 'No description provided.',
      language: r.language || 'Not specified',
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      updatedAt: r.updated_at
    }));

    const userContext = {
      username,
      name: githubUserResponse.name || username,
      bio: githubUserResponse.bio || 'No bio provided.',
      publicReposCount: githubUserResponse.public_repos || 0,
      followers: githubUserResponse.followers || 0
    };

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

    const rolePrompt = targetRole ? `benchmarking against the target role: "${targetRole}"` : 'assessing overall software engineering capability';

    const prompt = `You are a technical recruiter and senior developer. Analyze the following GitHub profile and repositories metadata, ${rolePrompt}.
Provide a thorough portfolio evaluation in JSON format.

GitHub Profile Details:
${JSON.stringify(userContext, null, 2)}

Public Repositories Metadata:
${JSON.stringify(reposContext, null, 2)}

Guidelines:
1. "portfolioScore": Evaluate overall project substance, documentation quality (assumed based on metadata), coding activity, stars, and language diversity from 0 to 100.
2. "strengths": Identify strong points of their github presence (e.g. good stars on X repo, consistent updates, uses TypeScript, etc. - at least 2 points).
3. "improvements": What can they do to improve their profile? (e.g. add READMEs, add license file, add descriptive tags, clean up forks - at least 2 points).
4. "recommendedProjects": Recommend at least 2 new project ideas they should build on GitHub to diversify or strengthen their portfolio for "${targetRole || 'Software Engineer'}".
5. "industryReadiness": Assess readiness as "High", "Medium", or "Low" based on code complexity.
6. "reposAnalysed": Provide a brief technical qualityAssessment (1 sentence evaluation) for each repository in their public list.
7. "contributionsAssessment": A summary of their contribution structure (e.g. "Solid updates to TypeScript repositories, but lacks open-source contributions to larger codebases").

Ensure the output matches this schema structure:
{
  "portfolioScore": number,
  "strengths": [string],
  "improvements": [string],
  "recommendedProjects": [string],
  "industryReadiness": string,
  "reposAnalysed": [
    {
      "name": string,
      "stars": number,
      "language": string,
      "description": string,
      "qualityAssessment": string
    }
  ],
  "contributionsAssessment": string
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);
    const validatedData = githubAnalysisSchema.parse(parsedData);

    return NextResponse.json(validatedData);
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during GitHub analysis.' }, { status: 500 });
  }
}
