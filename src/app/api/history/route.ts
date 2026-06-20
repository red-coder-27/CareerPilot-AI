import { NextRequest, NextResponse } from 'next/server';
import { getAllAnalyses } from '@/lib/db/analysis.service';
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
    const history = await getAllAnalyses(userId);
    return NextResponse.json({
      success: true,
      history
    });
  } catch (error: any) {
    console.error('History API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch analysis history.'
      },
      { status: 500 }
    );
  }
}
