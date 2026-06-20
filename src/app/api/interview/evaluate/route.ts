import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { updateInterviewSession, getInterviewSession } from '@/lib/db';
import { auth } from '@/auth';

const evaluationResponseSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(z.string()),
  sampleBetterAnswer: z.string(),
  confidenceLevel: z.string(),
  communicationRating: z.number().min(1).max(5)
});

export async function POST(req: NextRequest) {
  try {
    const userSession = await auth();
    if (!userSession || !userSession.user || !userSession.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }
    const userId = userSession.user.id;

    const { question, answer, category, targetRole, sessionId, questionIndex } = await req.json();

    if (!question || !answer || !category || !targetRole) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
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

    const prompt = `You are an expert interviewer evaluating a candidate for the role of "${targetRole}".
Evaluate the user's answer to the following question.

Question Category: ${category}
Question: "${question}"
Candidate Answer: "${answer}"

Provide a detailed evaluation in JSON format:
1. "score": An evaluation score out of 100 based on technical accuracy, clarity, structure, and effectiveness.
2. "strengths": What did they answer well? (at least 2 points).
3. "weaknesses": What points did they miss or explain poorly? (at least 2 points).
4. "improvements": Clear, actionable steps on how they can make their answer better.
5. "sampleBetterAnswer": Provide a sample high-quality answer to the question that highlights key technical words and professional phrasing.
6. "confidenceLevel": Assess their confidence level based on their writing style/structure (e.g. High, Medium, Needs Work).
7. "communicationRating": A rating from 1 to 5 of their communication skills.

Ensure the output matches this schema structure:
{
  "score": number,
  "strengths": [string],
  "weaknesses": [string],
  "improvements": [string],
  "sampleBetterAnswer": string,
  "confidenceLevel": string,
  "communicationRating": number
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);
    const validatedData = evaluationResponseSchema.parse(parsedData);

    // Save answer and feedback inside the Database Session
    if (sessionId && questionIndex !== undefined) {
      try {
        const dbSession = await getInterviewSession(sessionId, userId);
        if (dbSession) {
          const userAnswers = (dbSession.userAnswers as any) || {};
          const feedback = (dbSession.feedback as any) || {};
          
          userAnswers[questionIndex] = answer;
          feedback[questionIndex] = validatedData;
          
          // Calculate overall score (average of completed scores)
          const allScores = Object.values(feedback).map((f: any) => f.score);
          const averageScore = Math.round(allScores.reduce((sum: number, s: number) => sum + s, 0) / allScores.length);

          await updateInterviewSession(sessionId, userAnswers, feedback, averageScore);
        }
      } catch (dbErr) {
        console.warn('Failed to update interview session in DB:', dbErr);
      }
    }

    return NextResponse.json(validatedData);
  } catch (error: any) {
    console.error('Interview Evaluation API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during interview evaluation.' }, { status: 500 });
  }
}
