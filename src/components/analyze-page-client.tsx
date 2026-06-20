'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LandingView from './landing-view';
import { Session } from 'next-auth';

interface AnalyzePageClientProps {
  session: Session;
}

export default function AnalyzePageClient({ session }: AnalyzePageClientProps) {
  const router = useRouter();

  const handleAnalysisComplete = (data: any) => {
    router.push(`/dashboard?id=${data.id}`);
  };

  const handleViewDemo = () => {
    router.push(`/dashboard?demo=true`);
  };

  return (
    <div className="min-h-screen">
      <LandingView
        session={session}
        onAnalysisComplete={handleAnalysisComplete}
        onViewDemo={handleViewDemo}
      />
    </div>
  );
}
