'use client';

import React, { useState } from 'react';
import LandingView from '@/components/landing-view';
import DashboardView from '@/components/dashboard-view';
import { CareerAnalysis } from '@/types';
import { mockCareerAnalysis } from '@/lib/mockData';
import { Session } from 'next-auth';

interface HomeClientProps {
  session: Session | null;
}

export default function HomeClient({ session }: HomeClientProps) {
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [targetRole, setTargetRole] = useState<string | null>(null);

  const handleAnalysisComplete = (data: CareerAnalysis, role: string) => {
    setAnalysis(data);
    setTargetRole(role);
  };

  const handleViewDemo = () => {
    setAnalysis(mockCareerAnalysis);
    setTargetRole('Full Stack Developer');
  };

  const handleReset = () => {
    setAnalysis(null);
    setTargetRole(null);
  };

  return (
    <main className="min-h-screen">
      {analysis && targetRole ? (
        <DashboardView 
          analysis={analysis} 
          targetRole={targetRole} 
          onReset={handleReset} 
        />
      ) : (
        <LandingView 
          session={session}
          onAnalysisComplete={handleAnalysisComplete} 
          onViewDemo={handleViewDemo} 
        />
      )}
    </main>
  );
}
