import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Test Candidate',
        githubUrl: 'https://github.com/test-candidate'
      }
    });

    return NextResponse.json({
      success: true,
      user: testUser
    });
  } catch (error: any) {
    console.error('Test DB Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to connect to the database or insert record.'
      },
      { status: 500 }
    );
  }
}
