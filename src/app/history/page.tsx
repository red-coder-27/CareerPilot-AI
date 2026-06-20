import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { getAllAnalyses } from '@/lib/db/analysis.service';
import { FileText, ArrowRight, Calendar, Award, Zap } from 'lucide-react';

export default async function HistoryPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect('/');
  }
  const userId = session.user.id;

  const history = await getAllAnalyses(userId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Analysis History</h1>
        <p className="text-xs text-zinc-400 mt-1">Review your past resume evaluations and recommendations.</p>
      </div>

      {history.length === 0 ? (
        <div className="max-w-md mx-auto my-12 p-8 bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md rounded-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-primary">
            <FileText className="h-8 w-8 text-indigo-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">No Analyses Saved</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You haven't run any resume analyses yet. Once you analyze a resume, it will appear here.
            </p>
          </div>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-primary/10"
          >
            Analyze Your Resume <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((analysis) => {
            const dateStr = new Date(analysis.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={analysis.id}
                className="bg-zinc-950/40 border border-zinc-850 hover:border-indigo-500/35 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {analysis.targetRole}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-450 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded text-[9px] font-bold">
                      Match: {analysis.matchPercentage}%
                    </span>
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                    {analysis.summary}
                  </p>

                  {/* Scores Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-zinc-900/35 border border-zinc-850 p-2.5 rounded-xl space-y-1">
                      <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">ATS Score</span>
                      <span className="text-xs font-extrabold text-pink-400 flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5" />
                        {analysis.atsAnalysis?.structureScore || 85}/100
                      </span>
                    </div>

                    <div className="bg-zinc-900/35 border border-zinc-850 p-2.5 rounded-xl space-y-1">
                      <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Readiness</span>
                      <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        {analysis.industryReadiness || 'High'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-900">
                  <Link
                    href={`/dashboard?id=${analysis.id}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-semibold rounded-lg transition-all"
                  >
                    Load in Dashboard <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
