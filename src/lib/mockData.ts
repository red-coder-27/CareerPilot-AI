import { CareerAnalysis } from '@/types';

export const mockCareerAnalysis: CareerAnalysis = {
  resumeScore: 78,
  atsScore: 84,
  industryReadiness: 'Medium',
  roleMatchPercentage: 72,
  summary: 'A solid Junior Full Stack Developer profile with strong core Javascript/TypeScript skills and React experience. The resume shows a great academic background and a few promising projects. However, to excel in a mid-to-senior Full Stack Developer role, the candidate needs to acquire experience with production-grade backend scaling, cloud architectures (AWS/GCP), containerization, and advanced system design principles.',
  
  technicalSkills: [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'HTML5/CSS3', category: 'Frontend' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'TailwindCSS', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Backend' },
    { name: 'MongoDB', category: 'Databases' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'Git', category: 'Problem Solving' },
    { name: 'Data Structures', category: 'Problem Solving' }
  ],
  
  softSkills: [
    'Collaboration & Teamwork',
    'Effective Written Communication',
    'Agile Methodologies',
    'Self-Directed Learning',
    'Analytical Problem Solving'
  ],
  
  missingSkills: [
    { name: 'AWS (S3, EC2, RDS)', category: 'Cloud', importance: 'High' },
    { name: 'Docker', category: 'DevOps', importance: 'High' },
    { name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps', importance: 'Medium' },
    { name: 'Redis (Caching)', category: 'Databases', importance: 'Medium' },
    { name: 'System Design & Scalability', category: 'Problem Solving', importance: 'High' },
    { name: 'GraphQL', category: 'Backend', importance: 'Low' },
    { name: 'Jest & RTL (Unit Testing)', category: 'Frontend', importance: 'Medium' }
  ],
  
  recommendedSkills: [
    { name: 'AWS Cloud Practitioner', category: 'Cloud' },
    { name: 'Docker & Kubernetes', category: 'DevOps' },
    { name: 'Redis Caching & Queue Management', category: 'Databases' },
    { name: 'System Design Patterns', category: 'Problem Solving' },
    { name: 'Jest / Playwright Testing', category: 'Frontend' }
  ],
  
  strengths: [
    'Strong foundation in modern frontend tech (React, Next.js, TypeScript).',
    'Experience working with both SQL (PostgreSQL) and NoSQL (MongoDB) databases.',
    'Clear project documentation and git workflow implementation.',
    'Excellent academic record in computer science fundamentals.'
  ],
  
  weaknesses: [
    'No demonstrated experience in cloud deployment or infrastructure management.',
    'Lack of test coverage (Unit/Integration testing) in projects.',
    'No microservices, queue systems, or caching strategies mentioned.'
  ],
  
  improvements: [
    'Containerize existing applications using Docker and add setup scripts.',
    'Deploy at least one full stack application on AWS using ECS, RDS, and S3.',
    'Integrate unit testing with Jest and integration testing with Cypress into front-end projects.',
    'Write a technical article explaining system design tradeoffs for a past project.'
  ],
  
  recommendedRoles: [
    'Frontend Developer',
    'Junior Full Stack Engineer',
    'Backend API Developer',
    'Node.js Engineer'
  ],
  
  careerSuggestions: [
    'Focus on learning cloud primitives (compute, database, storage) on AWS/GCP.',
    'Build a microservices-based project to demonstrate message queue usage (RabbitMQ/Kafka).',
    'Optimize existing database queries using indexes and database profiling tools.'
  ],
  
  atsAnalysis: {
    structureScore: 88,
    formattingScore: 80,
    keywordDensityScore: 75,
    contactInfoPresent: true,
    risks: [
      'Lack of quantifiable metrics in project descriptions (e.g., "improved speed by 20%").',
      'The resume uses a two-column layout which might confuse some legacy ATS scanners.',
      'Missing standard sections like "Certifications" or "Professional Affiliations".'
    ],
    recommendations: [
      'Rewrite project bullets using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
      'Convert the resume to a clean, single-column chronological format.',
      'Add key DevOps and Cloud keywords (Docker, AWS, CI/CD) to pass automatic filters.'
    ]
  },
  
  roadmap: {
    plan30Days: {
      tasks: [
        'Week 1: Core Docker concepts. Write Dockerfiles for your frontend and backend repositories. Build and run locally.',
        'Week 2: Learn Docker Compose to link backend APIs, frontend client, and a local PostgreSQL instance.',
        'Week 3: Explore AWS basics (IAM, EC2, S3). Deploy a Node.js app on a virtual EC2 machine manually.',
        'Week 4: Set up automated CI/CD using GitHub Actions to lint, test, and build your app on every commit.'
      ],
      projects: [
        {
          title: 'Dockerized Multi-Container App',
          description: 'A React frontend, Express API, and PostgreSQL DB containerized and orchestrated via Docker Compose.',
          techs: ['Docker', 'Docker Compose', 'Node.js', 'PostgreSQL', 'React']
        }
      ],
      resources: [
        {
          title: 'Docker & Docker Compose Complete Guide',
          type: 'Course',
          url: 'https://docs.docker.com/get-started/',
          difficulty: 'Beginner',
          estimatedHours: 8,
          learningPriority: 'High'
        },
        {
          title: 'GitHub Actions Official Quickstart',
          type: 'Official Documentation',
          url: 'https://docs.github.com/en/actions/quickstart',
          difficulty: 'Beginner',
          estimatedHours: 3,
          learningPriority: 'Medium'
        }
      ]
    },
    plan60Days: {
      tasks: [
        'Week 5-6: Deep dive into Caching and Message Queues. Set up Redis for session caching and caching database query results.',
        'Week 7: Implement background jobs using BullMQ and Redis for tasks like sending automated emails.',
        'Week 8: Build and host a full stack app on AWS using AWS ECS (Fargate) for containers and RDS for the database.'
      ],
      skills: ['Redis Caching', 'AWS ECS', 'Message Queues (BullMQ)', 'SQL Optimization'],
      focus: 'Developing a robust, production-grade backend portfolio piece with caching and background processing.',
      resources: [
        {
          title: 'Caching Strategies with Redis',
          type: 'Practice Platform',
          url: 'https://redis.io/commands/',
          difficulty: 'Intermediate',
          estimatedHours: 6,
          learningPriority: 'Medium'
        },
        {
          title: 'AWS Containerized Deployment Tutorial',
          type: 'YouTube Resource',
          url: 'https://aws.amazon.com/ecs/',
          difficulty: 'Advanced',
          estimatedHours: 12,
          learningPriority: 'High'
        }
      ]
    },
    plan90Days: {
      tasks: [
        'Week 9-10: Learn System Design concepts. Understand load balancers, rate limiting, horizontal vs vertical scaling.',
        'Week 11: Add unit and integration testing. Implement Jest/React Testing Library and write 80%+ test coverage.',
        'Week 12: Resume updates (adding cloud and DevOps keywords), portfolio styling, and mock technical interviews.'
      ],
      skills: ['System Design', 'Jest & RTL', 'Rate Limiting', 'Load Balancers'],
      focus: 'Advanced architectures, comprehensive test coverage, interview prep, and sending applications.',
      resources: [
        {
          title: 'System Design Interview Primer',
          type: 'Practice Platform',
          url: 'https://github.com/donnemartin/system-design-primer',
          difficulty: 'Advanced',
          estimatedHours: 20,
          learningPriority: 'High'
        },
        {
          title: 'Unit Testing React Apps with Jest',
          type: 'Course',
          url: 'https://jestjs.io/docs/getting-started',
          difficulty: 'Intermediate',
          estimatedHours: 8,
          learningPriority: 'Medium'
        }
      ]
    }
  },
  
  interviewQuestions: [
    {
      question: 'Explain the difference between Next.js SSR (Server-Side Rendering) and SSG (Static Site Generation). When would you use which?',
      category: 'Technical',
      hint: 'SSR renders HTML on each request, ideal for dynamic pages (e.g., dashboard). SSG renders at build time, ideal for speed and SEO on static content (e.g., blog, landing page).'
    },
    {
      question: 'What is the purpose of TypeScript Generics, and how do they differ from using "any"?',
      category: 'Technical',
      hint: 'Generics allow creating reusable components/functions that work with multiple types while maintaining strict compile-time type safety. "any" completely disables type checking.'
    },
    {
      question: 'How does Node.js handle asynchronous operations if Javascript is single-threaded?',
      category: 'Technical',
      hint: 'Explain the Event Loop, Call Stack, Callback Queue, and how Node offloads heavy tasks (like I/O) to the underlying C++ thread pool (libuv).'
    },
    {
      question: 'In your database design, when would you choose PostgreSQL over MongoDB?',
      category: 'Technical',
      hint: 'Choose PostgreSQL (SQL) when you need ACID compliance, complex relational queries, and strict schemas. Choose MongoDB (NoSQL) for high-write loads, horizontal scaling, and flexible document shapes.'
    },
    {
      question: 'Explain how you would handle user authentication and session management securely in a Next.js application.',
      category: 'Technical',
      hint: 'Discuss JWTs in HttpOnly cookies, OAuth providers, NextAuth.js (Auth.js), session database storage vs stateless tokens, and middleware-based route protection.'
    },
    {
      question: 'Tell me about a time you encountered a difficult technical bug in a project. How did you diagnose and solve it?',
      category: 'Resume-Based',
      hint: 'Structure using the STAR method: Situation, Task, Action (explain debugger, network tab, logs), Result. Emphasize your logical troubleshooting steps.'
    },
    {
      question: 'Your resume shows a full stack project using React and MongoDB. How did you structure your API routes, and how did you handle error validation?',
      category: 'Project',
      hint: 'Talk about modular routing, global error-handling middleware, validating payloads on the server using tools like Zod, and returning clear HTTP status codes.'
    },
    {
      question: 'I noticed your projects lack automated tests. How would you go about adding tests to your existing React applications?',
      category: 'Weakness-Oriented',
      hint: 'Acknowledge the gap. Explain that you would implement Jest and React Testing Library, starting with core utility helper functions, followed by major component behavior tests.'
    },
    {
      question: 'Why do you want to become a Full Stack Developer, and how do you stay updated with the rapidly changing ecosystem?',
      category: 'HR',
      hint: 'Express passion for solving problems end-to-end. Mention reading tech blogs (Dev.to, Medium), listening to podcasts (Syntax.fm), newsletter subscriptions, and building hobby projects.'
    },
    {
      question: 'How do you handle conflict or differing technical opinions within a development team?',
      category: 'HR',
      hint: 'Emphasize constructive dialogue, backing arguments with data or quick prototypes, prioritizing team consensus and project goals, and committing to the final decision even if you disagreed initially.'
    },
    {
      question: 'What is the Event Loop in Javascript, and how do microtasks (Promises) and macrotasks (setTimeout) behave inside it?',
      category: 'Technical',
      hint: 'Microtasks are executed immediately after the current operation finishes and before the next event loop tick/macrotask. Promises go to microtask queue, setTimeout goes to macrotask queue.'
    },
    {
      question: 'Explain the concept of database indexes. When do they help, and what are their drawbacks?',
      category: 'Technical',
      hint: 'Indexes speed up SELECT queries by creating lookup data structures. However, they slow down write operations (INSERT, UPDATE, DELETE) and consume additional disk space.'
    },
    {
      question: 'What is Cross-Origin Resource Sharing (CORS), and how do you resolve CORS issues in a Node.js/Express backend?',
      category: 'Technical',
      hint: 'CORS is a browser security mechanism that restricts cross-origin HTTP requests. Resolve it in Express by using the "cors" middleware and configuring allowed origins, headers, and methods.'
    },
    {
      question: 'If a page on your Next.js application is loading very slowly, how would you go about profiling it and locating the bottleneck?',
      category: 'Technical',
      hint: 'Check Network Tab (waterfall, TTFB), run Lighthouse audits, profile React renders using React DevTools Profiler, and check server response times/database query times.'
    },
    {
      question: 'Explain the concept of "Infrastructure as Code" (IaC) and why tools like Terraform are widely used in DevOps.',
      category: 'Technical',
      hint: 'IaC allows declaring cloud infrastructure in configuration files. It enables version control, automated provisioning, reproducibility, and prevents manual configuration errors.'
    }
  ],
  
  projects: [
    {
      title: 'Real-time Chat App with Custom Caching',
      description: 'A Dockerized real-time chat platform using Socket.io, Node.js, and React, using Redis for message caching and session management.',
      difficulty: 'Beginner',
      technologies: ['React', 'Node.js', 'Socket.io', 'Redis', 'Docker'],
      completionTime: '15 hours',
      learningOutcomes: [
        'Understand WebSockets for bi-directional communication.',
        'Implement Redis pub/sub and caching layers.',
        'Basic Docker containerization for multi-service apps.'
      ]
    },
    {
      title: 'Cloud-Native SaaS Subscription Platform',
      description: 'A full stack Next.js application integrated with Stripe subscriptions, containerized with Docker, and deployed on AWS ECS (Fargate) with a PostgreSQL RDS database.',
      difficulty: 'Intermediate',
      technologies: ['Next.js', 'Stripe API', 'Docker', 'AWS ECS', 'RDS PostgreSQL', 'GitHub Actions'],
      completionTime: '40 hours',
      learningOutcomes: [
        'Secure billing integration and webhook handlers.',
        'Configure VPCs, security groups, and cloud scaling on AWS.',
        'Design complete automated test and deployment pipelines.'
      ]
    },
    {
      title: 'High-Scale Distributed Microservices API',
      description: 'A microservices architecture built with NestJS, utilizing RabbitMQ for asynchronous messaging, Redis for distributed caching, and deployed on Kubernetes.',
      difficulty: 'Advanced',
      technologies: ['NestJS', 'RabbitMQ', 'Redis', 'Kubernetes', 'Prometheus/Grafana', 'TypeScript'],
      completionTime: '80 hours',
      learningOutcomes: [
        'Design decoupled event-driven architectures.',
        'Understand service discovery, load balancing, and orchestration in Kubernetes.',
        'Monitor cluster health and api throughput with Prometheus metrics.'
      ]
    }
  ],
  
  careerPath: {
    currentLevel: 'Entry-Level Full Stack Developer',
    nextRole: {
      title: 'Full Stack Engineer (Mid-Level)',
      skills: ['AWS Services', 'Docker', 'Jest/Cypress Testing', 'PostgreSQL Query Optimization'],
      certifications: ['AWS Certified Developer - Associate', 'Docker Certified Associate'],
      projects: ['Cloud-Native SaaS App', 'CI/CD pipeline implementation'],
      timeline: '12 - 18 months'
    },
    midLevelRole: {
      title: 'Senior Full Stack Engineer',
      skills: ['System Design & Architecture', 'Redis Caching & Clustering', 'Kubernetes', 'Node.js Performance Tuning'],
      certifications: ['AWS Certified Solutions Architect - Professional', 'Certified Kubernetes Administrator (CKA)'],
      projects: ['Event-driven microservices architecture', 'Zero-downtime database migration'],
      timeline: '2 - 3 years'
    },
    seniorRole: {
      title: 'Staff Engineer / Tech Lead',
      skills: ['Strategic Tech Planning', 'Distributed Systems Design', 'Engineering Leadership', 'Advanced Security Compliance'],
      certifications: ['TOGAF Enterprise Architecture', 'Google Cloud Certified Professional Cloud Architect'],
      projects: ['Enterprise API Gateway Refactoring', 'Global scaling to multi-region cloud deployment'],
      timeline: '3 - 5 years'
    }
  },
  
  explainableAI: {
    extractionLogic: 'The skill extraction engine identified your solid foundation in Javascript, React, Next.js, and Node.js. It flagged the absence of modern DevOps (Docker, Kubernetes) and cloud infrastructure (AWS) keywords, which are standard for mid-to-senior Full Stack Developer profiles in current job listings.',
    roadmapReasoning: 'The 30-60-90 day learning path is prioritized by immediate high-impact gaps. Docker and containers are taught first because they form the baseline for modern deployment. Month 2 focuses on scaling backend infrastructure (caching, AWS ECS), while Month 3 solidifies system design and testing for interview readiness.',
    atsLogic: 'The ATS parser graded formatting high due to clear, scanner-friendly headings. The keyword density score is lower due to a lack of infrastructure, testing, and system design terms. The formatting score is average due to the two-column layout, which can lead to text overlapping in older ATS parsers.',
    skillGapJustification: 'AWS and Docker are crucial because modern full stack roles expect developers to own their deployment pipelines and manage cloud resources. System design is the primary filter in mid/senior technical interviews, and testing is mandatory for production-grade reliability.'
  },

  jobMatchAnalysis: {
    jobMatch: 75,
    missingSkills: ['AWS Fargate', 'Docker Compose', 'CI/CD Pipelines'],
    missingKeywords: ['Cloud-native', 'Scalability', 'Containerization'],
    criticalKeywords: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    strengthAreas: ['React State Management', 'Node.js API Architecture', 'PostgreSQL Querying'],
    recommendations: ['Integrate docker-compose locally', 'Host backend on ECS', 'Construct GitHub Actions pipeline'],
    hiringReadiness: 'Strong matching core with infrastructure gaps.',
    roleFitExplanation: 'The profile matches the primary Javascript and web development framework requirements but lacks modern automated testing, CI/CD orchestration, and cloud-native containerized delivery setups required for mid-level deployments.',
    topPrioritySkill: 'Docker Containerization',
    estimatedImprovementPotential: 22
  },

  recruiterPerspective: {
    hireReadiness: 'Medium',
    summary: 'Candidate shows excellent fundamental JavaScript/TypeScript development skills. Lacks verified production-grade cloud deployment, server scaling, and containerized pipeline execution experience on their resume.',
    strengths: ['Expert in React and Next.js structures', 'Solid database management with relational SQL systems'],
    concerns: ['No direct AWS cloud operations experience', 'Lacks testing coverage frameworks (Jest/Cypress)'],
    recommendedRoles: ['Frontend Engineer', 'Fullstack Web Engineer', 'Node.js API Developer'],
    confidenceScore: 82,
    hireRecommendation: 'Consider'
  },

  actionItems: [
    {
      id: 'act-1',
      title: 'Resolve Missing Skill: Docker',
      type: 'Missing Skill',
      description: 'Learn containerization to support production deployment setups.',
      actionLabel: 'Generate Docker Plan',
      associatedGap: 'Docker'
    },
    {
      id: 'act-2',
      title: 'Optimize ATS Structure formatting',
      type: 'Weak ATS Score',
      description: 'Your margins and font sizes are triggering warning tags in recruiters scanning platforms.',
      actionLabel: 'Generate ATS Optimization Plan',
      associatedGap: 'ATS formatting'
    },
    {
      id: 'act-3',
      title: 'Resolve Missing Skill: AWS S3',
      type: 'Missing Skill',
      description: 'Implement cloud assets storage systems for application images and files.',
      actionLabel: 'Generate AWS Plan',
      associatedGap: 'AWS S3'
    }
  ]
};
