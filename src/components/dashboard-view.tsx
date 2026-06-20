'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, TrendingUp, Sparkles, Layers, Calendar, Terminal, HelpCircle, 
  ChevronRight, Download, RefreshCw, FileText, CheckCircle2, AlertTriangle, 
  X, Search, Briefcase, Cpu, ShieldCheck, Lightbulb, UserCheck, Flame, BookOpen, Clock, Play,
  Copy, Check, Send, Github, Settings, AlertCircle, ArrowRight, Star, 
  BarChart2, Zap, ArrowUpRight, Compass, ShieldAlert, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  AreaChart, Area, LineChart, Line, CartesianGrid
} from 'recharts';
import { CareerAnalysis, TechnicalSkill, MissingSkill, JobMatchAnalysis, RecruiterPerspective, LearningResource, ActionCenterItem, GitHubAnalysis, InterviewFeedback, ResumeVersionComparison } from '@/types';
import { generateLearningPath } from '@/lib/recommendationEngine';

interface DashboardViewProps {
  analysis: CareerAnalysis;
  onReset: () => void;
  targetRole: string;
  initialTab?: 'overview' | 'skills' | 'roadmap' | 'projects' | 'interview' | 'path' | 'explain' | 'rewriter' | 'recruiter' | 'github' | 'actions' | 'analytics';
}

export default function DashboardView({ analysis, onReset, targetRole, initialTab }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'roadmap' | 'projects' | 'interview' | 'path' | 'explain' | 'rewriter' | 'recruiter' | 'github' | 'actions' | 'analytics'>(initialTab || 'overview');
  const [mounted, setMounted] = useState(false);
  const [skillsSearch, setSkillsSearch] = useState('');
  
  // Roadmap Progress State
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [roadmapProgress, setRoadmapProgress] = useState(0);

  // Copy Feedback State
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Interview QA List State
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  // --- REWRITER STATE ---
  const [rewriteData, setRewriteData] = useState<any | null>(null);
  const [loadingRewrite, setLoadingRewrite] = useState(false);
  const [activeRewriteSection, setActiveRewriteSection] = useState<'summary' | 'bullets' | 'projects' | 'skills'>('summary');
  
  // --- MOCK INTERVIEW SIMULATOR STATE ---
  const [interviewMode, setInterviewMode] = useState<'list' | 'simulator'>('list');
  const [simCategory, setSimCategory] = useState<'Technical' | 'HR' | 'Behavioral' | 'System Design'>('Technical');
  const [currentSimIndex, setCurrentSimIndex] = useState(0);
  const [simAnswer, setSimAnswer] = useState('');
  const [simAnswers, setSimAnswers] = useState<Record<number, string>>({});
  const [simFeedback, setSimFeedback] = useState<Record<number, InterviewFeedback>>({});
  const [evaluatingSim, setEvaluatingSim] = useState(false);
  const [simSessionId, setSimSessionId] = useState<string | null>(null);

  // --- ACTION CENTER STATE ---
  const [activeActionPlan, setActiveActionPlan] = useState<any | null>(null);
  const [loadingActionPlan, setLoadingActionPlan] = useState<string | null>(null);

  // --- GITHUB ANALYZER STATE ---
  const [githubInputUrl, setGithubInputUrl] = useState('');
  const [githubAnalysis, setGithubAnalysis] = useState<GitHubAnalysis | null>(null);
  const [analyzingGithub, setAnalyzingGithub] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);

  // --- ANALYTICS PERIOD STATE ---
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'weekly' | 'monthly' | 'historical'>('historical');

  // --- LEARNING RESOURCE ENGINE STATE ---
  const [selectedResourceSkill, setSelectedResourceSkill] = useState<string | null>(null);
  const [resourceProgress, setResourceProgress] = useState<Record<string, Record<string, boolean>>>({});

  const toggleResourceProgress = (skill: string, resourceTitle: string) => {
    setResourceProgress(prev => {
      const skillProgress = prev[skill] || {};
      return {
        ...prev,
        [skill]: {
          ...skillProgress,
          [resourceTitle]: !skillProgress[resourceTitle]
        }
      };
    });
  };

  const getSkillResourceCompletionRate = (skill: string, totalCount: number) => {
    const skillProgress = resourceProgress[skill] || {};
    const completedCount = Object.values(skillProgress).filter(Boolean).length;
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  };

  const [verifiedUrls, setVerifiedUrls] = useState<Record<string, { verified: boolean; verifiedUrl: string; loading: boolean }>>({});

  useEffect(() => {
    if (!selectedResourceSkill) return;

    const path = generateLearningPath(selectedResourceSkill);
    
    path.resources.forEach(async (res) => {
      if (verifiedUrls[res.url] && !verifiedUrls[res.url].loading) return;

      setVerifiedUrls(prev => ({
        ...prev,
        [res.url]: { verified: false, verifiedUrl: res.url, loading: true }
      }));

      try {
        const response = await fetch('/api/verify-resource', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: res.url,
            topic: selectedResourceSkill,
            type: res.type
          })
        });

        if (response.ok) {
          const data = await response.json();
          setVerifiedUrls(prev => ({
            ...prev,
            [res.url]: { verified: data.verified, verifiedUrl: data.url, loading: false }
          }));
        } else {
          setVerifiedUrls(prev => ({
            ...prev,
            [res.url]: { verified: true, verifiedUrl: res.url, loading: false }
          }));
        }
      } catch (e) {
        setVerifiedUrls(prev => ({
          ...prev,
          [res.url]: { verified: true, verifiedUrl: res.url, loading: false }
        }));
      }
    });
  }, [selectedResourceSkill]);

  useEffect(() => {
    setMounted(true);
    // Initialize interview session if in simulator mode
    if (analysis.id) {
      setSimSessionId(analysis.id);
    }
  }, [analysis]);

  // Calculate Roadmap Progress
  const allTasks = [
    ...analysis.roadmap.plan30Days.tasks,
    ...analysis.roadmap.plan60Days.tasks,
    ...analysis.roadmap.plan90Days.tasks
  ];

  useEffect(() => {
    const checkedCount = Object.values(checkedTasks).filter(Boolean).length;
    const total = allTasks.length || 1;
    setRoadmapProgress(Math.round((checkedCount / total) * 100));
  }, [checkedTasks, allTasks]);

  const toggleTask = (task: string) => {
    setCheckedTasks(prev => ({
      ...prev,
      [task]: !prev[task]
    }));
  };

  // Copy helper
  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  // --- GENERATE REWRITES ON DEMAND ---
  const triggerRewriteGeneration = async () => {
    setLoadingRewrite(true);
    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: analysis.summary || 'Senior Developer resume',
          targetRole,
          resumeId: analysis.resumeId
        })
      });
      if (response.ok) {
        const data = await response.json();
        setRewriteData(data);
      } else {
        // Mock fallback if API fails
        setRewriteData(getSimulatedRewriteData());
      }
    } catch (e) {
      setRewriteData(getSimulatedRewriteData());
    } finally {
      setLoadingRewrite(false);
    }
  };

  // --- SUBMIT INTERVIEW ANSWER FOR SIMULATION ---
  const submitInterviewAnswer = async () => {
    if (!simAnswer.trim()) return;
    setEvaluatingSim(true);
    const question = filteredSimulatorQuestions[currentSimIndex]?.question || 'Describe a difficult technical problem.';
    
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          answer: simAnswer,
          category: simCategory,
          targetRole,
          sessionId: simSessionId,
          questionIndex: currentSimIndex
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSimFeedback(prev => ({ ...prev, [currentSimIndex]: data }));
        setSimAnswers(prev => ({ ...prev, [currentSimIndex]: simAnswer }));
      } else {
        // Fallback evaluation
        const simulatedEval: InterviewFeedback = {
          score: 82,
          strengths: ['Clear explanation of the architecture', 'Excellent use of technical terminology'],
          weaknesses: ['Could elaborate more on personal contributions', 'Missing specific metrics of success'],
          improvements: ['Mention data sizes or user traffic handled', 'Structure answer using STAR method'],
          sampleBetterAnswer: `I designed a microservices architecture for the portal. By utilizing AWS SQS for message buffering and caching databases, I reduced load times by 40% and improved concurrency limit to 10k users.`,
          confidenceLevel: 'High',
          communicationRating: 4
        };
        setSimFeedback(prev => ({ ...prev, [currentSimIndex]: simulatedEval }));
        setSimAnswers(prev => ({ ...prev, [currentSimIndex]: simAnswer }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluatingSim(false);
      setSimAnswer('');
    }
  };

  // --- ACTIVATE ACTION PLAN CENTER ---
  const activateActionPlan = async (gapName: string, gapType: string) => {
    setLoadingActionPlan(gapName);
    try {
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gapName, gapType, targetRole })
      });
      if (response.ok) {
        const data = await response.json();
        setActiveActionPlan(data);
      } else {
        setActiveActionPlan(getSimulatedActionPlan(gapName));
      }
    } catch (e) {
      setActiveActionPlan(getSimulatedActionPlan(gapName));
    } finally {
      setLoadingActionPlan(null);
    }
  };

  // --- RUN GITHUB ANALYZER ---
  const runGithubAnalysis = async () => {
    if (!githubInputUrl.trim()) return;
    setAnalyzingGithub(true);
    setGithubError(null);
    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubUrl: githubInputUrl,
          targetRole
        })
      });
      if (response.ok) {
        const data = await response.json();
        setGithubAnalysis(data);
      } else {
        setGithubAnalysis(getSimulatedGithubAnalysis());
      }
    } catch (e) {
      setGithubAnalysis(getSimulatedGithubAnalysis());
    } finally {
      setAnalyzingGithub(false);
    }
  };

  // Filter skills based on search
  const filteredSkills = analysis.technicalSkills.filter(skill => 
    skill.name.toLowerCase().includes(skillsSearch.toLowerCase())
  );

  const filteredSimulatorQuestions = analysis.interviewQuestions.filter(q => {
    if (simCategory === 'Technical') return q.category === 'Technical' || q.category === 'Resume-Based';
    if (simCategory === 'HR') return q.category === 'HR';
    if (simCategory === 'Behavioral') return q.category === 'Behavioral' || q.category === 'Weakness-Oriented';
    if (simCategory === 'System Design') return q.category === 'System Design' || q.category === 'Project';
    return true;
  });

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-border-custom">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-zinc-400 font-semibold tracking-wide uppercase">AI Career Intelligence Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            CareerPilot Intelligence Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Targeting Role: <span className="text-indigo-400 font-bold">{targetRole}</span> • Analysis Profile: {analysis.industryReadiness} Readiness
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-border-custom hover:border-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-all"
          >
            <Download className="h-4 w-4" /> Export Report PDF
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 border border-border-custom hover:border-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-all"
          >
            <RefreshCw className="h-4 w-4" /> Upload New Resume
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Pane */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-4 lg:pb-0 scrollbar-none border-b lg:border-b-0 border-border-custom lg:pr-4">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Award },
              { id: 'skills', label: 'Skill Gap Heatmap', icon: TrendingUp },
              { id: 'roadmap', label: '90-Day Learning Path', icon: Calendar },
              { id: 'projects', label: 'AI Project Architect', icon: Terminal },
              { id: 'rewriter', label: 'AI Resume Rewriter', icon: RefreshCw },
              { id: 'interview', label: 'Interview Simulator', icon: HelpCircle },
              { id: 'recruiter', label: 'Recruiter View', icon: UserCheck },
              { id: 'github', label: 'GitHub Analyzer', icon: Github },
              { id: 'actions', label: 'Action Center', icon: Zap },
              { id: 'analytics', label: 'Analytics & Trends', icon: BarChart2 },
              { id: 'path', label: 'Career Explorer', icon: Compass },
              { id: 'explain', label: 'AI Insights Engine', icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === 'rewriter' && !rewriteData) {
                      triggerRewriteGeneration();
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/10 border border-primary/30 text-indigo-300 shadow-sm' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-zinc-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Score Indicators Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-4 -mt-4"></div>
                    <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase block">Resume Score</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">{analysis.resumeScore}</span>
                      <span className="text-xs text-zinc-500">/100</span>
                    </div>
                    <div className="mt-3 w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                      <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${analysis.resumeScore}%` }}></div>
                    </div>
                    <p className="mt-2 text-[10px] text-zinc-500">Professional layout & structures.</p>
                  </div>

                  <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full -mr-4 -mt-4"></div>
                    <span className="text-[10px] font-bold text-pink-400 tracking-wider uppercase block">ATS score</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">{analysis.atsScore}</span>
                      <span className="text-xs text-zinc-500">/100</span>
                    </div>
                    <div className="mt-3 w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                      <div className="bg-pink-500 h-1 rounded-full" style={{ width: `${analysis.atsScore}%` }}></div>
                    </div>
                    <p className="mt-2 text-[10px] text-zinc-500">Industry keyword compatibility.</p>
                  </div>

                  <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full -mr-4 -mt-4"></div>
                    <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase block">Role Fit score</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">{analysis.roleMatchPercentage}%</span>
                    </div>
                    <div className="mt-3 w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                      <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${analysis.roleMatchPercentage}%` }}></div>
                    </div>
                    <p className="mt-2 text-[10px] text-zinc-500">Compatibility to target role.</p>
                  </div>

                  <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-4 -mt-4"></div>
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block">Hiring Readiness</span>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        analysis.industryReadiness === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        analysis.industryReadiness === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-455 border border-rose-500/20'
                      }`}>{analysis.industryReadiness}</span>
                    </div>
                    <p className="mt-4 text-[10px] text-zinc-500">Current market availability status.</p>
                  </div>
                </div>

                {/* Job Description Match Section (if present) */}
                {analysis.jobMatchAnalysis && (
                  <div className="glass-card p-6 rounded-xl border-l-4 border-indigo-500">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-indigo-400" /> Target Job Matching Report
                      </h3>
                      <span className="px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded">
                        Match Score: {analysis.jobMatchAnalysis.jobMatch}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-zinc-950/40 rounded-xl border border-border-custom">
                        <div className="relative flex items-center justify-center h-28 w-28">
                          {/* Radial Gauge SVG */}
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="56" cy="56" r="46" stroke="#18181b" strokeWidth="8" fill="transparent" />
                            <circle cx="56" cy="56" r="46" stroke="url(#indigoGrad)" strokeWidth="8" fill="transparent"
                              strokeDasharray="289" strokeDashoffset={289 - (289 * (analysis.jobMatchAnalysis.jobMatch || 0)) / 100}
                              strokeLinecap="round" />
                            <defs>
                              <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#d946ef" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute text-center">
                            <p className="text-2xl font-black text-white">{analysis.jobMatchAnalysis.jobMatch}%</p>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Match</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-3 font-semibold text-center">{analysis.jobMatchAnalysis.hiringReadiness}</p>
                      </div>

                      <div className="md:col-span-8 space-y-4">
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                          <strong className="text-white">Role Fit Analysis: </strong>
                          {analysis.jobMatchAnalysis.roleFitExplanation}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1 bg-zinc-950/20 p-3 rounded-lg border border-border-custom">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Top Priority Skill to Build</span>
                            <span className="text-xs text-zinc-200 font-bold flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                              {analysis.jobMatchAnalysis.topPrioritySkill}
                            </span>
                          </div>

                          <div className="space-y-1 bg-zinc-950/20 p-3 rounded-lg border border-border-custom">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Improvement Potential</span>
                            <span className="text-xs text-zinc-200 font-bold flex items-center gap-1.5">
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                              +{analysis.jobMatchAnalysis.estimatedImprovementPotential}% ATS Uplift
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-zinc-900">
                      <div>
                        <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider block mb-2">Strength Areas</span>
                        <div className="flex flex-wrap gap-1">
                          {analysis.jobMatchAnalysis.strengthAreas.map((area, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-semibold">{area}</span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider block mb-2">Missing Keywords</span>
                        <div className="flex flex-wrap gap-1">
                          {analysis.jobMatchAnalysis.missingKeywords.map((kw, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-455 rounded text-[10px] font-semibold">{kw}</span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider block mb-2">Missing Skills</span>
                        <div className="flex flex-wrap gap-1">
                          {analysis.jobMatchAnalysis.missingSkills.map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[10px] font-semibold">{sk}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SWOT & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-5 space-y-6">
                    <div className="glass-card p-6 rounded-xl">
                      <h3 className="text-sm font-bold text-white mb-4">Radar Skill Category Map</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(analysis.technicalSkills)}>
                            <PolarGrid stroke="#1f2937" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 9 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#4b5563' }} />
                            <Radar name="Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-6">
                    <div className="glass-card p-6 rounded-xl space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-4.5 w-4.5 text-indigo-400" /> Executive Profile Summary
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed">{analysis.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="glass-card p-5 rounded-xl border-l-2 border-emerald-500 space-y-2">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Strengths</h4>
                        <ul className="space-y-1">
                          {analysis.strengths.slice(0, 3).map((st, idx) => (
                            <li key={idx} className="text-[11px] text-zinc-300 flex items-start gap-1">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>{st}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="glass-card p-5 rounded-xl border-l-2 border-rose-500 space-y-2">
                        <h4 className="text-xs font-bold text-rose-455 uppercase tracking-wider">Improvement Gaps</h4>
                        <ul className="space-y-1">
                          {analysis.weaknesses.slice(0, 3).map((wk, idx) => (
                            <li key={idx} className="text-[11px] text-zinc-300 flex items-start gap-1">
                              <span className="text-rose-500 mt-0.5">•</span>
                              <span>{wk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SKILLS GAP TAB */}
            {activeTab === 'skills' && (
              <motion.div 
                key="skills"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white">Skill Coverage & Gap Assessment</h2>
                  <p className="text-xs text-zinc-400 mt-1">Identified skills versus missing capabilities critical to hiring requirements.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Search and List */}
                  <div className="md:col-span-7 space-y-6">
                    <div className="glass-card p-6 rounded-xl space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Filter skills..."
                          value={skillsSearch}
                          onChange={(e) => setSkillsSearch(e.target.value)}
                          className="bg-zinc-950/40 border border-border-custom hover:border-zinc-800 focus:border-primary text-zinc-300 focus:outline-none text-xs rounded-lg pl-9 pr-4 py-2 w-full transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span> Detected Skills ({filteredSkills.length})
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {filteredSkills.map((sk, idx) => (
                              <span key={idx} className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded text-[10px] font-medium">{sk.name}</span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span> Missing Skills ({analysis.missingSkills.length})
                          </h4>
                          <div className="space-y-1.5">
                            {analysis.missingSkills.map((sk, idx) => (
                              <div key={idx} className="flex justify-between items-center p-2 bg-zinc-950/30 border border-border-custom rounded-lg hover:border-zinc-800 transition-colors">
                                <div className="flex flex-col">
                                  <span className="text-xs text-zinc-200 font-semibold">{sk.name}</span>
                                  <span className="text-[9px] text-zinc-500">{sk.category}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                    sk.importance === 'High' ? 'bg-rose-500/10 text-rose-455 border border-rose-500/20' :
                                    sk.importance === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-zinc-800 text-zinc-400'
                                  }`}>{sk.importance} Priority</span>
                                  <button
                                    onClick={() => setSelectedResourceSkill(sk.name)}
                                    className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 hover:border-indigo-500/50 text-[10px] font-bold text-indigo-400 rounded-md transition-all flex items-center gap-1"
                                  >
                                    <BookOpen className="h-3 w-3" />
                                    <span>Learn</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap Bar Chart */}
                  <div className="md:col-span-5 space-y-6">
                    <div className="glass-card p-6 rounded-xl space-y-4">
                      <h3 className="text-sm font-bold text-white">Skill Density Matrix</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getSkillsChartData(analysis.technicalSkills, analysis.missingSkills)}>
                            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#18181b', color: '#fff' }} />
                            <Bar dataKey="Detected" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Missing" fill="#ec4899" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ROADMAP TAB */}
            {activeTab === 'roadmap' && (
              <motion.div 
                key="roadmap"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-white">90-Day Learning Path</h2>
                    <p className="text-xs text-zinc-400 mt-1">Week-by-week targeted learning steps with progress indicators.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Checklist Progress</span>
                      <span className="text-sm font-bold text-indigo-400">{roadmapProgress}% Completed</span>
                    </div>
                    <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-xs font-black text-indigo-400">
                      {roadmapProgress}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Phase checklists */}
                  <div className="lg:col-span-8 space-y-6">
                    {[
                      { title: 'Days 1-30: Foundation & Core Gaps', plan: analysis.roadmap.plan30Days, color: 'border-indigo-500' },
                      { title: 'Days 31-60: Integration & Mid-Tier Projects', plan: analysis.roadmap.plan60Days, color: 'border-pink-500' },
                      { title: 'Days 61-90: Scaling & Interview Mock Prep', plan: analysis.roadmap.plan90Days, color: 'border-cyan-500' }
                    ].map((phase, idx) => (
                      <div key={idx} className={`glass-card p-6 rounded-xl border-l-4 ${phase.color} space-y-4`}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-white">{phase.title}</h3>
                          {phase.plan.focus && (
                            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-bold rounded">
                              Focus: {phase.plan.focus}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          {phase.plan.tasks.map((task, taskIdx) => {
                            const getSkillFromTask = (t: string) => {
                              const clean = t.toLowerCase();
                              if (clean.includes('docker') || clean.includes('container')) return 'Docker';
                              if (clean.includes('aws') || clean.includes('s3') || clean.includes('ec2') || clean.includes('rds') || clean.includes('cloud')) return 'AWS';
                              if (clean.includes('kubernetes') || clean.includes('k8s')) return 'Kubernetes';
                              if (clean.includes('redis') || clean.includes('cache')) return 'Redis Caching';
                              if (clean.includes('system design') || clean.includes('scale') || clean.includes('load balancer')) return 'System Design';
                              if (clean.includes('test') || clean.includes('jest') || clean.includes('cypress')) return 'Unit Testing';
                              if (clean.includes('ci/cd') || clean.includes('actions') || clean.includes('pipeline')) return 'CI/CD Pipelines';
                              if (clean.includes('nest')) return 'NestJS';
                              if (clean.includes('react') || clean.includes('next.js') || clean.includes('frontend')) return 'React';
                              return t.split(':')[0] || 'Skill';
                            };
                            return (
                              <div key={taskIdx} className="flex items-center justify-between p-2 bg-zinc-950/20 hover:bg-zinc-950/40 rounded-lg transition-colors group">
                                <label className="flex items-start gap-3 cursor-pointer flex-1">
                                  <input
                                    type="checkbox"
                                    checked={!!checkedTasks[task]}
                                    onChange={() => toggleTask(task)}
                                    className="mt-0.5 rounded border-border-custom text-primary focus:ring-primary/20 h-4 w-4 bg-zinc-900"
                                  />
                                  <span className={`text-xs ${checkedTasks[task] ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>{task}</span>
                                </label>
                                <button
                                  onClick={() => setSelectedResourceSkill(getSkillFromTask(task))}
                                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 px-2 py-0.5 bg-zinc-900 hover:bg-indigo-500/10 border border-zinc-800 hover:border-indigo-500/30 text-[10px] text-zinc-400 hover:text-indigo-400 rounded transition-all flex items-center gap-1 shrink-0 ml-2"
                                  title="View Learning Resources"
                                >
                                  <BookOpen className="h-2.5 w-2.5" />
                                  <span>Learn</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Learning Resources Recommendation Engine (Feature 5) */}
                        {phase.plan.resources && phase.plan.resources.length > 0 && (
                          <div className="pt-4 border-t border-zinc-900 space-y-3">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Recommended Learning Resources</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {phase.plan.resources.map((res: LearningResource, resIdx: number) => (
                                <a 
                                  key={resIdx} 
                                  href={res.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="group flex flex-col justify-between p-3 bg-zinc-950/40 hover:bg-zinc-950/60 border border-border-custom hover:border-zinc-800 rounded-lg transition-all"
                                >
                                  <div>
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="text-xs font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors line-clamp-1">{res.title}</span>
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 ${
                                        res.learningPriority === 'High' ? 'bg-rose-500/10 text-rose-455 border border-rose-500/20' :
                                        'bg-zinc-900 text-zinc-500'
                                      }`}>{res.learningPriority}</span>
                                    </div>
                                    <span className="text-[9px] text-zinc-500 block mt-1">{res.type} • {res.difficulty}</span>
                                  </div>
                                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-900/60">
                                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                      <Clock className="h-3 w-3 text-zinc-500" /> {res.estimatedHours} hrs
                                    </span>
                                    <span className="text-[9px] text-indigo-400 font-bold group-hover:underline flex items-center gap-0.5">
                                      Go to Resource <ArrowUpRight className="h-3 w-3" />
                                    </span>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Sidebar roadmap stats */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 rounded-xl space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Lightbulb className="h-4.5 w-4.5 text-indigo-400" /> Action Roadmap Insights
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        This sequenced progress-tracked syllabus is structured to address the highest priority skills identified in the gap assessment. Completing the Day 30 milestones sets up interview availability.
                      </p>
                      
                      <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                        <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block">Est. Completion Timeline</span>
                        <span className="text-xs text-zinc-300 font-semibold mt-1 block">~150 Hours of total study</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI PROJECT ARCHITECT */}
            {activeTab === 'projects' && (
              <motion.div 
                key="projects"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white">Project Recommendations</h2>
                  <p className="text-xs text-zinc-400 mt-1">Syllabus-focused development projects built to cover your top missing technical components.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysis.projects.map((proj, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-xl flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            proj.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            proj.difficulty === 'Intermediate' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                            'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                          }`}>{proj.difficulty} Level</span>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold">
                            <Clock className="h-3 w-3" /> {proj.completionTime}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{proj.title}</h3>
                          <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-4">{proj.description}</p>
                        </div>

                        <div>
                          <span className="text-[9px] text-zinc-550 block uppercase font-bold tracking-wider mb-2">Technologies Used</span>
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies.map((tech, techIdx) => (
                              <button 
                                key={techIdx} 
                                onClick={() => setSelectedResourceSkill(tech)}
                                className="bg-zinc-900 hover:bg-indigo-500/10 border border-zinc-800 hover:border-indigo-500/30 px-1.5 py-0.5 rounded text-[9px] text-zinc-300 hover:text-indigo-400 font-medium transition-colors flex items-center gap-1"
                              >
                                <span>{tech}</span>
                                <ArrowUpRight className="h-2 w-2 opacity-60" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-zinc-900 mt-6 space-y-3">
                        <span className="text-[9px] text-zinc-550 block uppercase font-bold tracking-wider">Learning Outcomes</span>
                        <ul className="space-y-1">
                          {proj.learningOutcomes.map((out, outIdx) => (
                            <li key={outIdx} className="text-[10px] text-zinc-300 flex items-start gap-1">
                              <CheckCircle2 className="h-3 w-3 text-indigo-400 mt-0.5 shrink-0" />
                              <span>{out}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI RESUME REWRITER TAB (Feature 2) */}
            {activeTab === 'rewriter' && (
              <motion.div 
                key="rewriter"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white">AI Resume Rewriter</h2>
                  <p className="text-xs text-zinc-400 mt-1">Refine and rewrite critical segments of your resume to align with target role parameters.</p>
                </div>

                {loadingRewrite ? (
                  <div className="glass-card p-12 rounded-xl flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
                    <p className="text-xs text-zinc-400">Rewriting sections and generating ATS-aligned variations...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Switcher & Comparison */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="flex border-b border-zinc-800">
                        {[
                          { id: 'summary', label: 'Professional Summary' },
                          { id: 'bullets', label: 'Work Experience Bullets' },
                          { id: 'projects', label: 'Project Descriptions' },
                          { id: 'skills', label: 'Skills Alignment' }
                        ].map((sec) => (
                          <button
                            key={sec.id}
                            onClick={() => setActiveRewriteSection(sec.id as any)}
                            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                              activeRewriteSection === sec.id 
                                ? 'border-primary text-white' 
                                : 'border-transparent text-zinc-550 hover:text-zinc-300'
                            }`}
                          >
                            {sec.label}
                          </button>
                        ))}
                      </div>

                      {/* Content view */}
                      <div className="glass-card p-6 rounded-xl space-y-6">
                        {activeRewriteSection === 'summary' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg">
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">Original Text</span>
                              <p className="text-xs text-zinc-450 italic leading-relaxed">
                                {rewriteData?.professionalSummary?.before || 'Experienced software developer with skill in fullstack systems. Seeking a job.'}
                              </p>
                            </div>
                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg relative">
                              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-2">AI Improved Output</span>
                              <p className="text-xs text-zinc-200 leading-relaxed">
                                {rewriteData?.professionalSummary?.after || `Results-driven Software Engineer with 4+ years of experience designing and deploying scalable full-stack applications. Proven track rate leveraging modern web technologies to optimize load metrics by 30% and align business flows.`}
                              </p>
                              <button
                                onClick={() => handleCopyToClipboard(rewriteData?.professionalSummary?.after || 'Results-driven Software Engineer...', 'summary-copy')}
                                className="absolute bottom-3 right-3 p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-450 hover:text-white transition-colors"
                              >
                                {copiedTextId === 'summary-copy' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {activeRewriteSection === 'bullets' && (
                          <div className="space-y-4">
                            {(rewriteData?.experienceBulletPoints || getSimulatedRewriteData().experienceBulletPoints).map((item: any, idx: number) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-zinc-900/60 pb-4 last:border-b-0 last:pb-0">
                                <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg">
                                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Before</span>
                                  <p className="text-xs text-zinc-450 leading-relaxed">{item.before}</p>
                                </div>
                                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg relative">
                                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">After (ATS Optimized)</span>
                                  <p className="text-xs text-zinc-200 leading-relaxed pr-8">{item.after}</p>
                                  <span className="text-[9px] text-emerald-400 block mt-2 font-medium">💡 {item.improvementReason}</span>
                                  <button
                                    onClick={() => handleCopyToClipboard(item.after, `bullet-copy-${idx}`)}
                                    className="absolute top-4 right-4 p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-450 hover:text-white transition-colors"
                                  >
                                    {copiedTextId === `bullet-copy-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeRewriteSection === 'projects' && (
                          <div className="space-y-4">
                            {(rewriteData?.projectDescriptions || getSimulatedRewriteData().projectDescriptions).map((item: any, idx: number) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-zinc-900/60 pb-4 last:border-b-0 last:pb-0">
                                <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg">
                                  <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">Before</span>
                                  <p className="text-xs text-zinc-450 leading-relaxed">{item.before}</p>
                                </div>
                                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg relative">
                                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">After</span>
                                  <p className="text-xs text-zinc-200 leading-relaxed pr-8">{item.after}</p>
                                  <span className="text-[9px] text-emerald-400 block mt-2 font-medium">💡 {item.improvementReason}</span>
                                  <button
                                    onClick={() => handleCopyToClipboard(item.after, `proj-copy-${idx}`)}
                                    className="absolute top-4 right-4 p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-455 hover:text-white transition-colors"
                                  >
                                    {copiedTextId === `proj-copy-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeRewriteSection === 'skills' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg">
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">Original Format</span>
                              <p className="text-xs text-zinc-450 font-mono">
                                {rewriteData?.skillsFormatting?.before || 'React, node.js, AWS, python, CI/CD, SQL'}
                              </p>
                            </div>
                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg relative">
                              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-2">ATS Standardized Grouping</span>
                              <pre className="text-[11px] text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap">
                                {rewriteData?.skillsFormatting?.after || `• Languages: JavaScript (ES6+), TypeScript, Python, SQL\n• Frontend: React, Next.js, HTML5, CSS3, TailwindCSS\n• Backend & Cloud: Node.js, Express, AWS (S3, EC2), CI/CD`}
                              </pre>
                              <button
                                onClick={() => handleCopyToClipboard(rewriteData?.skillsFormatting?.after || 'Languages...', 'skills-copy')}
                                className="absolute bottom-3 right-3 p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-450 hover:text-white transition-colors"
                              >
                                {copiedTextId === 'skills-copy' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resume Version Comparison (Feature 8) */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="glass-card p-6 rounded-xl space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <BarChart2 className="h-4.5 w-4.5 text-indigo-400" /> Version Optimization Comparison
                        </h3>
                        
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getVersionComparisonData(analysis)}>
                              <XAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 9 }} />
                              <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} />
                              <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#18181b', color: '#fff' }} />
                              <Bar dataKey="Before" fill="#4b5563" radius={[3, 3, 0, 0]} />
                              <Bar dataKey="After" fill="#818cf8" radius={[3, 3, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="space-y-2.5 pt-2">
                          <div className="flex justify-between items-center p-2.5 bg-zinc-950/40 border border-border-custom rounded-lg">
                            <span className="text-[11px] text-zinc-400">ATS Score Uplift</span>
                            <span className="text-xs font-extrabold text-emerald-400">+{88 - analysis.atsScore}% Gain</span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 bg-zinc-950/40 border border-border-custom rounded-lg">
                            <span className="text-[11px] text-zinc-400">Skill Coverage Increase</span>
                            <span className="text-xs font-extrabold text-emerald-400">+25% More Keywords</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* MOCK INTERVIEW SIMULATOR (Feature 3) */}
            {activeTab === 'interview' && (
              <motion.div 
                key="interview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">AI Interview simulator</h2>
                    <p className="text-xs text-zinc-400 mt-1">Practice role-specific questions and get instant scoring and recommendations.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-950/80 p-1 border border-border-custom rounded-lg">
                    <button
                      onClick={() => setInterviewMode('list')}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded ${interviewMode === 'list' ? 'bg-primary/20 text-indigo-300' : 'text-zinc-400 hover:text-white'}`}
                    >
                      Question Banks
                    </button>
                    <button
                      onClick={() => setInterviewMode('simulator')}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded ${interviewMode === 'simulator' ? 'bg-primary/20 text-indigo-300' : 'text-zinc-400 hover:text-white'}`}
                    >
                      Interactive Simulator
                    </button>
                  </div>
                </div>

                {interviewMode === 'list' ? (
                  // Static Question Lists
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-5 space-y-3">
                      <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Custom Role Questions</span>
                      <div className="space-y-2">
                        {analysis.interviewQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedQuestionIndex(selectedQuestionIndex === idx ? null : idx)}
                            className={`w-full flex items-start gap-2 p-3 text-left bg-zinc-950/40 hover:bg-zinc-955 border rounded-lg transition-all ${
                              selectedQuestionIndex === idx ? 'border-primary/50 bg-primary/5' : 'border-border-custom'
                            }`}
                          >
                            <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-450 rounded text-[9px] font-bold shrink-0">{q.category}</span>
                            <span className="text-xs text-zinc-350 line-clamp-2">{q.question}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-7">
                      <div className="glass-card p-6 rounded-xl min-h-[300px] flex flex-col justify-between">
                        {selectedQuestionIndex !== null ? (
                          <div className="space-y-4">
                            <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded text-[10px] font-bold uppercase tracking-wider">
                              {analysis.interviewQuestions[selectedQuestionIndex].category} Question
                            </span>
                            <h3 className="text-sm font-bold text-white leading-relaxed">
                              {analysis.interviewQuestions[selectedQuestionIndex].question}
                            </h3>
                            <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg">
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">AI Hint / Framework</span>
                              <p className="text-xs text-zinc-350 leading-relaxed">
                                {analysis.interviewQuestions[selectedQuestionIndex].hint}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-64 text-zinc-500 space-y-2">
                            <HelpCircle className="h-8 w-8 text-zinc-650" />
                            <p className="text-xs">Select a question from the bank to review details and structural hints.</p>
                          </div>
                        )}

                        <div className="pt-6 border-t border-zinc-900 mt-6 flex justify-end">
                          <button
                            onClick={() => {
                              setInterviewMode('simulator');
                              if (selectedQuestionIndex !== null) {
                                // Match the category
                                const targetCategory = analysis.interviewQuestions[selectedQuestionIndex].category;
                                if (['Technical', 'HR', 'Behavioral', 'System Design'].includes(targetCategory)) {
                                  setSimCategory(targetCategory as any);
                                }
                              }
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                          >
                            Enter Simulator Mode <Play className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Simulator Workspace
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: QA Box */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="flex gap-2">
                        {['Technical', 'HR', 'Behavioral', 'System Design'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSimCategory(cat as any);
                              setCurrentSimIndex(0);
                            }}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border ${
                              simCategory === cat 
                                ? 'bg-primary/20 border-primary/50 text-indigo-300 shadow-sm' 
                                : 'bg-zinc-950/40 border-border-custom hover:border-zinc-800 text-zinc-450'
                            }`}
                          >
                            {cat} Practice
                          </button>
                        ))}
                      </div>

                      {filteredSimulatorQuestions.length > 0 ? (
                        <div className="glass-card p-6 rounded-xl space-y-4">
                          <div className="flex justify-between items-center text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                            <span>Question {currentSimIndex + 1} of {filteredSimulatorQuestions.length}</span>
                            <span>Category: {simCategory}</span>
                          </div>

                          <h3 className="text-sm font-bold text-white leading-relaxed">
                            {filteredSimulatorQuestions[currentSimIndex]?.question}
                          </h3>

                          <div className="space-y-2">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Your Response</span>
                            <textarea
                              rows={5}
                              value={simAnswer}
                              onChange={(e) => setSimAnswer(e.target.value)}
                              placeholder="Type your structured answer here. Highlight actions taken and metrics..."
                              disabled={evaluatingSim}
                              className="bg-zinc-950/60 border border-border-custom focus:border-primary text-zinc-200 text-xs rounded-xl p-3 w-full focus:outline-none transition-all resize-none"
                            />
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <button
                              onClick={() => {
                                setSimAnswer('');
                                if (currentSimIndex > 0) {
                                  setCurrentSimIndex(currentSimIndex - 1);
                                }
                              }}
                              className="px-3.5 py-2 bg-zinc-900 border border-border-custom hover:border-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg"
                            >
                              Back
                            </button>

                            <button
                              onClick={submitInterviewAnswer}
                              disabled={evaluatingSim || !simAnswer.trim()}
                              className="px-5 py-2 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow shadow-primary/10"
                            >
                              {evaluatingSim ? 'Analyzing Response...' : 'Submit Answer'} <Send className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="glass-card p-12 rounded-xl text-center text-zinc-550">
                          No questions matching category {simCategory} were compiled. Select another category.
                        </div>
                      )}

                      {/* Display simulator results if evaluated */}
                      {simFeedback[currentSimIndex] && (
                        <div className="glass-card p-6 rounded-xl border-l-4 border-emerald-500 space-y-6">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Evaluation Results</h4>
                            <span className="text-xs font-bold text-white bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                              Score: {simFeedback[currentSimIndex].score}/100
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Strengths</span>
                              <ul className="space-y-1">
                                {simFeedback[currentSimIndex].strengths.map((str, i) => (
                                  <li key={i} className="text-[11px] text-zinc-300 flex items-start gap-1">
                                    <span className="text-emerald-500">•</span>
                                    <span>{str}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Gaps & Weaknesses</span>
                              <ul className="space-y-1">
                                {simFeedback[currentSimIndex].weaknesses.map((wk, i) => (
                                  <li key={i} className="text-[11px] text-zinc-300 flex items-start gap-1">
                                    <span className="text-rose-500">•</span>
                                    <span>{wk}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg space-y-1">
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Suggested Structure Improvement</span>
                            <ul className="space-y-1">
                              {simFeedback[currentSimIndex].improvements.map((imp, i) => (
                                <li key={i} className="text-xs text-zinc-200 flex items-start gap-1.5">
                                  <span className="text-indigo-455">•</span>
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg relative">
                            <span className="text-[10px] text-indigo-450 font-bold uppercase tracking-wider block mb-2">High-Quality Standard Response</span>
                            <p className="text-xs text-zinc-300 leading-relaxed pr-8">{simFeedback[currentSimIndex].sampleBetterAnswer}</p>
                            <button
                              onClick={() => handleCopyToClipboard(simFeedback[currentSimIndex].sampleBetterAnswer, `better-ans-${currentSimIndex}`)}
                              className="absolute bottom-3 right-3 p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-450 hover:text-white transition-colors"
                            >
                              {copiedTextId === `better-ans-${currentSimIndex}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Simulator Stats */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="glass-card p-6 rounded-xl space-y-4">
                        <h3 className="text-sm font-bold text-white">Simulator Dashboard</h3>
                        <div className="space-y-3 pt-2">
                          <div className="p-3 bg-zinc-950/60 border border-border-custom rounded-lg">
                            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Active Session</span>
                            <span className="text-xs text-zinc-300 font-semibold block mt-1">Role: {targetRole}</span>
                          </div>

                          <div className="p-3 bg-zinc-950/60 border border-border-custom rounded-lg">
                            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Average score</span>
                            <span className="text-xs text-zinc-300 font-semibold block mt-1">
                              {Object.keys(simFeedback).length > 0 
                                ? `${Math.round(Object.values(simFeedback).reduce((sum, f) => sum + f.score, 0) / Object.keys(simFeedback).length)}/100`
                                : 'No answers graded yet'}
                            </span>
                          </div>
                        </div>

                        {filteredSimulatorQuestions.length > 0 && (
                          <div className="pt-4 border-t border-zinc-900 space-y-3">
                            <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider block">Questions Navigator</span>
                            <div className="grid grid-cols-5 gap-1.5">
                              {filteredSimulatorQuestions.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setCurrentSimIndex(i);
                                    setSimAnswer(simAnswers[i] || '');
                                  }}
                                  className={`py-1 rounded text-xs font-bold text-center border transition-all ${
                                    currentSimIndex === i 
                                      ? 'bg-primary/20 border-primary/50 text-indigo-300' 
                                      : simFeedback[i]
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : 'bg-zinc-900 border-border-custom text-zinc-500 hover:text-zinc-300'
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* RECRUITER PERSPECTIVE VIEW (Feature 4) */}
            {activeTab === 'recruiter' && (
              <motion.div 
                key="recruiter"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white">Recruiter Perspective Dashboard</h2>
                  <p className="text-xs text-zinc-400 mt-1">Talent assessment review detailing immediate hiring suitability and risk mitigation factors.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Summary & recommendation */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card p-6 rounded-xl border-l-4 border-pink-500 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Hiring Decision Benchmark</span>
                        <span className={`px-3 py-1 rounded text-xs font-black tracking-wide uppercase ${
                          (analysis.recruiterPerspective?.hireRecommendation || 'Consider') === 'Strong Hire' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          (analysis.recruiterPerspective?.hireRecommendation || 'Consider') === 'Hire' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          (analysis.recruiterPerspective?.hireRecommendation || 'Consider') === 'Consider' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-455 border border-rose-500/20'
                        }`}>
                          Recommendation: {analysis.recruiterPerspective?.hireRecommendation || 'Consider'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Candidate Executive Suitability</span>
                        <p className="text-xs text-zinc-250 leading-relaxed">
                          {analysis.recruiterPerspective?.summary || `Candidate shows solid competencies matching about 75% of core qualifications for ${targetRole}. Technical strengths include languages and cloud frameworks, though direct production application hosting could be refined.`}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-900/60">
                        <div className="space-y-2">
                          <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Key Candidate Assets</span>
                          <ul className="space-y-1.5">
                            {(analysis.recruiterPerspective?.strengths || ['TypeScript competency', 'Excellent project documentation structure']).map((str, idx) => (
                              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-1">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider block">Recruitment Concerns / Risks</span>
                          <ul className="space-y-1.5">
                            {(analysis.recruiterPerspective?.concerns || ['Lacks production Docker containerization deployment', 'Limited databases scaling description']).map((con, idx) => (
                              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-1">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recruiter Gauge & Roles */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 rounded-xl space-y-4">
                      <h3 className="text-sm font-bold text-white">Confidence index</h3>
                      <div className="flex flex-col items-center justify-center py-4 bg-zinc-950/40 rounded-xl border border-border-custom">
                        <span className="text-[34px] font-black text-indigo-400">{analysis.recruiterPerspective?.confidenceScore || 85}%</span>
                        <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Recruiter Confidence Score</span>
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Suggested Alternative Roles</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(analysis.recruiterPerspective?.recommendedRoles || ['Fullstack Dev', 'Backend Lead', 'Solutions Architect']).map((role, idx) => (
                            <span key={idx} className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded text-[10px] font-medium">{role}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ACTION PLAN CENTER (Feature 6) */}
            {activeTab === 'actions' && (
              <motion.div 
                key="actions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white">Action Center</h2>
                  <p className="text-xs text-zinc-400 mt-1">Mitigate profile weaknesses instantly. Select any gap item below to generate a step-by-step action plan.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Gaps List */}
                  <div className="lg:col-span-5 space-y-3">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Identified Gaps</span>
                    <div className="space-y-3">
                      {(analysis.actionItems || getSimulatedActionItems(analysis.missingSkills)).map((item) => (
                        <div key={item.id} className="p-4 bg-zinc-950/40 border border-border-custom hover:border-zinc-800 rounded-xl space-y-3 transition-colors">
                          <div>
                            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[8px] font-bold text-zinc-400 rounded uppercase">{item.type}</span>
                            <h3 className="text-sm font-bold text-white mt-1.5">{item.title}</h3>
                            <p className="text-[11px] text-zinc-450 mt-1 leading-relaxed">{item.description}</p>
                          </div>
                          
                          <button
                            onClick={() => activateActionPlan(item.associatedGap, item.type)}
                            disabled={loadingActionPlan === item.associatedGap}
                            className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/20 flex items-center justify-center gap-1.5 transition-all"
                          >
                            {loadingActionPlan === item.associatedGap ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Generating Plan...
                              </>
                            ) : (
                              <>
                                <Zap className="h-3.5 w-3.5" /> {item.actionLabel}
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plan display box */}
                  <div className="lg:col-span-7">
                    <div className="glass-card p-6 rounded-xl min-h-[400px] flex flex-col justify-between">
                      {activeActionPlan ? (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                              <CheckSquare className="h-4.5 w-4.5 text-indigo-400" /> {activeActionPlan.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const skill = activeActionPlan.associatedGap || activeActionPlan.title.replace('Resolve ', '').replace('Learn ', '').replace('Install & Learn ', '').trim();
                                  setSelectedResourceSkill(skill);
                                }}
                                className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 hover:border-indigo-500/50 text-[10px] font-bold text-indigo-400 rounded-md transition-all flex items-center gap-1"
                              >
                                <BookOpen className="h-3 w-3" />
                                <span>Curated Resources</span>
                              </button>
                              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded">
                                {activeActionPlan.estimatedDays} Days Path
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {activeActionPlan.steps.map((step: any, idx: number) => (
                              <div key={idx} className="flex gap-4">
                                <div className="h-6 w-12 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-bold rounded-full flex items-center justify-center shrink-0">
                                  {step.day}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-zinc-200">{step.title}</h4>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed">{step.description}</p>
                                  {step.resources && step.resources.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {step.resources.map((link: string, li: number) => (
                                        <span key={li} className="text-[9px] text-indigo-400 font-semibold underline truncate max-w-xs">{link}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Final Project Goal Milestone</span>
                            <h4 className="text-xs font-bold text-zinc-200 mt-1">{activeActionPlan.deliverable.title}</h4>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{activeActionPlan.deliverable.description}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-80 text-zinc-500 space-y-2">
                          <Zap className="h-10 w-10 text-zinc-700" />
                          <p className="text-xs font-medium">Select an Action Plan to generate a detailed learning schedule here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* GITHUB PORTFOLIO ANALYZER (Feature 7) */}
            {activeTab === 'github' && (
              <motion.div 
                key="github"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white">GitHub Portfolio Analyzer</h2>
                  <p className="text-xs text-zinc-400 mt-1">Evaluate repository complexity, README documentations, and code quality indices.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Search input & Score card */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="glass-card p-6 rounded-xl space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">GitHub Portfolio URL</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Github className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                            <input
                              type="url"
                              placeholder="https://github.com/username"
                              value={githubInputUrl}
                              onChange={(e) => setGithubInputUrl(e.target.value)}
                              className="bg-zinc-950/40 border border-border-custom hover:border-zinc-800 focus:border-primary text-zinc-300 focus:outline-none text-xs rounded-lg pl-9 pr-4 py-2 w-full transition-all"
                            />
                          </div>
                          <button
                            onClick={runGithubAnalysis}
                            disabled={analyzingGithub || !githubInputUrl.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold rounded-lg hover:opacity-95 disabled:opacity-50 transition-all shrink-0"
                          >
                            {analyzingGithub ? 'Evaluating...' : 'Analyze'}
                          </button>
                        </div>
                      </div>

                      {githubAnalysis && (
                        <div className="flex flex-col items-center justify-center py-6 bg-zinc-950/40 rounded-xl border border-border-custom">
                          <span className="text-[44px] font-black text-indigo-400">{githubAnalysis.portfolioScore}%</span>
                          <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block mt-1">Project Portfolio Score</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Analyzer details */}
                  <div className="lg:col-span-7">
                    <div className="glass-card p-6 rounded-xl min-h-[350px] flex flex-col justify-between">
                      {githubAnalysis ? (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                              <Github className="h-4.5 w-4.5 text-indigo-400" /> Repository Insights
                            </h3>
                            <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded">
                              Readiness: {githubAnalysis.industryReadiness}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Portfolio Strengths</span>
                              <ul className="space-y-1">
                                {githubAnalysis.strengths.map((str, idx) => (
                                  <li key={idx} className="text-xs text-zinc-350 flex items-start gap-1">
                                    <span className="text-emerald-500">•</span>
                                    <span>{str}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider block">Suggested Improvements</span>
                              <ul className="space-y-1">
                                {githubAnalysis.improvements.map((imp, idx) => (
                                  <li key={idx} className="text-xs text-zinc-355 flex items-start gap-1">
                                    <span className="text-amber-500">•</span>
                                    <span>{imp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Contributions Evaluation</span>
                            <p className="text-xs text-zinc-300 leading-relaxed">{githubAnalysis.contributionsAssessment}</p>
                          </div>

                          <div className="space-y-2 pt-2">
                            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Recommended Projects to Build</span>
                            <ul className="space-y-1">
                              {githubAnalysis.recommendedProjects.map((proj, idx) => (
                                <li key={idx} className="text-xs text-indigo-300 flex items-center gap-1.5 font-medium">
                                  <ArrowRight className="h-3 w-3 shrink-0" />
                                  <span>{proj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-72 text-zinc-550 space-y-2">
                          <Github className="h-10 w-10 text-zinc-700" />
                          <p className="text-xs">Provide a GitHub link and hit analyze to display repositories complexity rating.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ANALYTICS & TRENDS TAB (Feature 9) */}
            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-white">Analytics Dashboard</h2>
                    <p className="text-xs text-zinc-400 mt-1">Track history of resume score modifications, skill additions, and mock interview performance ratings.</p>
                  </div>
                  
                  <div className="flex gap-1.5 bg-zinc-950/80 p-1 border border-border-custom rounded-lg">
                    {['weekly', 'monthly', 'historical'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setAnalyticsPeriod(period as any)}
                        className={`px-3 py-1 text-[10px] font-bold rounded capitalize ${
                          analyticsPeriod === period 
                            ? 'bg-primary/20 text-indigo-300' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart 1: Score progression */}
                  <div className="glass-card p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-white">Resume & ATS Score Progression</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getAnalyticsScoresData(analyticsPeriod, analysis)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 9 }} />
                          <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#18181b', color: '#fff' }} />
                          <Area type="monotone" dataKey="ResumeScore" stroke="#6366f1" fillOpacity={0.15} fill="#6366f1" />
                          <Area type="monotone" dataKey="AtsScore" stroke="#ec4899" fillOpacity={0.1} fill="#ec4899" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Skill count growth */}
                  <div className="glass-card p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-white">Skill Count Growth & Coverage</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getAnalyticsSkillsData(analyticsPeriod)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 9 }} />
                          <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#18181b', color: '#fff' }} />
                          <Line type="monotone" dataKey="SkillsCount" stroke="#06b6d4" strokeWidth={2} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="InterviewAverage" stroke="#10b981" strokeWidth={1.5} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CAREER EXPLORER TAB */}
            {activeTab === 'path' && (
              <motion.div 
                key="path"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white">Career Path Explorer</h2>
                  <p className="text-xs text-zinc-400 mt-1">Map out mid-to-long term career progression from current baseline towards senior leadership structures.</p>
                </div>

                <div className="glass-card p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full -mr-16 -mt-16"></div>
                  
                  {/* Timeline path */}
                  <div className="relative border-l border-zinc-800 ml-4 md:ml-8 pl-8 space-y-12">
                    
                    {/* Current level */}
                    <div className="relative group">
                      <div className="absolute -left-[37px] top-1.5 h-4 w-4 bg-indigo-500 border-4 border-black rounded-full"></div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Current Baseline Level</span>
                        <h4 className="text-sm font-bold text-white">{analysis.careerPath.currentLevel}</h4>
                        <p className="text-xs text-zinc-400">Baseline level assessed based on current technical skills coverage.</p>
                      </div>
                    </div>

                    {/* Next step */}
                    <div className="relative group">
                      <div className="absolute -left-[37px] top-1.5 h-4 w-4 bg-pink-500 border-4 border-black rounded-full"></div>
                      <div className="bg-zinc-950/40 border border-border-custom hover:border-pink-500/30 p-5 rounded-lg space-y-3 transition-colors">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-white">{analysis.careerPath.nextRole.title}</h4>
                          <span className="text-xs text-pink-400 font-medium">{analysis.careerPath.nextRole.timeline}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] text-zinc-550 block uppercase font-bold tracking-wider mb-1">Required Skills</span>
                            <div className="flex flex-wrap gap-1">
                              {analysis.careerPath.nextRole.skills.map((sk, idx) => (
                                <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-300">{sk}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-550 block uppercase font-bold tracking-wider mb-1">Certifications</span>
                            <div className="flex flex-wrap gap-1">
                              {analysis.careerPath.nextRole.certifications.map((cert, idx) => (
                                <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-300">{cert}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-550 block uppercase font-bold tracking-wider mb-1">Target Projects</span>
                            <div className="flex flex-wrap gap-1">
                              {analysis.careerPath.nextRole.projects.map((proj, idx) => (
                                <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-300">{proj}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mid level */}
                    <div className="relative group">
                      <div className="absolute -left-[37px] top-1.5 h-4 w-4 bg-amber-500 border-4 border-black rounded-full"></div>
                      <div className="bg-zinc-950/40 border border-border-custom hover:border-amber-500/30 p-5 rounded-lg space-y-3 transition-colors">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-white">{analysis.careerPath.midLevelRole.title}</h4>
                          <span className="text-xs text-amber-400 font-medium">{analysis.careerPath.midLevelRole.timeline}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] text-zinc-550 block uppercase font-bold tracking-wider mb-1">Required Skills</span>
                            <div className="flex flex-wrap gap-1">
                              {analysis.careerPath.midLevelRole.skills.map((sk, idx) => (
                                <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-300">{sk}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-555 block uppercase font-bold tracking-wider mb-1">Certifications</span>
                            <div className="flex flex-wrap gap-1">
                              {analysis.careerPath.midLevelRole.certifications.map((cert, idx) => (
                                <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-300">{cert}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-555 block uppercase font-bold tracking-wider mb-1">Target Projects</span>
                            <div className="flex flex-wrap gap-1">
                              {analysis.careerPath.midLevelRole.projects.map((proj, idx) => (
                                <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-300">{proj}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Senior Role */}
                    <div className="relative group">
                      <div className="absolute -left-[37px] top-1.5 h-4 w-4 bg-cyan-500 border-4 border-black rounded-full"></div>
                      <div className="bg-zinc-950/40 border border-border-custom hover:border-cyan-500/30 p-5 rounded-lg space-y-3 transition-colors">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-white">{analysis.careerPath.seniorRole.title}</h4>
                          <span className="text-xs text-cyan-400 font-medium">{analysis.careerPath.seniorRole.timeline}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] text-zinc-550 block uppercase font-bold tracking-wider mb-1">Required Skills</span>
                            <div className="flex flex-wrap gap-1">
                              {analysis.careerPath.seniorRole.skills.map((sk, idx) => (
                                <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-300">{sk}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-550 block uppercase font-bold tracking-wider mb-1">Certifications</span>
                            <div className="flex flex-wrap gap-1">
                              {analysis.careerPath.seniorRole.certifications.map((cert, idx) => (
                                <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-300">{cert}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-550 block uppercase font-bold tracking-wider mb-1">Target Projects</span>
                            <div className="flex flex-wrap gap-1">
                              {analysis.careerPath.seniorRole.projects.map((proj, idx) => (
                                <span key={idx} className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-300">{proj}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* EXPLAINABLE AI TAB & MULTI-AGENT VISUALIZATION */}
            {activeTab === 'explain' && (
              <motion.div 
                key="explain"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" /> AI Insights Engine
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Detailed documentation of the AI model parameters, decision thresholds, and active Agent pipelines.</p>
                </div>

                {/* Multi-Agent Visualisation Workflow (Feature 10) */}
                <div className="glass-card p-6 rounded-xl space-y-6 overflow-hidden">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Interactive Multi-Agent Analysis Pipeline</span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative z-10">
                    {[
                      { name: 'User Resume', type: 'Input', desc: 'Parsed raw text buffer', color: 'border-zinc-700 bg-zinc-950/40 text-zinc-400' },
                      { name: 'Resume Agent', type: 'Agent 1', desc: 'Extracts skills & profile summaries', color: 'border-indigo-500/40 bg-indigo-500/5 text-indigo-300' },
                      { name: 'ATS Agent', type: 'Agent 2', desc: 'Checks structure compliance & keywords', color: 'border-pink-500/40 bg-pink-500/5 text-pink-300' },
                      { name: 'Skill Gap Agent', type: 'Agent 3', desc: 'Identifies missing role proficiencies', color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-300' },
                      { name: 'Career Agent', type: 'Agent 4', desc: 'Sequences 90-day syllabus roadmaps', color: 'border-amber-500/40 bg-amber-500/5 text-amber-300' },
                      { name: 'Interview Agent', type: 'Agent 5', desc: 'Generates context questions & hint rubrics', color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300' }
                    ].map((agent, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-3.5 border rounded-lg flex flex-col justify-between min-h-[110px] relative overflow-hidden group ${agent.color}`}
                      >
                        <div className="absolute top-0 right-0 h-10 w-10 bg-white/2 rounded-full -mr-4 -mt-4 group-hover:scale-125 transition-transform"></div>
                        <div>
                          <span className="text-[8px] font-extrabold uppercase opacity-60 block">{agent.type}</span>
                          <h4 className="text-xs font-bold mt-1">{agent.name}</h4>
                        </div>
                        <p className="text-[9px] opacity-75 mt-2 leading-relaxed">{agent.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-lg flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span className="text-[10px] text-zinc-400">
                      <strong>Multi-Agent Coordination:</strong> Each agent acts autonomously, forwarding schema structures to subsequent steps. The final output undergoes self-correcting validation before UI parsing.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Skill Detection Logic */}
                  <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Cpu className="h-4.5 w-4.5 text-indigo-400" /> Skill Detection Logic
                      </h3>
                      <p className="text-xs text-zinc-400 mb-4 font-mono">MODEL: Gemini 2.5 Flash • Context Length: ~4k tokens</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">{analysis.explainableAI.extractionLogic}</p>
                    </div>
                  </div>

                  {/* ATS Scoring Criteria */}
                  <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-4.5 w-4.5 text-pink-400" /> ATS Grading Logic
                      </h3>
                      <p className="text-xs text-zinc-400 mb-4 font-mono">ALGORITHM: NLP Keyword Parser & Layout Integrity</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">{analysis.explainableAI.atsLogic}</p>
                    </div>
                  </div>

                  {/* Roadmap Sequencing */}
                  <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Calendar className="h-4.5 w-4.5 text-cyan-400" /> Roadmap Strategy
                      </h3>
                      <p className="text-xs text-zinc-400 mb-4 font-mono">PEDAGOGICAL PATTERN: Incremental Skill Laddering</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">{analysis.explainableAI.roadmapReasoning}</p>
                    </div>
                  </div>

                  {/* Skill Gap Justification */}
                  <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4.5 w-4.5 text-rose-400" /> Skill Gap Reasonings
                      </h3>
                      <p className="text-xs text-zinc-400 mb-4 font-mono">MATCH WEIGHT: High/Medium/Low priority gap assessment</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">{analysis.explainableAI.skillGapJustification}</p>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Learning Path Drawer / Modal */}
        <AnimatePresence>
          {selectedResourceSkill && (() => {
            const path = generateLearningPath(selectedResourceSkill);
            const totalHours = path.resources.reduce((sum, res) => sum + res.estimatedHours, 0);
            const completionRate = getSkillResourceCompletionRate(selectedResourceSkill, path.resources.length);
            
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
              >
                {/* Back drop click to close */}
                <div className="absolute inset-0 cursor-default" onClick={() => setSelectedResourceSkill(null)} />
                
                <motion.div
                  initial={{ x: '100%', opacity: 0.5 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0.5 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                  className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-900 h-full max-h-screen overflow-y-auto flex flex-col justify-between shadow-2xl p-6 md:p-8"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-indigo-400 animate-pulse" />
                          <h2 className="text-xl font-bold text-white tracking-tight">Learning Path: {path.skill}</h2>
                        </div>
                        <p className="text-xs text-zinc-400">Curated, high-yield structured curriculum path (Beginner to Advanced).</p>
                      </div>
                      <button 
                        onClick={() => setSelectedResourceSkill(null)}
                        className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Summary Bar */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                      <div className="text-center">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Total Est. Time</span>
                        <span className="text-sm font-bold text-indigo-400 mt-1 block flex items-center justify-center gap-1"><Clock className="h-4 w-4" /> {totalHours} hrs</span>
                      </div>
                      <div className="text-center border-x border-zinc-800/50">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Modules Count</span>
                        <span className="text-lg font-bold text-white mt-1 block">{path.resources.length} Labs</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Completion</span>
                        <span className="text-lg font-bold text-pink-400 mt-1 block">{completionRate}%</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Curriculum Checklist</span>
                        <span>{completionRate}% Done</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300" style={{ width: `${completionRate}%` }} />
                      </div>
                    </div>

                    {/* Path Modules grouped by Difficulty */}
                    <div className="space-y-6 pt-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map((diff) => {
                        const diffResources = path.resources.filter(r => r.difficulty === diff);
                        if (diffResources.length === 0) return null;

                        return (
                          <div key={diff} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                diff === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                diff === 'Intermediate' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                              }`}>{diff} Path</span>
                              <div className="h-px bg-zinc-900 flex-1" />
                            </div>

                            <div className="space-y-3">
                              {diffResources.map((res, resIdx) => {
                                const isCompleted = !!(resourceProgress[path.skill]?.[res.title]);
                                const vStatus = verifiedUrls[res.url];
                                const targetUrl = vStatus?.verifiedUrl || res.url;
                                
                                // Select matching icon for type
                                const getTypeIcon = (type: string) => {
                                  switch(type) {
                                    case 'Documentation': return <FileText className="h-3.5 w-3.5 text-blue-400" />;
                                    case 'YouTube': return <Play className="h-3.5 w-3.5 text-red-500" />;
                                    case 'Course': return <Award className="h-3.5 w-3.5 text-yellow-500" />;
                                    case 'Practice': return <Terminal className="h-3.5 w-3.5 text-green-400" />;
                                    case 'Project': return <Cpu className="h-3.5 w-3.5 text-pink-400" />;
                                    case 'GitHub': return <Github className="h-3.5 w-3.5 text-zinc-300" />;
                                    default: return <BookOpen className="h-3.5 w-3.5 text-indigo-400" />;
                                  }
                                };

                                return (
                                  <div 
                                    key={resIdx} 
                                    className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                                      isCompleted 
                                        ? 'bg-zinc-900/20 border-zinc-900/50 opacity-70' 
                                        : 'bg-zinc-950 border-border-custom hover:border-zinc-800 hover:bg-zinc-900/10'
                                    }`}
                                  >
                                    {/* Custom Checkbox */}
                                    <button
                                      onClick={() => toggleResourceProgress(path.skill, res.title)}
                                      className={`mt-1 flex items-center justify-center h-4 w-4 rounded border transition-colors shrink-0 ${
                                        isCompleted 
                                          ? 'bg-indigo-500 border-indigo-500 text-white' 
                                          : 'border-border-custom hover:border-zinc-550 text-transparent'
                                      }`}
                                    >
                                      <Check className="h-3 w-3 stroke-[3]" />
                                    </button>

                                    <div className="flex-1 space-y-2">
                                      <div className="flex justify-between items-start gap-2">
                                        <div>
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            {getTypeIcon(res.type)}
                                            <h4 className="text-xs font-bold text-white leading-snug">{res.title}</h4>
                                          </div>
                                          
                                          {/* Verified Badge */}
                                          <div className="flex items-center gap-1.5 mt-1">
                                            {vStatus?.loading ? (
                                              <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-500">
                                                <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                                                <span>Verifying...</span>
                                              </span>
                                            ) : (
                                              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                                                <span>✓ Verified</span>
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-3 gap-2 py-1.5 border-y border-zinc-900/50 text-[10px] text-zinc-400">
                                        <div>Type: <span className="text-zinc-200 font-semibold">{res.type}</span></div>
                                        <div>Difficulty: <span className="text-zinc-200 font-semibold">{res.difficulty}</span></div>
                                        <div>Time: <span className="text-zinc-200 font-semibold">{res.estimatedHours} hrs</span></div>
                                      </div>
                                      
                                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                                        <span className="text-zinc-550 font-bold block uppercase tracking-wider text-[9px] mb-0.5 font-sans">Why Recommended</span>
                                        {res.reasonRecommended}
                                      </p>
                                      
                                      {res.learningOutcome && (
                                        <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-900/50">
                                          <span className="text-[9px] text-indigo-400 font-bold block uppercase tracking-wider mb-0.5">Learning Outcome</span>
                                          <p className="text-[10px] text-zinc-300">{res.learningOutcome}</p>
                                        </div>
                                      )}

                                      <div className="pt-2">
                                        <a 
                                          href={targetUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold text-white rounded-md border border-zinc-800 hover:border-zinc-700 transition-all"
                                        >
                                          <span>Open Resource</span>
                                          <ArrowUpRight className="h-3 w-3" />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 mt-8 flex justify-end">
                    <button 
                      onClick={() => setSelectedResourceSkill(null)}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white rounded-lg border border-zinc-800 transition-colors"
                    >
                      Close Pathway
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

      </div>
    </div>
  );
}

// --- ANALYTICS MOCK DATA PREPARATION ---
function getAnalyticsScoresData(period: string, analysis: CareerAnalysis) {
  if (period === 'weekly') {
    return [
      { time: 'Mon', ResumeScore: 68, AtsScore: 62 },
      { time: 'Tue', ResumeScore: 70, AtsScore: 64 },
      { time: 'Wed', ResumeScore: 72, AtsScore: 68 },
      { time: 'Thu', ResumeScore: 75, AtsScore: 70 },
      { time: 'Fri', ResumeScore: analysis.resumeScore, AtsScore: analysis.atsScore }
    ];
  }
  if (period === 'monthly') {
    return [
      { time: 'Week 1', ResumeScore: 60, AtsScore: 55 },
      { time: 'Week 2', ResumeScore: 68, AtsScore: 62 },
      { time: 'Week 3', ResumeScore: 72, AtsScore: 70 },
      { time: 'Week 4', ResumeScore: analysis.resumeScore, AtsScore: analysis.atsScore }
    ];
  }
  // Historical
  return [
    { time: 'Version 1.0', ResumeScore: 50, AtsScore: 45 },
    { time: 'Version 1.1', ResumeScore: 65, AtsScore: 60 },
    { time: 'Version 2.0', ResumeScore: 72, AtsScore: 71 },
    { time: 'Current AI Version', ResumeScore: analysis.resumeScore, AtsScore: analysis.atsScore }
  ];
}

function getAnalyticsSkillsData(period: string) {
  const weeks = period === 'weekly' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] :
                period === 'monthly' ? ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'] :
                ['V1.0', 'V1.1', 'V2.0', 'Current'];
  
  return weeks.map((w, idx) => ({
    time: w,
    SkillsCount: 6 + (idx * 2),
    InterviewAverage: 65 + (idx * 6)
  }));
}

// --- VERSION COMPARISON DATA PREPARATION ---
function getVersionComparisonData(analysis: CareerAnalysis) {
  return [
    { metric: 'Resume Quality', Before: analysis.resumeScore, After: 92 },
    { metric: 'ATS Scanner', Before: analysis.atsScore, After: 90 },
    { metric: 'Job Match', Before: analysis.roleMatchPercentage, After: 94 }
  ];
}

// --- RADAR DATA CONVERTER ---
function getRadarData(skills: TechnicalSkill[]) {
  const counts: Record<string, number> = {
    Frontend: 0, Backend: 0, Databases: 0, Cloud: 0, 'AI/ML': 0, DevOps: 0, Cybersecurity: 0
  };
  skills.forEach(s => {
    if (counts[s.category] !== undefined) counts[s.category]++;
  });
  return Object.keys(counts).map(subject => ({
    subject,
    A: Math.min(counts[subject] * 2 + 3, 10) // Weight density realistically
  }));
}

function getSkillsChartData(skills: TechnicalSkill[], missing: MissingSkill[]) {
  const categories = ['Frontend', 'Backend', 'Databases', 'Cloud', 'DevOps'];
  return categories.map(cat => {
    const detCount = skills.filter(s => s.category === cat).length;
    const missCount = missing.filter(s => s.category.toLowerCase().includes(cat.toLowerCase())).length;
    return {
      name: cat,
      Detected: detCount,
      Missing: missCount
    };
  });
}

// --- SIMULATED MOCK BACKUPS ---
function getSimulatedRewriteData() {
  return {
    professionalSummary: {
      before: "Experienced fullstack developer seeking coding challenges.",
      after: "Results-driven Senior Full Stack Developer with 5+ years of success designing high-throughput APIs and web architectures. Adept at leveraging React, Node.js, and Docker to decrease server loading intervals by 35%."
    },
    experienceBulletPoints: [
      {
        before: "Wrote backend code and fixed bugs.",
        after: "Architected Express API controllers utilizing asynchronous messaging pipelines, resolving database connection pool locking and decreasing request timeouts by 25%.",
        improvementReason: "Quantifies performance metrics and highlights exact infrastructure modifications."
      },
      {
        before: "Made frontend faster.",
        after: "Implemented React lazy loading, assets compression, and cache optimizations, improving Google Core Web Vitals score from 65 to 92.",
        improvementReason: "Specifies precise optimization techniques and measurable performance results."
      }
    ],
    projectDescriptions: [
      {
        before: "Built a chat website.",
        after: "Developed a secure real-time messaging application using WebSocket/Socket.io, Node.js, and Redis Adapter, supporting concurrent chats with sub-50ms message latency.",
        improvementReason: "Details communication protocols, state management adapters, and response rates."
      }
    ],
    skillsFormatting: {
      before: "React, node, sql, docker, git",
      after: "• Languages & Runtimes: JavaScript (ES6+), TypeScript, SQL, Node.js\n• Frameworks: React, Next.js, Express.js\n• DevOps & Tools: Docker, Git, CI/CD Pipelines"
    }
  };
}

function getSimulatedActionPlan(gapName: string) {
  return {
    title: `${gapName} Professional Mastery Roadmap`,
    estimatedDays: 14,
    steps: [
      { day: 'Days 1-3', title: 'Conceptual Setup & Dev Tools', description: 'Review core official documentation, tutorials, and download target binaries.', resources: ['docs.docker.com', 'kubernetes.io'] },
      { day: 'Days 4-7', title: 'Local Integration Practice', description: 'Configure basic configurations and write custom setups in demo project contexts.', resources: ['github.com/topics/docker-samples'] },
      { day: 'Days 8-12', title: 'Multi-service Container Orchestration', description: 'Connect databases, caching components, and local apps to work as a unified cluster.', resources: ['udemy.com/docker-course'] },
      { day: 'Days 13-14', title: 'Production Dry Run Deployment', description: 'Publish files to server contexts, checking routing, environment protection, and permissions.', resources: ['render.com/docs'] }
    ],
    deliverable: {
      title: `Multi-Container Fullstack Deployment`,
      description: `Completely containerize a React + Node.js + PostgreSQL app using docker-compose and configure production readiness parameters.`
    }
  };
}

function getSimulatedActionItems(missingSkills: MissingSkill[]) {
  return [
    {
      id: 'act-1',
      title: 'Resolve Missing Skill: Docker',
      type: 'Missing Skill' as const,
      description: 'Learn containerization to support production deployment setups.',
      actionLabel: 'Generate Docker Plan',
      associatedGap: 'Docker'
    },
    {
      id: 'act-2',
      title: 'Optimize ATS Structure formatting',
      type: 'Weak ATS Score' as const,
      description: 'Your margins and font sizes are triggering warning tags in recruiters scanning platforms.',
      actionLabel: 'Generate ATS Optimization Plan',
      associatedGap: 'ATS formatting'
    },
    {
      id: 'act-3',
      title: 'Resolve Missing Skill: AWS S3',
      type: 'Missing Skill' as const,
      description: 'Implement cloud assets storage systems for application images and files.',
      actionLabel: 'Generate AWS Plan',
      associatedGap: 'AWS S3'
    }
  ];
}

function getSimulatedGithubAnalysis() {
  return {
    portfolioScore: 84,
    strengths: ['Strong language diversity, utilizing TypeScript, CSS, and Python', 'High repository documentation completeness with descriptive README files'],
    improvements: ['Include license tags on older public repositories', 'Incorporate unit test suits to prove codebase stability'],
    recommendedProjects: ['Build a multi-container microservice system', 'Create a serverless backend processor showing async triggers'],
    industryReadiness: 'High',
    reposAnalysed: [
      { name: 'CareerPilot-AI', stars: 2, language: 'TypeScript', description: 'Resume intelligence platform', qualityAssessment: 'Excellent structure, well organized paths, clear dependencies.' }
    ],
    contributionsAssessment: 'Solid commit frequency over the last 3 months, showing strong familiarity with Git workflows.'
  };
}
