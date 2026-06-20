import { NextRequest, NextResponse } from 'next/server';
import { getAllInterviewSessions } from '@/lib/db/interview.service';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const sessions = await getAllInterviewSessions(userId);
    return NextResponse.json({
      success: true,
      sessions
    });
  } catch (error: any) {
    console.error('Interviews API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch interview history.'
      },
      { status: 500 }
    );
  }
}
