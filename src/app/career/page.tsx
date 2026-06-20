import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllAnalyses, getAnalysis } from '@/lib/db/analysis.service';
import DashboardWrapper from '@/components/dashboard-wrapper';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

export default async function CareerPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect('/');
  }
  const userId = session.user.id;

  const allAnalyses = await getAllAnalyses(userId);
  let latestAnalysis = null;

  if (allAnalyses.length > 0) {
    latestAnalysis = await getAnalysis(allAnalyses[0].id, userId);
  }

  if (!latestAnalysis) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md rounded-2xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-primary">
          <Compass className="h-8 w-8 text-indigo-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">No Career Roadmap Generated</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Please upload and analyze a resume first. We will build a customized career progression roadmap and skill checklist for your target role!
          </p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-primary/10"
        >
          Analyze Your Resume <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <DashboardWrapper 
      analysis={latestAnalysis} 
      targetRole={latestAnalysis.targetRole}
      initialTab="path"
    />
  );
}
