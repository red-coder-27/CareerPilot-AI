'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Sparkles, AlertCircle, ArrowRight, Shield, 
  Map, Terminal, HelpCircle, Layers, CheckCircle, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerAnalysis } from '@/types';

import { signIn } from 'next-auth/react';
import { Session } from 'next-auth';

interface LandingViewProps {
  session: Session | null;
  onAnalysisComplete: (analysis: CareerAnalysis, role: string) => void;
  onViewDemo: () => void;
}

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI Engineer',
  'Data Scientist',
  'Cybersecurity Analyst',
  'Cloud Engineer',
  'DevOps Engineer'
];

const FEATURES = [
  {
    title: 'Resume Intelligence',
    description: 'Deep content extraction evaluating readability, grammar, impact metrics, and overall professional quality.',
    icon: BrainCircuit,
    color: 'text-indigo-400'
  },
  {
    title: 'ATS Optimization',
    description: 'Structure and formatting checks against enterprise scanners to ensure you bypass automated filters.',
    icon: Shield,
    color: 'text-pink-400'
  },
  {
    title: 'Skill Gap Analysis',
    description: 'Compares your expertise against target roles to identify missing high, medium, and low-priority skills.',
    icon: Layers,
    color: 'text-cyan-400'
  },
  {
    title: 'Career Roadmaps',
    description: 'Personalized 30-60-90 day timeline with weekly learning objectives and portfolio goals.',
    icon: Map,
    color: 'text-emerald-400'
  },
  {
    title: 'Interview Preparation',
    description: 'Custom question engine generating 15-20 target questions matching your exact background and weaknesses.',
    icon: HelpCircle,
    color: 'text-amber-400'
  },
  {
    title: 'Project Recommendations',
    description: 'Tailored project specs across difficulty ranges to help you prove hands-on mastery of new skills.',
    icon: Terminal,
    color: 'text-rose-400'
  }
];

export default function LandingView({ session, onAnalysisComplete, onViewDemo }: LandingViewProps) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState(session?.user?.email || '');
  const [githubUrl, setGithubUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  React.useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);
  
  // Loading & Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [progressVal, setProgressVal] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingSteps = [
    'Parsing file contents and checking structure...',
    'Analyzing format, layout, and ATS compliance...',
    'Initiating Gemini AI Resume Intelligence Engine...',
    'Performing role comparison & identifying skill gaps...',
    'Generating 90-day learning roadmap and projects...',
    'Formulating personalized interview preparation...'
  ];

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile: File): boolean => {
    setError(null);
    
    // Validate File Type
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Unsupported file type. Please upload a PDF or TXT resume.');
      return false;
    }

    // Validate File Size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File is too large. Maximum allowed size is 10MB.');
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Upload and Call API
  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    setProgressVal(0);
    setProcessingStep(0);

    // Simulate progress while waiting for Gemini API response
    const progressInterval = setInterval(() => {
      setProgressVal(prev => {
        if (prev >= 98) {
          clearInterval(progressInterval);
          return 98;
        }
        
        // Progress steps increase
        const nextVal = prev + Math.floor(Math.random() * 4) + 1;
        
        // Increment processing text step based on percentage
        const nextStepIdx = Math.min(
          Math.floor((nextVal / 100) * processingSteps.length),
          processingSteps.length - 1
        );
        setProcessingStep(nextStepIdx);
        
        return nextVal;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetRole', selectedRole);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription);
      }
      if (githubUrl.trim()) {
        formData.append('githubUrl', githubUrl);
      }
      if (email.trim()) {
        formData.append('email', email);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze resume.');
      }

      setProgressVal(100);
      const data: CareerAnalysis = await response.json();
      
      // Delay transition briefly so user sees 100% completion
      setTimeout(() => {
        onAnalysisComplete(data, selectedRole);
      }, 500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during processing. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Landing Page Content */}
      <AnimatePresence mode="wait">
        {!isProcessing ? (
          <motion.div
            key="landing-hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-24"
          >
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline and Upload Card */}
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-indigo-300 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Career Advisor
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                    Transform Your Resume <br />
                    <span className="bg-gradient-to-r from-primary via-indigo-400 to-accent bg-clip-text text-transparent">
                      Into a Career Roadmap
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
                    AI-powered resume intelligence that reveals strengths, scans for ATS compatibility, identifies critical skill gaps, and generates personalized learning roadmaps.
                  </p>
                </div>

                {/* Upload & Role Selection Component */}
                <div className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
                  
                  <div className="space-y-6">
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">1. Select Target Career Role</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {ROLES.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setSelectedRole(role)}
                            className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-all truncate ${
                              selectedRole === role 
                                ? 'bg-primary/20 border-primary/50 text-indigo-300 shadow-sm shadow-primary/10' 
                                : 'bg-zinc-950/40 border-border-custom hover:border-zinc-800 text-zinc-400'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Profile details & Github */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-zinc-455 uppercase block">2. Email (Optional)</label>
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-zinc-950/40 border border-border-custom hover:border-zinc-800 focus:border-primary text-zinc-300 focus:outline-none text-xs rounded-lg p-2.5 w-full transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-zinc-455 uppercase block">3. GitHub URL (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://github.com/username"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className="bg-zinc-950/40 border border-border-custom hover:border-zinc-800 focus:border-primary text-zinc-300 focus:outline-none text-xs rounded-lg p-2.5 w-full transition-all"
                        />
                      </div>
                    </div>

                    {/* Paste Job Description */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-455 uppercase block">4. Paste Job Description (Optional)</label>
                      <textarea
                        placeholder="Paste target job description to match against your resume..."
                        rows={3}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="bg-zinc-950/40 border border-border-custom hover:border-zinc-800 focus:border-primary text-zinc-300 focus:outline-none text-xs rounded-lg p-2.5 w-full transition-all resize-none"
                      />
                    </div>


                    {/* Drag and Drop Zone */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">5. Upload Resume</label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileInput}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                          dragActive 
                            ? 'border-indigo-500 bg-indigo-500/5' 
                            : file 
                              ? 'border-emerald-500/50 bg-emerald-500/5' 
                              : 'border-border-custom hover:border-zinc-700 bg-zinc-950/40'
                        }`}
                      >
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.txt"
                          className="hidden"
                        />

                        {file ? (
                          <div className="space-y-3 flex flex-col items-center">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">{file.name}</p>
                              <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF/TXT Format</p>
                            </div>
                            <span className="text-[11px] text-zinc-500 hover:text-zinc-400 underline">Change file</span>
                          </div>
                        ) : (
                          <div className="space-y-3 flex flex-col items-center">
                            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 group-hover:text-indigo-400 transition-colors">
                              <Upload className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-zinc-300">Drag & drop your resume, or <span className="text-indigo-400">browse</span></p>
                              <p className="text-xs text-zinc-500 mt-1">Supports PDF & TXT formats up to 10 MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error Alerts */}
                    {error && (
                      <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg text-rose-300 text-xs flex items-start gap-2">
                        <AlertCircle className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      {session ? (
                        <button
                          onClick={handleAnalyze}
                          disabled={!file}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-primary/10 cursor-pointer"
                        >
                          Analyze Resume <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => signIn('google')}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-indigo-500/20 cursor-pointer"
                        >
                          Sign In with Google to Analyze
                        </button>
                      )}
                      <button
                        onClick={onViewDemo}
                        className="py-3 px-6 bg-zinc-900 border border-border-custom hover:border-zinc-700 text-zinc-300 font-semibold rounded-xl transition-all hover:bg-zinc-800"
                      >
                        View Demo Mode
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visuals (Dashboard Mockup / Interactive Cards) */}
              <div className="lg:col-span-5 relative hidden lg:block">
                {/* Background decorative glow */}
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Floating Skill Badges */}
                <div className="absolute -top-6 -left-6 z-20 animate-float">
                  <div className="px-3.5 py-1.5 bg-zinc-900/80 backdrop-blur border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full"></span> React Hooks
                  </div>
                </div>

                <div className="absolute top-24 -right-8 z-20 animate-float-delayed">
                  <div className="px-3.5 py-1.5 bg-zinc-900/80 backdrop-blur border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="h-2 w-2 bg-indigo-500 rounded-full"></span> System Design
                  </div>
                </div>

                <div className="absolute bottom-12 -left-12 z-20 animate-float">
                  <div className="px-3.5 py-1.5 bg-zinc-900/80 backdrop-blur border border-pink-500/30 text-pink-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="h-2 w-2 bg-pink-500 rounded-full"></span> Docker & AWS
                  </div>
                </div>

                {/* Dashboard Mockup Card */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-2xl relative z-10 w-full rotate-2 transform hover:rotate-0 hover:scale-[1.02] transition-all duration-500">
                  <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 bg-red-500 rounded-full"></span>
                      <span className="h-3 w-3 bg-amber-500 rounded-full"></span>
                      <span className="h-3 w-3 bg-emerald-500 rounded-full"></span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">dashboard_preview.tsx</span>
                  </div>

                  <div className="space-y-4">
                    {/* Mock Profile Card */}
                    <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-center justify-center font-bold text-indigo-400">
                        84
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-zinc-800 rounded w-24"></div>
                        <div className="h-2 bg-zinc-800 rounded w-16 mt-2"></div>
                      </div>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">ATS Match</span>
                    </div>

                    {/* Skill radar wireframe */}
                    <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-lg h-36 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center relative">
                        <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border border-indigo-500/30 bg-primary/10"></div>
                        </div>
                        {/* Spoke lines */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-zinc-800/80"></div>
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-zinc-800/80"></div>
                      </div>
                    </div>

                    {/* Insight Cards Mock */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                        <span className="text-[9px] font-bold text-emerald-400 block mb-1">STRENGTH</span>
                        <div className="h-2 bg-zinc-800 rounded w-16"></div>
                      </div>
                      <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-lg">
                        <span className="text-[9px] font-bold text-pink-400 block mb-1">SKILL GAP</span>
                        <div className="h-2 bg-zinc-800 rounded w-16"></div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* FEATURES GRID */}
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Full Suite Career Intelligence</h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">Everything you need to scan your profile, optimize your layout, and build the ultimate technical roadmap.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="glass-card p-6 rounded-xl space-y-4">
                      <div className={`p-2.5 bg-zinc-900 border border-zinc-850 rounded-lg w-fit ${feat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{feat.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        ) : (
          /* PROCESSING / LOADING SCREEN */
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto py-16 text-center space-y-8"
          >
            {/* AI Chip Animation */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-slow"></div>
              <div className="absolute inset-0 border border-indigo-500/40 rounded-full animate-spin" style={{ animationDuration: '6s' }}></div>
              <div className="absolute inset-2 border border-pink-500/20 border-dashed rounded-full animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}></div>
              <div className="h-16 w-16 bg-zinc-950 border border-border-custom rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/20 z-10">
                <BrainCircuit className="h-8 w-8 animate-pulse-slow" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white tracking-tight">Analyzing Resume Profile</h2>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">Our Gemini intelligence engine is parsing and benchmarking your resume against 10,000+ industry job descriptions.</p>
            </div>

            {/* Simulated Multi-Step Progress Loader */}
            <div className="space-y-4 bg-zinc-950/60 p-6 rounded-2xl border border-border-custom">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Intelligence Analysis</span>
                  <span>{progressVal}%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary via-indigo-500 to-accent h-1.5 rounded-full transition-all duration-300" style={{ width: `${progressVal}%` }}></div>
                </div>
              </div>
              
              {/* Dynamic Step Text */}
              <div className="min-h-[24px]">
                <p className="text-xs text-indigo-300 font-semibold flex items-center justify-center gap-2">
                  <span className="h-2 w-2 bg-indigo-400 rounded-full animate-ping"></span>
                  {processingSteps[processingStep]}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-zinc-600">This process typically takes 10 to 15 seconds. Please do not close or reload this window.</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
