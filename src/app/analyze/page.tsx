import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AnalyzePageClient from '@/components/analyze-page-client';

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect('/');
  }

  return <AnalyzePageClient session={session} />;
}
