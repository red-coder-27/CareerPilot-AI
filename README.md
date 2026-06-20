# 🚀 CareerPilot AI

### *AI-Powered Resume Analyzer & Career Intelligence Platform*

[![GitHub Stars](https://img.shields.io/github/stars/nithesh-s/careerpilot-ai?style=for-the-badge&color=818cf8)](https://github.com/red-coder-27/CareerPilot-AI)
[![License: MIT](https://img.shields.io/badge/License-MIT-f43f5e?style=for-the-badge)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-06b6d4?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-ec4899?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

---

CareerPilot AI is a production-grade, startup-backed SaaS platform designed to bridge the gap between candidate qualifications and enterprise hiring expectations. By combining structural resume parsing, ATS compatibility checking, automated learning path sequencing, and real-time interview simulator scoring, the platform serves as an autonomous co-pilot for your career journey.

---

---

## ⚡ Features Matrix

| Module | Feature | Target Audience | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | NextAuth v5 & Google OAuth | Candidates | Secure login, session management, and personalized user dashboard. |
| **Analysis** | AI Resume Evaluation | Developers, Students | Evaluates experience, achievements, and formatting indices. |
| **Scoring** | ATS Keyword Matching | Students, Job Seekers | Computes keyword density against standard hiring matrices. |
| **Syllabus** | 90-Day Roadmap | Developers, Students | Generates Day 30/60/90 learning phases based on role gaps. |
| **Practice** | Interview Simulator | Candidates | Grade transcripts using STAR methodology with sample replies. |
| **Optimize** | Google XYZ Rewriter | Resume Editors | Transforms accomplishments using metric-based impact formats. |
| **Insight** | Recruiter Perspective | Recruiters, Employers | Evaluates candidate risk factors and confidence ratings. |
| **DevOps** | GitHub Analyzer | Open Source, Devs | Evaluates public code quality, licenses, and documentation. |
| **Syllabus** | Action Center Plans | Students | Sequences custom 14-day study tasks for any selected skill. |

---

---

## ⚙️ Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/red-coder-27/careerpilot-ai.git
cd careerpilot-ai
```

### 2. Install Project Dependencies
Ensure node.js (v18.0+) is installed. Run:
```bash
npm install
```

### 3. Environment Variables Configuration
Configure a `.env` file in the root folder:
```env
# Google Gemini API Access (Required)
GEMINI_API_KEY=AIzaSy...

# Database Connection (Optional; defaults to local db.json fallback if blank)
DATABASE_URL="postgresql://postgres:password@localhost:5432/careerpilot?schema=public"

# NextAuth Configurations (Optional - authentication setups)
NEXTAUTH_SECRET=a_secure_nextauth_secret_token
NEXTAUTH_URL=http://localhost:3000

# GitHub API access token (Optional; raises rate limits for github portfolio analyzer)
GITHUB_TOKEN=ghp_...
```

### 4. Run database migrations (If PostgreSQL is connected)
```bash
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the development build.

### 6. Compile Production Version
To test production optimization build, run:
```bash
npm run build
npm run start
```

---

## 📁 Workspace Directory Structure

```
├── prisma/                  # Prisma DB Configurations
│   └── schema.prisma        # Prisma Database Schema definitions
├── public/                  # Static assets & screenshots
├── src/
│   ├── app/                 # Next.js App Router (Layouts & Routes)
│   │   ├── api/             # Backend API Endpoint Handlers
│   │   │   ├── action/      # /api/action - Dynamic Action Path generator
│   │   │   ├── analyze/     # /api/analyze - Core Resume parser & analyst
│   │   │   ├── auth/        # /api/auth/[...nextauth] - NextAuth route handlers
│   │   │   ├── github/      # /api/github - GitHub portfolio processor
│   │   │   ├── interview/   # /api/interview - simulator setups & evaluations
│   │   │   ├── rewrite/     # /api/rewrite - XYZ bullet points generator
│   │   │   └── verify-resource/ # /api/verify-resource - resource verifications
│   │   ├── layout.tsx       # Root layout file configuration
│   │   └── page.tsx         # Main entry point (Landing vs Dashboard toggle)
│   ├── components/          # Reusable React components
│   │   ├── landing-view.tsx # Initial setup form & resume drag-drop handler
│   │   └── dashboard-view.tsx # Main dashboard panels & Recharts controls
│   ├── lib/                 # Core utilities & analytical catalogs
│   │   ├── db.ts            # Resilient Prisma client with JSON fallback
│   │   ├── parser.ts        # raw PDF parser tool
│   │   └── recommendationEngine.ts # Learning paths resource mapping catalog
│   ├── types/               # TypeScript interface schemas
│   ├── auth.config.ts       # Edge-compatible NextAuth configurations
│   ├── auth.ts              # Database-connected NextAuth handler
│   └── middleware.ts        # Edge route protection middleware
├── tailwind.config.ts       # Tailwind CSS v4 configurations
├── tsconfig.json            # TypeScript compile configurations
└── README.md                # Project documentation
```

---

## 🔐 Authentication & Session Security

The platform integrates secure, production-ready authentication powered by **NextAuth v5 (Auth.js)** with Google OAuth 2.0.

### 🛡️ Edge-Safe Split Architecture
Because Next.js middleware runs in the Edge runtime, standard Node database drivers cannot be executed directly inside middleware. We resolved this by implementing a modular auth split:
1. **`auth.config.ts`**: A lightweight, Edge-compatible configuration containing only credentials providers (Google OAuth), session strategies, and authentication callback rules.
2. **`auth.ts`**: The server-side entry point extending `auth.config.ts` with the Neon PostgreSQL database adapter (`@auth/prisma-adapter`).
3. **`middleware.ts`**: Standard Next.js route guard instantiated using `auth.config.ts`, protecting all dashboard paths without triggering edge bundling warnings.

### ⛔ Route Protection Guard
Unauthenticated visitors attempting to view dashboard subpaths are automatically intercepted and redirected to the home landing page:
- `/dashboard`
- `/analyze`
- `/history`
- `/interview`
- `/career`

---

## 🧠 AI Analytical Workflows

CareerPilot AI uses the `gemini-2.5-flash` model with strict JSON schematization to handle extraction tasks:

* **Resume Processing**: The user uploads a resume. `parser.ts` extracts raw content. The text is passed with a role compatibility prompt to evaluate industry alignment.
* **Skill Extraction**: Extracts hard/soft skills and maps them to standard categorizations (e.g. Frontend, Databases, DevOps, Cloud) to feed the dashboard radar maps.
* **ATS Analysis**: Evaluates layout, keyword density, section placement, and formatting, outputting an optimization percentage score.
* **Roadmap Generation**: Maps out a three-phase study schedule (Days 30, 60, 90) focusing on high-priority missing skills.
* **Interview Question Compiler**: Analyzes the resume's weaknesses and target role requirements, creating a tailored list of questions with structural hints.

---

## 📖 API Documentation

### 1. Resume Analysis API (`POST /api/analyze`)
Parses, extracts, and evaluates resumes.
- **Request Body**: `FormData` containing:
  - `resume`: File (`.pdf` or `.txt`)
  - `role`: Target Job Title (string)
  - `jobDescription`: Target job guidelines (optional string)
- **Response Shape (200 OK)**:
```json
{
  "id": "analysis-uuid",
  "resumeScore": 84,
  "atsScore": 81,
  "roleMatchPercentage": 78,
  "industryReadiness": "Medium",
  "summary": "Full stack engineer with solid frontend credentials...",
  "technicalSkills": [{ "name": "React", "category": "Frontend" }],
  "missingSkills": [{ "name": "Docker", "category": "DevOps", "importance": "High" }]
}
```

### 2. Action Center API (`POST /api/action`)
Compiles a step-by-step master plan for an individual skill.
- **Request Body**: `application/json`
```json
{
  "gapName": "Docker",
  "gapType": "Missing Skill",
  "targetRole": "Fullstack Engineer"
}
```
- **Response Shape (200 OK)**:
```json
{
  "title": "Docker Professional Mastery Roadmap",
  "estimatedDays": 14,
  "steps": [
    { "day": "Days 1-3", "title": "Conceptual Setup", "description": "Download and install binaries..." }
  ],
  "deliverable": { "title": "Containerized React App", "description": "Completely containerize React + Node" }
}
```

### 3. Interview Evaluation API (`POST /api/interview/evaluate`)
Grades user interview simulator answers.
- **Request Body**: `application/json`
```json
{
  "question": "How do you optimize React rendering?",
  "answer": "I use React.memo and useCallback to avoid unnecessary updates.",
  "category": "Technical",
  "targetRole": "Frontend Engineer"
}
```
- **Response Shape (200 OK)**:
```json
{
  "score": 85,
  "strengths": ["Identified correct optimization APIs"],
  "weaknesses": ["Missed quantifying render metrics in explanations"],
  "improvements": ["Elaborate on how virtual DOM updates are handled"],
  "sampleBetterAnswer": "I leverage React.memo to cache components..."
}
```

---

## ⚡ Performance Optimizations

* **Server Actions**: Reduces client-side bundle sizes by moving processing utilities (e.g. Gemini prompt generation and database writing) to server threads.
* **Component Lazy Loading**: Uses Next.js dynamic imports (`next/dynamic`) to split Recharts analytics modules from the core dashboard render path.
* **React Suspense**: Incorporates skeletons and fallbacks during API evaluations.
* **Cached Database Fallbacks**: Speeds up repeated dashboard visits by saving analysis data to local/PostgreSQL databases.

---

## 🔒 Security Practices

* **Strict File Validation**: Restricts uploads strictly to `.pdf` and `.txt` files with strict file size limits (5MB) on the server.
* **Input Sanitization**: Scrubs raw parsed text buffers of code scripts or injection vectors before generating AI prompt contexts.
* **Endpoint Protection**: Enforces rate limiting on AI API route calls to prevent exhaustion.
* **Environment Protection**: Kept tokens and APIs isolated using process variables.

---

## 🗺️ Product Roadmap

- [ ] **Multi-Agent Orchestration**: Divide profile evaluations into specialized agent roles (Recruiting, Developer, and ATS specialist agents).
- [ ] **Real-Time Job Feeds**: Match candidates to active roles using job search integrations.
- [ ] **Recruiter Collaboration Portal**: Secure dashboard sharing for hiring managers to review verified candidate evaluations.
- [ ] **AI Career Coach Chat**: A conversational assistant to walk through learning steps.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
