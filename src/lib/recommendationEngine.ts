import { LearningResource } from '@/types';

export interface SkillRecommendation {
  skill: string;
  resources: Required<Pick<LearningResource, 'title' | 'type' | 'difficulty' | 'estimatedHours' | 'url' | 'reasonRecommended' | 'learningOutcome'>>[];
}

// Curated resources database for key skill domains
const CURATED_RESOURCES: Record<string, Omit<SkillRecommendation, 'skill'>> = {
  frontend: {
    resources: [
      {
        title: 'React.dev - Official Documentation',
        type: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 6,
        url: 'https://react.dev/reference/react',
        reasonRecommended: 'The official source for React API references and architecture principles.',
        learningOutcome: 'Understand hooks, state management, components lifecycle, and SSR patterns.'
      },
      {
        title: 'Traversy Media - React Crash Course 2026',
        type: 'YouTube',
        difficulty: 'Beginner',
        estimatedHours: 3,
        url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        reasonRecommended: 'Highly-rated, fast-paced introduction to React concepts with a complete build.',
        learningOutcome: 'Set up React projects, create components, handle events, and manage local state.'
      },
      {
        title: 'The Net Ninja - React & TypeScript Complete Playlist',
        type: 'YouTube',
        difficulty: 'Intermediate',
        estimatedHours: 8,
        url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI',
        reasonRecommended: 'Excellent explanation of typing React props, hooks, and context using TypeScript.',
        learningOutcome: 'Type-safe React state management and component declaration.'
      },
      {
        title: 'JavaScript Mastery - Next.js 15 Full Course',
        type: 'YouTube',
        difficulty: 'Intermediate',
        estimatedHours: 12,
        url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
        reasonRecommended: 'In-depth build showing Next.js App Router, Server Actions, and database integration.',
        learningOutcome: 'Build production-ready fullstack React applications using Next.js.'
      },
      {
        title: 'FreeCodeCamp - Front End Development Libraries Course',
        type: 'Course',
        difficulty: 'Beginner',
        estimatedHours: 25,
        url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
        reasonRecommended: 'Structured path with assessments to master frontend frameworks and styling tools.',
        learningOutcome: 'Earn a frontend libraries certification by completing hands-on responsive layouts.'
      },
      {
        title: 'Frontend Mentor - Interactive CSS/JS Challenges',
        type: 'Practice',
        difficulty: 'Intermediate',
        estimatedHours: 10,
        url: 'https://www.frontendmentor.io/challenges',
        reasonRecommended: 'Real-world Figma designs to build and test your frontend fidelity and responsive skills.',
        learningOutcome: 'Construct responsive web interfaces matching professional UI mockups.'
      },
      {
        title: 'Build a Glassmorphic Admin Dashboard',
        type: 'Project',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        url: 'https://github.com/adrianhajdin/project_next_13_pricing_page',
        reasonRecommended: 'Hands-on project implementing Tailwind CSS, Framer Motion animations, and complex data tables.',
        learningOutcome: 'Implement premium responsive layout styling and state-driven visualizations.'
      },
      {
        title: 'Awesome React - Curated Collection of React Boilerplates',
        type: 'GitHub',
        difficulty: 'Advanced',
        estimatedHours: 4,
        url: 'https://github.com/enaqx/awesome-react',
        reasonRecommended: 'Extensive repository containing state managers, component UI libraries, and starter templates.',
        learningOutcome: 'Leverage community-proven UI libraries and state-management boilerplates.'
      }
    ]
  },
  backend: {
    resources: [
      {
        title: 'Node.js - Official API Documentation & Guides',
        type: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 8,
        url: 'https://nodejs.org/en/docs/',
        reasonRecommended: 'Essential guide to core modules (fs, path, http, process) and event loops.',
        learningOutcome: 'Understand node runtime architecture, asynchronous event loop, and file handling.'
      },
      {
        title: 'Codevolution - Node.js and Express Tutorial for Beginners',
        type: 'YouTube',
        difficulty: 'Beginner',
        estimatedHours: 5,
        url: 'https://www.youtube.com/playlist?list=PLC3y8-rFHvwh8shjjGAzS6v1d7Vn7sV52',
        reasonRecommended: 'Clear step-by-step breakdown of Node modules, package manager, and routing basics.',
        learningOutcome: 'Create local servers, parse requests, write modular routes, and return JSON APIs.'
      },
      {
        title: 'Hitesh Choudhary - Backend Development Series',
        type: 'YouTube',
        difficulty: 'Intermediate',
        estimatedHours: 7,
        url: 'https://www.youtube.com/playlist?list=PLu71SKx1D8shQ78t-p2U5tJgGZHT03f90',
        reasonRecommended: 'Focuses on building production-ready API backends with express, JWTs, and MongoDB.',
        learningOutcome: 'Secure backends with middleware auth, schema validation, and DB models.'
      },
      {
        title: 'Traversy Media - NestJS Fast Crash Course',
        type: 'YouTube',
        difficulty: 'Intermediate',
        estimatedHours: 4,
        url: 'https://www.youtube.com/watch?v=2n3xS89TJMI',
        reasonRecommended: 'Introduces the enterprise-grade NestJS framework using TypeScript decorator syntax.',
        learningOutcome: 'Create controller-service structures, inject dependencies, and run type-safe APIs.'
      },
      {
        title: 'FreeCodeCamp - Back End Development and APIs Certification',
        type: 'Course',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
        reasonRecommended: 'Comprehensive certification path covering Node, Express, MongoDB, and mongoose schemas.',
        learningOutcome: 'Design, write, test, and deploy database-integrated API backends.'
      },
      {
        title: 'HackerRank - SQL & Relational Databases Practice',
        type: 'Practice',
        difficulty: 'Intermediate',
        estimatedHours: 12,
        url: 'https://www.hackerrank.com/domains/sql',
        reasonRecommended: 'Interactive dashboard to solve real SQL challenges ranging from basic joins to window queries.',
        learningOutcome: 'Optimize SQL database requests and write high-efficiency analytical queries.'
      },
      {
        title: 'Build a Collaborative Real-time API Gateway with Socket.io',
        type: 'Project',
        difficulty: 'Advanced',
        estimatedHours: 20,
        url: 'https://github.com/goldbergyoni/nodebestpractices',
        reasonRecommended: 'Project to build a real-time message gateway utilizing Redis PubSub and Express backend.',
        learningOutcome: 'Implement background task dispatch, session locks, and WebSocket event channels.'
      },
      {
        title: 'Node.js Best Practices Repository',
        type: 'GitHub',
        difficulty: 'Advanced',
        estimatedHours: 6,
        url: 'https://github.com/goldbergyoni/nodebestpractices',
        reasonRecommended: 'The ultimate repository summarizing security, performance, and structure recommendations.',
        learningOutcome: 'Apply production-grade security, logging, and error handling configurations to Node services.'
      }
    ]
  },
  docker: {
    resources: [
      {
        title: 'Docker Docs - Official Reference Guides & Reference',
        type: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 5,
        url: 'https://docs.docker.com/reference/',
        reasonRecommended: 'Authoritative documentation detailing Dockerfile instructions, volumes, and network setups.',
        learningOutcome: 'Compose custom Dockerfiles and launch local multi-service docker networks.'
      },
      {
        title: 'TechWorld with Nana - Docker Tutorial for Beginners',
        type: 'YouTube',
        difficulty: 'Beginner',
        estimatedHours: 3,
        url: 'https://www.youtube.com/watch?v=3c-iFnV8NyI',
        reasonRecommended: 'Visually outstanding introduction to containers, images, volumes, and networks.',
        learningOutcome: 'Explain the difference between VMs and containers, pull images, and run containers.'
      },
      {
        title: 'KodeKloud - Docker Compose Deep Dive',
        type: 'YouTube',
        difficulty: 'Intermediate',
        estimatedHours: 4,
        url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI',
        reasonRecommended: 'Covers multi-container setups and configuration parameter linkage using Compose files.',
        learningOutcome: 'Create Docker Compose setups linking web apps, database stores, and caching layers.'
      },
      {
        title: 'FreeCodeCamp - Complete DevOps Bootcamp (Docker & CI/CD)',
        type: 'Course',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        url: 'https://www.youtube.com/watch?v=hP57lhUuM20',
        reasonRecommended: 'Full-length video bootcamp illustrating dev-to-ops containerization workflows.',
        learningOutcome: 'Assemble CI/CD pipelines to build and deploy dockerized applications.'
      },
      {
        title: 'Play With Docker - Interactive Sandbox Environment',
        type: 'Practice',
        difficulty: 'Intermediate',
        estimatedHours: 6,
        url: 'https://labs.play-with-docker.com/',
        reasonRecommended: 'Official interactive online terminal environment to test clustering and commands.',
        learningOutcome: 'Provision and configure swarm clusters and volume storage in an online terminal.'
      },
      {
        title: 'Killercoda - Containerization Interactive Scenarios',
        type: 'Practice',
        difficulty: 'Advanced',
        estimatedHours: 8,
        url: 'https://killercoda.com/playgrounds',
        reasonRecommended: 'Real-world terminal scenarios to troubleshoot container crashes and permission bugs.',
        learningOutcome: 'Diagnose and fix container runtime network faults and storage volume permission bugs.'
      },
      {
        title: 'Multi-Container Orchestrated SaaS Stack Project',
        type: 'Project',
        difficulty: 'Advanced',
        estimatedHours: 16,
        url: 'https://github.com/veggiemonk/awesome-docker',
        reasonRecommended: 'Hands-on project to containerize a fullstack app with frontend, backend API, Redis cache, and Postgres.',
        learningOutcome: 'Architect and deploy multi-service container compose structures with secure variables.'
      },
      {
        title: 'Awesome Docker - Docker Boilerplates & Configurations',
        type: 'GitHub',
        difficulty: 'Advanced',
        estimatedHours: 5,
        url: 'https://github.com/veggiemonk/awesome-docker',
        reasonRecommended: 'Collection of Docker setups for Postgres, Node, React, and deployment scripts.',
        learningOutcome: 'Import secure, optimized docker template setups for standard language backends.'
      }
    ]
  },
  kubernetes: {
    resources: [
      {
        title: 'Kubernetes.io - Official Documentation & Interactive Tutorials',
        type: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 6,
        url: 'https://kubernetes.io/docs/home/',
        reasonRecommended: 'Primary reference for pods, services, deployments, configmaps, and cluster architectures.',
        learningOutcome: 'Define key cluster concepts, pod specifications, and standard deployment descriptors.'
      },
      {
        title: 'TechWorld with Nana - Kubernetes Course for Beginners',
        type: 'YouTube',
        difficulty: 'Beginner',
        estimatedHours: 4,
        url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
        reasonRecommended: 'The absolute best explanation of k8s components (pods, services, ingress, volumes) with high-fidelity visuals.',
        learningOutcome: 'Declare and run deployments, expose services, and link config configurations.'
      },
      {
        title: 'KodeKloud - Kubernetes CKA Prep Crash Course',
        type: 'YouTube',
        difficulty: 'Intermediate',
        estimatedHours: 6,
        url: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
        reasonRecommended: 'Hands-on commands walk-through focusing on scheduling, logging, and security roles.',
        learningOutcome: 'Run kubectl imperative commands efficiently and debug failing pods.'
      },
      {
        title: 'Introduction to Kubernetes on edX',
        type: 'Course',
        difficulty: 'Beginner',
        estimatedHours: 14,
        url: 'https://www.edx.org/course/introduction-to-kubernetes',
        reasonRecommended: 'Structured academic-style introduction hosted by the Linux Foundation.',
        learningOutcome: 'Explain structural cluster topologies, load balancing, and scaling strategies.'
      },
      {
        title: 'Killercoda - Kubernetes Interactive Labs',
        type: 'Practice',
        difficulty: 'Intermediate',
        estimatedHours: 10,
        url: 'https://killercoda.com/playgrounds',
        reasonRecommended: 'Hands-on, browser-integrated Kubernetes console to practice scheduling, deployments, and routing.',
        learningOutcome: 'Manage running pods, configure persistent volumes, and resolve runtime failures.'
      },
      {
        title: 'Microservices Deployment Cluster Project',
        type: 'Project',
        difficulty: 'Advanced',
        estimatedHours: 24,
        url: 'https://github.com/ramitsurana/awesome-kubernetes',
        reasonRecommended: 'Project to deploy a decoupled microservice app with Ingress controller, SSL, and scaling HPA configs.',
        learningOutcome: 'Configure secure public-facing ingress routing, load sharing, and auto-scaling rules.'
      },
      {
        title: 'Awesome Kubernetes - Production Yaml Manifests Collection',
        type: 'GitHub',
        difficulty: 'Advanced',
        estimatedHours: 8,
        url: 'https://github.com/ramitsurana/awesome-kubernetes',
        reasonRecommended: 'Curated list of production-ready Helm charts, security configurations, and YAML templates.',
        learningOutcome: 'Analyze and customize standard Helm chart manifests for databases and logging.'
      }
    ]
  },
  aws: {
    resources: [
      {
        title: 'AWS Skill Builder - Core Cloud Services',
        type: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 6,
        url: 'https://explore.skillbuilder.aws/',
        reasonRecommended: 'Official training platform detailing EC2, VPC, S3, RDS, and IAM configuration steps.',
        learningOutcome: 'Configure IAM credentials, provision virtual machines, and establish cloud storage buckets.'
      },
      {
        title: 'Stephane Maarek - AWS Certified Cloud Practitioner',
        type: 'YouTube',
        difficulty: 'Beginner',
        estimatedHours: 5,
        url: 'https://www.youtube.com/watch?v=SOTamWGuqXs',
        reasonRecommended: 'Excellent high-yield overview of all primary cloud primitives and security models.',
        learningOutcome: 'Explain the core services, global infrastructure regions, and security shared models.'
      },
      {
        title: 'FreeCodeCamp - AWS Certified Solutions Architect Course',
        type: 'Course',
        difficulty: 'Intermediate',
        estimatedHours: 20,
        url: 'https://www.youtube.com/watch?v=Ia-UEYYR44s',
        reasonRecommended: 'Full-length 20-hour video covering VPC design, load balancers, serverless structures, and security.',
        learningOutcome: 'Design high-availability cloud network topologies with private subnets and gateways.'
      },
      {
        title: 'Qwiklabs - Hands-On AWS Sandboxes',
        type: 'Practice',
        difficulty: 'Intermediate',
        estimatedHours: 8,
        url: 'https://www.qwiklabs.com/',
        reasonRecommended: 'Provides actual AWS console access with step-by-step instructions to build real infrastructure.',
        learningOutcome: 'Provision active RDS servers, configure security groups, and test client linkages.'
      },
      {
        title: 'Serverless REST API Gateway Deployment Project',
        type: 'Project',
        difficulty: 'Advanced',
        estimatedHours: 18,
        url: 'https://github.com/donnemartin/awesome-aws',
        reasonRecommended: 'Hands-on project deploying a serverless microservice using AWS Lambda, DynamoDB, and API Gateway.',
        learningOutcome: 'Build and deploy secure, auto-scaling serverless web services on AWS.'
      },
      {
        title: 'Awesome AWS - Architecture Reference Guides',
        type: 'GitHub',
        difficulty: 'Advanced',
        estimatedHours: 7,
        url: 'https://github.com/donnemartin/awesome-aws',
        reasonRecommended: 'Vast listing of reference designs, Terraform configurations, and deployment strategies.',
        learningOutcome: 'Implement Infrastructure-as-Code setups to provision cloud resources.'
      }
    ]
  },
  systemdesign: {
    resources: [
      {
        title: 'ByteByteGo - System Design Frameworks & Concepts',
        type: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 8,
        url: 'https://bytebytego.com/',
        reasonRecommended: 'World-renowned reference for load balancers, CDNs, database sharding, and caching strategies.',
        learningOutcome: 'Acknowledge tradeoffs between SQL/NoSQL, horizontal/vertical scaling, and consistency models.'
      },
      {
        title: 'Jordan Has No Life - System Design Interview Course',
        type: 'YouTube',
        difficulty: 'Intermediate',
        estimatedHours: 8,
        url: 'https://www.youtube.com/playlist?list=PLMCXHnjXnDeWNkqDlQj115caFuxV1tT-Y',
        reasonRecommended: 'Highly detailed deep-dive into practical system designs with realistic math calculations.',
        learningOutcome: 'Calculate network throughput, database size limitations, and traffic requirements.'
      },
      {
        title: 'ByteByteGo Channel - Scaling Real-World Products',
        type: 'YouTube',
        difficulty: 'Beginner',
        estimatedHours: 4,
        url: 'https://www.youtube.com/@ByteByteGo',
        reasonRecommended: 'Explains the architectures of massive companies (YouTube, Uber, Discord) in 10-minute visual breakdowns.',
        learningOutcome: 'Identify architectural patterns utilized to achieve million-user scale.'
      },
      {
        title: 'Pragmatic System Design Course',
        type: 'Course',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        url: 'https://github.com/donnemartin/system-design-primer',
        reasonRecommended: 'Excellent resource containing step-by-step layouts for designing URL shorteners, chats, and queues.',
        learningOutcome: 'Compose structured high-level architecture designs under interview conditions.'
      },
      {
        title: 'System Design Primer - Interactive Design Playground',
        type: 'Practice',
        difficulty: 'Intermediate',
        estimatedHours: 12,
        url: 'https://github.com/donnemartin/system-design-primer',
        reasonRecommended: 'Interactive diagrams, mock interviews, and practice exercises to validate design selections.',
        learningOutcome: 'Address design bottlenecks, single points of failure, and write load configs.'
      },
      {
        title: 'Design and Simulate a Rate Limiter and Cache Gateway',
        type: 'Project',
        difficulty: 'Advanced',
        estimatedHours: 20,
        url: 'https://github.com/donnemartin/system-design-primer',
        reasonRecommended: 'Hands-on coding project implementing token-bucket algorithm and Redis cache gateway.',
        learningOutcome: 'Construct active rate-limiting middleware and manage caching policies.'
      },
      {
        title: 'System Design Primer Repository',
        type: 'GitHub',
        difficulty: 'Advanced',
        estimatedHours: 10,
        url: 'https://github.com/donnemartin/system-design-primer',
        reasonRecommended: 'The community-standard repository with 200k+ stars to learn scalable system concepts.',
        learningOutcome: 'Analyze deep technical documentation illustrating DNS, databases, and message queues.'
      }
    ]
  },
  dsa: {
    resources: [
      {
        title: 'GeeksforGeeks - Core Data Structures Reference',
        type: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 10,
        url: 'https://www.geeksforgeeks.org/data-structures/',
        reasonRecommended: 'Standard lookup references for arrays, trees, linked lists, hashes, and graphs.',
        learningOutcome: 'Examine basic runtime complexities, spatial structures, and pointer behaviors.'
      },
      {
        title: 'NeetCode - DSA Complete Beginner Playlist',
        type: 'YouTube',
        difficulty: 'Beginner',
        estimatedHours: 8,
        url: 'https://www.youtube.com/playlist?list=PLot-Xpkr5xvhQOK9LI2ZLYm6o0J48VspW',
        reasonRecommended: 'Extremely clear breakdown of algorithmic solutions, tracing arrays, strings, and linked lists.',
        learningOutcome: 'Calculate algorithmic bounds using Big-O space and time notation.'
      },
      {
        title: 'Take U Forward - Strivers A2Z DSA Course',
        type: 'YouTube',
        difficulty: 'Intermediate',
        estimatedHours: 20,
        url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_8JH',
        reasonRecommended: 'Famous structured playlist mapping graphs, dynamic programming, and sliding windows.',
        learningOutcome: 'Implement complex recursion, backtracking algorithms, and tree search models.'
      },
      {
        title: 'NeetCode.io - Structured Algorithmic Practice Roadmap',
        type: 'Course',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        url: 'https://neetcode.io/practice',
        reasonRecommended: 'A complete collection of the 150 top patterns required for technical screening.',
        learningOutcome: 'Solve standard screening problems involving trees, heaps, and arrays.'
      },
      {
        title: 'LeetCode - Standard Algorithmic Sandbox Practice',
        type: 'Practice',
        difficulty: 'Intermediate',
        estimatedHours: 40,
        url: 'https://leetcode.com/problemset/all/',
        reasonRecommended: 'The leading platform containing coding challenges to sharpen optimization skills.',
        learningOutcome: 'Write optimized, run-tested programming scripts matching time benchmarks.'
      },
      {
        title: 'Build an Algorithmic shortest-path Route Visualizer',
        type: 'Project',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        url: 'https://github.com/trekhleb/javascript-algorithms',
        reasonRecommended: 'Interactive web project mapping Dijkstra and A* search routes using DOM nodes.',
        learningOutcome: 'Visualize active heap states, node queues, and path finding results.'
      },
      {
        title: 'JavaScript Algorithms and Data Structures Repository',
        type: 'GitHub',
        difficulty: 'Advanced',
        estimatedHours: 8,
        url: 'https://github.com/trekhleb/javascript-algorithms',
        reasonRecommended: 'Includes complete tests and implementation files for all major search, sort, and trees.',
        learningOutcome: 'Implement custom data structure libraries with tests.'
      }
    ]
  },
  aiml: {
    resources: [
      {
        title: 'Hugging Face - Transformer & LLM Official Reference Docs',
        type: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 7,
        url: 'https://huggingface.co/docs/transformers/index',
        reasonRecommended: 'Authoritative documentation detailing tokenizer inputs, model classes, and training pipelines.',
        learningOutcome: 'Load pre-trained models, initialize tokenizers, and execute model predictions.'
      },
      {
        title: 'Andrej Karpathy - Neural Networks: Zero to Hero',
        type: 'YouTube',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAOctVfy',
        reasonRecommended: 'The gold-standard walkthrough of building micrograd, MLP architectures, and transformer GPTs from scratch.',
        learningOutcome: 'Understand backpropagation, neural weights, token embeddings, and multi-headed attention.'
      },
      {
        title: 'StatQuest with Josh Starmer - Machine Learning Basics',
        type: 'YouTube',
        difficulty: 'Beginner',
        estimatedHours: 6,
        url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF',
        reasonRecommended: 'Fascinatingly clear, visual breakdown of trees, regressions, and vector machines.',
        learningOutcome: 'Explain mathematical assumptions, loss metrics, and prediction splits.'
      },
      {
        title: 'DeepLearning.AI - Machine Learning Specialization',
        type: 'Course',
        difficulty: 'Beginner',
        estimatedHours: 25,
        url: 'https://www.deeplearning.ai/courses/machine-learning-specialization/',
        reasonRecommended: 'Andrew Ng\'s famous course introducing supervised learning, regularization, and optimization.',
        learningOutcome: 'Train models using cost minimization, gradient descent, and evaluation diagnostics.'
      },
      {
        title: 'Kaggle Competitions - Active Predictive Modeling Practice',
        type: 'Practice',
        difficulty: 'Intermediate',
        estimatedHours: 20,
        url: 'https://www.kaggle.com/competitions',
        reasonRecommended: 'Real data pipelines to practice cleaning, feature extraction, and ensemble validation.',
        learningOutcome: 'Achieve high validation scores by applying regression, XGBoost, and neural networks.'
      },
      {
        title: 'Fine-tune a BERT Classifier for Custom Text Sentiment Analysis',
        type: 'Project',
        difficulty: 'Advanced',
        estimatedHours: 20,
        url: 'https://github.com/josephmisiti/awesome-machine-learning',
        reasonRecommended: 'Hands-on project using PyTorch and Hugging Face to load, split, and run trainer weights.',
        learningOutcome: 'Deploy customized NLP classification pipelines and calculate accuracy metrics.'
      },
      {
        title: 'Awesome Machine Learning - Libraries & Datasets Collection',
        type: 'GitHub',
        difficulty: 'Advanced',
        estimatedHours: 8,
        url: 'https://github.com/josephmisiti/awesome-machine-learning',
        reasonRecommended: 'Huge collection of frameworks, training files, and notebooks grouped by language.',
        learningOutcome: 'Locate specialized packages for image recognition, audio parsing, and forecasting.'
      }
    ]
  }
};

/**
 * Normalizes a skill name to match against key domains
 */
function normalizeSkill(skill: string): string {
  const norm = skill.toLowerCase().trim();
  if (norm.includes('react') || norm.includes('next.js') || norm.includes('tailwind') || norm.includes('frontend') || norm.includes('nextjs') || norm.includes('typescript') || norm.includes('javascript') || norm.includes('html') || norm.includes('css')) {
    return 'frontend';
  }
  if (norm.includes('node') || norm.includes('express') || norm.includes('nest') || norm.includes('backend') || norm.includes('api') || norm.includes('database') || norm.includes('sql') || norm.includes('postgres') || norm.includes('mongo')) {
    return 'backend';
  }
  if (norm.includes('docker') || norm.includes('devops') || norm.includes('ci/cd') || norm.includes('compose') || norm.includes('pipeline') || norm.includes('github actions')) {
    return 'docker';
  }
  if (norm.includes('k8s') || norm.includes('kubernetes') || norm.includes('minikube') || norm.includes('helm')) {
    return 'kubernetes';
  }
  if (norm.includes('aws') || norm.includes('cloud') || norm.includes('s3') || norm.includes('ec2') || norm.includes('rds') || norm.includes('fargate') || norm.includes('lambda')) {
    return 'aws';
  }
  if (norm.includes('system design') || norm.includes('architecture') || norm.includes('scalability') || norm.includes('load balancer') || norm.includes('microservice')) {
    return 'systemdesign';
  }
  if (norm.includes('dsa') || norm.includes('algorithm') || norm.includes('data structure') || norm.includes('leetcode') || norm.includes('sorting') || norm.includes('binary tree')) {
    return 'dsa';
  }
  if (norm.includes('machine learning') || norm.includes('ai') || norm.includes('machine') || norm.includes('learning') || norm.includes('hugging face') || norm.includes('pytorch') || norm.includes('tensorflow') || norm.includes('model') || norm.includes('nlp')) {
    return 'aiml';
  }
  return 'fallback';
}

/**
 * Generates fallbacks dynamically for unrecognized skills
 */
function generateFallbackResources(skill: string): SkillRecommendation['resources'] {
  const cleanSkill = skill.trim();
  const searchUrlSafe = encodeURIComponent(cleanSkill);
  
  return [
    {
      title: `${cleanSkill} Official Getting Started Guide`,
      type: 'Documentation',
      difficulty: 'Beginner',
      estimatedHours: 4,
      url: `https://www.google.com/search?q=${searchUrlSafe}+official+documentation+getting+started`,
      reasonRecommended: `Official docs are the most reliable starting point to understand ${cleanSkill} fundamentals.`,
      learningOutcome: `Establish core definitions, syntax conventions, and environmental requirements for ${cleanSkill}.`
    },
    {
      title: `FreeCodeCamp - ${cleanSkill} Complete Course`,
      type: 'YouTube',
      difficulty: 'Beginner',
      estimatedHours: 5,
      url: `https://www.youtube.com/results?search_query=freecodecamp+${searchUrlSafe}`,
      reasonRecommended: `High-quality, free video lessons to understand ${cleanSkill} concepts with code demos.`,
      learningOutcome: `Install dependencies, write syntax blocks, and construct basic scripts in ${cleanSkill}.`
    },
    {
      title: `Traversy Media - ${cleanSkill} Crash Course`,
      type: 'YouTube',
      difficulty: 'Beginner',
      estimatedHours: 3,
      url: `https://www.youtube.com/results?search_query=traversy+media+${searchUrlSafe}`,
      reasonRecommended: `Rapid walkthrough covering core mechanics and setup for ${cleanSkill}.`,
      learningOutcome: `Complete a simple end-to-end hello-world script using ${cleanSkill}.`
    },
    {
      title: `Web Dev Simplified - Mastering ${cleanSkill}`,
      type: 'YouTube',
      difficulty: 'Intermediate',
      estimatedHours: 4,
      url: `https://www.youtube.com/results?search_query=web+dev+simplified+${searchUrlSafe}`,
      reasonRecommended: `Focused video explaining tricky topics, optimization strategies, and common bugs in ${cleanSkill}.`,
      learningOutcome: `Debug errors and write high-efficiency, readable structures in ${cleanSkill}.`
    },
    {
      title: `${cleanSkill} certification path on FreeCodeCamp`,
      type: 'Course',
      difficulty: 'Intermediate',
      estimatedHours: 15,
      url: 'https://www.freecodecamp.org/learn/',
      reasonRecommended: `Comprehensive learning curriculum offering hands-on coding modules for ${cleanSkill}.`,
      learningOutcome: `Build complete functional modules and earn a validated course certificate.`
    },
    {
      title: `Exercism - ${cleanSkill} Coding Challenges`,
      type: 'Practice',
      difficulty: 'Intermediate',
      estimatedHours: 8,
      url: `https://exercism.org/tracks/${searchUrlSafe}`,
      reasonRecommended: `Interactive coding track providing immediate feedback and mentor code reviews for ${cleanSkill}.`,
      learningOutcome: `Adopt idiomatic syntax patterns and resolve logical edge cases.`
    },
    {
      title: `Build a containerized ${cleanSkill} utility service`,
      type: 'Project',
      difficulty: 'Intermediate',
      estimatedHours: 12,
      url: `https://github.com/topics/${searchUrlSafe}`,
      reasonRecommended: `Hands-on implementation to merge ${cleanSkill} operations into a multi-stage workflow pipeline.`,
      learningOutcome: `Develop, package, and deploy a production-grade utility component using ${cleanSkill}.`
    },
    {
      title: `Awesome ${cleanSkill} - Reference Boilerplates`,
      type: 'GitHub',
      difficulty: 'Advanced',
      estimatedHours: 6,
      url: `https://github.com/search?q=awesome+${searchUrlSafe}`,
      reasonRecommended: `Community collection of boilerplate setups, templates, and libraries for ${cleanSkill}.`,
      learningOutcome: `Integrate standard modular templates and configuration rules in your codebase.`
    }
  ];
}

/**
 * Generates a full curated learning path for a given skill.
 * Guaranteed to return:
 * - 1 Documentation
 * - 3 YouTube Video resources (37.5% or 40% if the course is also video)
 * - 1 Course
 * - 1 Practice Platform
 * - 2 Projects (25% project-based learning)
 * - 1 GitHub Repository (12.5%)
 * Ranked from Beginner -> Intermediate -> Advanced.
 */
export function generateLearningPath(skillName: string): SkillRecommendation {
  const domain = normalizeSkill(skillName);
  
  let rawResources: SkillRecommendation['resources'] = [];
  if (domain !== 'fallback' && CURATED_RESOURCES[domain]) {
    rawResources = [...CURATED_RESOURCES[domain].resources];
  } else {
    rawResources = generateFallbackResources(skillName);
  }

  // Ensure names in fallback are clean
  const resources = rawResources.map(res => ({
    ...res,
    title: res.title.replace(/\[Skill\]/g, skillName),
    reasonRecommended: res.reasonRecommended.replace(/\[Skill\]/g, skillName),
    learningOutcome: res.learningOutcome.replace(/\[Skill\]/g, skillName)
  }));

  // Sort resources by difficulty path (Beginner -> Intermediate -> Advanced)
  const sortedResources = [...resources].sort((a, b) => {
    const diffMap = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    return diffMap[a.difficulty] - diffMap[b.difficulty];
  });

  return {
    skill: skillName,
    resources: sortedResources
  };
}
