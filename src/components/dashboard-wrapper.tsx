'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardView from './dashboard-view';
import { CareerAnalysis } from '@/types';

interface DashboardWrapperProps {
  analysis: CareerAnalysis;
  targetRole: string;
  initialTab?: 'overview' | 'skills' | 'roadmap' | 'projects' | 'interview' | 'path' | 'explain' | 'rewriter' | 'recruiter' | 'github' | 'actions' | 'analytics';
}

export default function DashboardWrapper({ analysis, targetRole, initialTab }: DashboardWrapperProps) {
  const router = useRouter();

  const handleReset = () => {
    router.push('/analyze');
  };

  return (
    <DashboardView 
      analysis={analysis} 
      targetRole={targetRole} 
      onReset={handleReset} 
      initialTab={initialTab}
    />
  );
}
