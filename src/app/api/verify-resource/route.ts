import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedResource, saveVerifiedResource } from '@/lib/db';

// Preferred verified links dictionary to serve as automatic fallbacks
const FALLBACK_SOURCES: Record<string, { type: string, url: string, title: string }[]> = {
  frontend: [
    { type: 'Documentation', url: 'https://react.dev', title: 'React Official Docs' },
    { type: 'Documentation', url: 'https://nextjs.org/docs', title: 'Next.js Documentation' },
    { type: 'Documentation', url: 'https://developer.mozilla.org', title: 'MDN Web Docs' },
    { type: 'YouTube', url: 'https://www.youtube.com/@TraversyMedia', title: 'Traversy Media Channel' },
    { type: 'YouTube', url: 'https://www.youtube.com/@NetNinja', title: 'The Net Ninja Channel' },
    { type: 'YouTube', url: 'https://www.youtube.com/@WebDevSimplified', title: 'Web Dev Simplified Channel' },
    { type: 'Practice', url: 'https://www.frontendmentor.io', title: 'Frontend Mentor Challenges' },
    { type: 'Practice', url: 'https://www.codewars.com', title: 'Codewars Practice' }
  ],
  backend: [
    { type: 'Documentation', url: 'https://nodejs.org/docs', title: 'Node.js Documentation' },
    { type: 'Documentation', url: 'https://expressjs.com', title: 'Express.js Guide' },
    { type: 'YouTube', url: 'https://www.youtube.com/@Codevolution', title: 'Codevolution Tutorials' },
    { type: 'YouTube', url: 'https://www.youtube.com/@HiteshCodeLab', title: 'Hitesh Choudhary YouTube' },
    { type: 'Practice', url: 'https://leetcode.com', title: 'LeetCode Platform' },
    { type: 'Practice', url: 'https://www.hackerrank.com', title: 'HackerRank Dashboard' }
  ],
  docker: [
    { type: 'Documentation', url: 'https://docs.docker.com', title: 'Docker Official Documentation' },
    { type: 'YouTube', url: 'https://www.youtube.com/@TechWorldwithNana', title: 'TechWorld with Nana' },
    { type: 'YouTube', url: 'https://www.youtube.com/@KodeKloud', title: 'KodeKloud DevOps' },
    { type: 'Practice', url: 'https://labs.play-with-docker.com', title: 'Play With Docker Sandbox' },
    { type: 'Practice', url: 'https://killercoda.com', title: 'Killercoda Interactive Labs' }
  ],
  kubernetes: [
    { type: 'Documentation', url: 'https://kubernetes.io/docs', title: 'Kubernetes Documentation' },
    { type: 'YouTube', url: 'https://www.youtube.com/@TechWorldwithNana', title: 'TechWorld with Nana' },
    { type: 'YouTube', url: 'https://www.youtube.com/@KodeKloud', title: 'KodeKloud DevOps' },
    { type: 'Practice', url: 'https://killercoda.com', title: 'Killercoda Kubernetes Labs' }
  ],
  aws: [
    { type: 'Documentation', url: 'https://docs.aws.amazon.com', title: 'AWS Cloud Documentation' },
    { type: 'Documentation', url: 'https://skillbuilder.aws', title: 'AWS Skill Builder' },
    { type: 'YouTube', url: 'https://www.youtube.com/@freecodecamp', title: 'freeCodeCamp.org Channel' },
    { type: 'YouTube', url: 'https://www.youtube.com/@AWSTrainingCertification', title: 'AWS Training & Certification' }
  ],
  systemdesign: [
    { type: 'Documentation', url: 'https://bytebytego.com', title: 'ByteByteGo System Design' },
    { type: 'Documentation', url: 'https://github.com/donnemartin/system-design-primer', title: 'System Design Primer Repo' },
    { type: 'YouTube', url: 'https://www.youtube.com/@ByteByteGo', title: 'ByteByteGo Channel' }
  ],
  dsa: [
    { type: 'Documentation', url: 'https://takeuforward.org', title: 'takeUforward Strivers Guide' },
    { type: 'Documentation', url: 'https://www.geeksforgeeks.org', title: 'GeeksforGeeks Portal' },
    { type: 'Practice', url: 'https://leetcode.com', title: 'LeetCode Platform' },
    { type: 'Practice', url: 'https://codeforces.com', title: 'Codeforces Platform' },
    { type: 'YouTube', url: 'https://www.youtube.com/@takeUforward', title: 'Striver takeUforward YouTube' },
    { type: 'YouTube', url: 'https://www.youtube.com/@NeetCode', title: 'NeetCode Algorithms' }
  ],
  aiml: [
    { type: 'Documentation', url: 'https://www.deeplearning.ai', title: 'DeepLearning.AI Portal' },
    { type: 'Documentation', url: 'https://huggingface.co/learn', title: 'Hugging Face Learn Hub' },
    { type: 'YouTube', url: 'https://www.youtube.com/@AndrejKarpathy', title: 'Andrej Karpathy Channel' },
    { type: 'YouTube', url: 'https://www.youtube.com/@statquest', title: 'StatQuest with Josh Starmer' },
    { type: 'Practice', url: 'https://www.kaggle.com', title: 'Kaggle Competitions' }
  ]
};

// Normalize categories
function getSkillCategory(topic: string): string {
  const norm = topic.toLowerCase();
  if (norm.includes('react') || norm.includes('next.js') || norm.includes('tailwind') || norm.includes('frontend') || norm.includes('typescript') || norm.includes('javascript') || norm.includes('html') || norm.includes('css')) {
    return 'frontend';
  }
  if (norm.includes('node') || norm.includes('express') || norm.includes('nest') || norm.includes('backend') || norm.includes('api') || norm.includes('database') || norm.includes('sql') || norm.includes('postgres') || norm.includes('mongo')) {
    return 'backend';
  }
  if (norm.includes('docker') || norm.includes('devops') || norm.includes('compose')) {
    return 'docker';
  }
  if (norm.includes('kubernetes') || norm.includes('k8s') || norm.includes('helm')) {
    return 'kubernetes';
  }
  if (norm.includes('aws') || norm.includes('cloud') || norm.includes('s3') || norm.includes('ec2') || norm.includes('rds') || norm.includes('lambda')) {
    return 'aws';
  }
  if (norm.includes('system design') || norm.includes('architecture') || norm.includes('scalability')) {
    return 'systemdesign';
  }
  if (norm.includes('dsa') || norm.includes('algorithm') || norm.includes('leetcode')) {
    return 'dsa';
  }
  if (norm.includes('machine learning') || norm.includes('ai') || norm.includes('pytorch') || norm.includes('tensorflow') || norm.includes('nlp')) {
    return 'aiml';
  }
  return 'frontend'; // default fallback
}

export async function POST(req: NextRequest) {
  try {
    const { url, topic, type } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing parameter: url.' }, { status: 400 });
    }

    // 1. Check cache first
    const cached = await getVerifiedResource(url);
    if (cached && cached.verified) {
      return NextResponse.json({
        url,
        verified: true,
        title: cached.title || topic,
        alternative: false
      });
    }

    // 2. Perform live check
    let isReachable = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 200) {
        isReachable = true;
      }
    } catch (fetchErr) {
      console.warn(`Live check failed for URL: ${url}. Error:`, fetchErr);
    }

    // 3. Save to cache and return if verified
    if (isReachable) {
      await saveVerifiedResource(url, true, topic);
      return NextResponse.json({
        url,
        verified: true,
        title: topic,
        alternative: false
      });
    }

    // 4. If validation fails, select alternative
    console.warn(`URL failed verification: ${url}. Searching for alternative...`);
    const category = getSkillCategory(topic || 'frontend');
    const candidates = FALLBACK_SOURCES[category] || FALLBACK_SOURCES['frontend'];
    
    // Attempt to match by type if specified
    const matched = candidates.find(c => c.type.toLowerCase() === (type || 'documentation').toLowerCase()) || candidates[0];
    
    // Save both failed URL (as false) and alternative (as true)
    await saveVerifiedResource(url, false, topic);
    await saveVerifiedResource(matched.url, true, matched.title);

    return NextResponse.json({
      url: matched.url,
      verified: true,
      title: matched.title,
      alternative: true,
      originalUrl: url
    });

  } catch (error: any) {
    console.error('Verify Resource API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during URL verification.' }, { status: 500 });
  }
}
