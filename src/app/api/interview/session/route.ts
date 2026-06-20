import { NextRequest, NextResponse } from 'next/server';
import { createInterviewSession, getInterviewSession } from '@/lib/db';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }
    const userId = session.user.id;

    const { analysisId, targetRole, questions } = await req.json();

    if (!analysisId || !targetRole || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const interviewSession = await createInterviewSession(analysisId, targetRole, questions, userId);
    return NextResponse.json(interviewSession);
  } catch (error: any) {
    console.error('Failed to create interview session:', error);
    return NextResponse.json({ error: error.message || 'An error occurred.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing required parameter: id.' }, { status: 400 });
    }

    const interviewSession = await getInterviewSession(id, userId);
    if (!interviewSession) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
    }

    return NextResponse.json(interviewSession);
  } catch (error: any) {
    console.error('Failed to retrieve interview session:', error);
    return NextResponse.json({ error: error.message || 'An error occurred.' }, { status: 500 });
  }
}
