import { NextRequest, NextResponse } from 'next/server';
import { getResume } from '@/lib/db/resume.service';
import { auth } from '@/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing resume ID parameter.' },
        { status: 400 }
      );
    }

    const resume = await getResume(id, userId);
    if (!resume) {
      return NextResponse.json(
        { success: false, error: 'Resume not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      resume
    });
  } catch (error: any) {
    console.error('Resume API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch resume details.'
      },
      { status: 500 }
    );
  }
}
