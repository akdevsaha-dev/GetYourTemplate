export type TargetRecipient = "founder" | "eng_manager" | "recruiter" | "peer";
export type TonePreset = "punchy" | "metric_heavy" | "conversational";
export type BrevityMode = "ultra_short" | "standard" | "detailed";
export type EmailAngle = "founder" | "eng_lead" | "recruiter" | "follow_up";

export interface ExtractedMetric {
  id: string;
  metric: string;
  context: string;
  tag: string;
}

export interface GeneratedEmail {
  id: EmailAngle;
  tabLabel: string;
  badge: string;
  recipientTitle: string;
  stats: {
    replyRate: string;
    wordCount: number;
    readTime: string;
    spamScore: string;
  };
  subject: string;
  subjectAlternatives: string[];
  greeting: string;
  intro: string;
  bodyProof: string;
  bodyPitch: string;
  cta: string;
  signoff: string;
  highlightNotes: string;
}

export interface CraftPitchState {
  candidateName: string;
  candidateEmail: string;
  candidateGithub?: string;
  candidateTitle: string;
  fileName: string;
  fileSize: string;
  isSample: boolean;
  companyName: string;
  targetRole: string;
  recipient: TargetRecipient;
  tone: TonePreset;
  brevity: BrevityMode;
  extractedMetrics: ExtractedMetric[];
  techStack: string[];
}

export const DEFAULT_EXTRACTED_METRICS: ExtractedMetric[] = [
  {
    id: "m1",
    metric: "43% p99 write latency reduction",
    context: "Re-architected distributed event pipeline across 12M daily active sessions",
    tag: "Performance & Infra",
  },
  {
    id: "m2",
    metric: "68% reduction in replication lag",
    context: "Kafka & Go event bus migration handling 14,000 peak writes/sec",
    tag: "Distributed Systems",
  },
  {
    id: "m3",
    metric: "$2.4M ARR pipeline impact",
    context: "Built real-time collaborative workspace editor adopted by 180+ enterprise customers",
    tag: "Business Impact",
  },
  {
    id: "m4",
    metric: "Zero main-thread jank (60fps)",
    context: "Implemented SQLite WASM background worker threads with zero-copy shared buffers",
    tag: "Frontend Architecture",
  },
];

export const DEFAULT_TECH_STACK = [
  "TypeScript",
  "React",
  "Go",
  "PostgreSQL",
  "Kafka",
  "Redis",
  "WebAssembly",
  "Distributed Caching",
];

export interface CandidateContactInfo {
  name?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  phone?: string | null;
  cvFileName?: string | null;
}

/**
 * Extracts candidate name and contact handles (Email, GitHub, LinkedIn, Portfolio, Phone)
 * directly from raw resume text.
 */
export function parseResumeContact(
  resumeText?: string,
  fallbackFileName?: string
): CandidateContactInfo {
  if (!resumeText) {
    return {
      name: null,
      email: null,
      github: null,
      linkedin: null,
      portfolio: null,
      phone: null,
      cvFileName: fallbackFileName || "resume.pdf",
    };
  }

  // 1. Candidate Name (usually the first non-empty text line)
  const lines = resumeText.split("\n").map((l) => l.trim()).filter(Boolean);
  let name: string | null = null;
  for (const line of lines.slice(0, 5)) {
    const clean = line.split("-")[0]?.split("—")[0]?.split("|")[0]?.split("•")[0]?.trim();
    if (
      clean &&
      clean.length >= 2 &&
      clean.length <= 40 &&
      !clean.includes("@") &&
      !clean.toLowerCase().includes("resume") &&
      !clean.toLowerCase().includes("curriculum") &&
      !clean.toLowerCase().includes("engineer") &&
      !clean.toLowerCase().includes("developer")
    ) {
      name = clean;
      break;
    }
  }

  // 2. Email Address
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  const emailMatch = resumeText.match(emailRegex);
  const email = emailMatch ? emailMatch[0].trim() : null;

  // 3. GitHub Link / Username
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_-]+)/i;
  const ghMatch = resumeText.match(githubRegex);
  let github: string | null = null;
  if (ghMatch && ghMatch[1] && !["repos", "pulls", "issues", "explore"].includes(ghMatch[1].toLowerCase())) {
    github = `github.com/${ghMatch[1]}`;
  }

  // 4. LinkedIn Link
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([A-Za-z0-9_-]+)/i;
  const liMatch = resumeText.match(linkedinRegex);
  const linkedin = liMatch && liMatch[1] ? `linkedin.com/in/${liMatch[1]}` : null;

  // 5. Portfolio or Personal Site
  const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?([A-Za-z0-9_-]+\.(?:dev|me|io|design|tech|app))\b/i;
  const portMatch = resumeText.match(portfolioRegex);
  const portfolio = portMatch && portMatch[1] ? portMatch[1] : null;

  // 6. Phone number
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = resumeText.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].trim() : null;

  return {
    name,
    email,
    github,
    linkedin,
    portfolio,
    phone,
    cvFileName: fallbackFileName || "resume.pdf",
  };
}

export function generateCraftedEmails(
  companyRaw: string,
  _recipient: TargetRecipient,
  tone: TonePreset,
  brevity: BrevityMode = "standard",
  customCandidateName: string = "Alex Chen",
  customRecipientName?: string,
  contactInfo?: CandidateContactInfo
): Record<EmailAngle, GeneratedEmail> {
  const parts = companyRaw.split("—");
  const company = parts[0]?.trim() || "Linear";
  const role = parts[1]?.trim() || "Senior Product Engineer";

  const recName = customRecipientName?.trim();
  const founderGreeting = recName ? `Hi ${recName},` : `Hi ${company} Team,`;
  const engLeadGreeting = recName ? `Hi ${recName},` : `Hi ${company} Engineering Team,`;
  const recruiterGreeting = recName ? `Hi ${recName},` : `Hi ${company} Recruiting Team,`;
  const followUpGreeting = recName ? `Hi ${recName},` : `Hi ${company} Team,`;

  // Candidate identity and contact handles with graceful editable placeholders
  const candidateName = customCandidateName?.trim() || contactInfo?.name?.trim() || "Your Name";
  const githubLink = contactInfo?.github?.trim() || "github.com/[your-github]";
  const emailLink = contactInfo?.email?.trim() || "[your-email@domain.com]";
  const portfolioLink = contactInfo?.portfolio?.trim() || contactInfo?.linkedin?.trim() || "[your-portfolio.dev]";
  const cvFile = contactInfo?.cvFileName?.trim() || "resume.pdf";
  const phoneInfo = contactInfo?.phone?.trim();

  // Dynamic, non-hallucinated signoffs
  const founderSignoff = `Best,\n${candidateName}\n${githubLink} • ${emailLink}`;
  const engLeadSignoff = `Cheers,\n${candidateName}\nResume attached: ${cvFile}${contactInfo?.github ? ` • ${contactInfo.github.trim()}` : ""}`;
  const recruiterSignoff = `Warm regards,\n${candidateName}\n${phoneInfo ? `Phone: ${phoneInfo} • ` : ""}${emailLink} • ${portfolioLink}`;
  const followUpSignoff = `Best,\n${candidateName}`;

  // Tone modifiers
  const isPunchy = tone === "punchy";
  const isMetric = tone === "metric_heavy";
  const isConversational = tone === "conversational";

  // Brevity modifiers
  const isUltra = brevity === "ultra_short";
  const isDetailed = brevity === "detailed";

  // Founder variation
  const founderSubject = isPunchy
    ? `Quick thought on ${company}'s real-time sync & latency`
    : isMetric
    ? `43% latency reduction pattern for ${company}'s sync engine`
    : `Enjoying ${company} — quick observation on offline sync`;

  const founderIntro = isPunchy
    ? `Saw your team's recent changelog post about scaling ${company}'s sync engine. Really clean approach to conflict resolution.`
    : isMetric
    ? `Analyzed ${company}'s recent technical notes on multi-region sync latency — noticed you're pushing boundaries on edge replication.`
    : `Been a fan of ${company}'s product speed for a while. Noticed your recent updates around offline-first state synchronization.`;

  const founderProof = isUltra
    ? `At my last role (Series B), I reduced p99 write latency by 43% across 12M daily events (Go/PostgreSQL/TypeScript).`
    : isDetailed
    ? `Over the past 3 years as Staff Engineer at Series B startup, I re-architected our distributed event pipeline, cutting p99 query latency from 850ms to 45ms across 12M daily active sessions while supporting offline optimistic reconciliation.`
    : `Over the past 3 years at Series B, I re-architected our distributed event pipeline, cutting p99 query latency by 43% across 12M daily active sessions (TypeScript/Go/PostgreSQL).`;

  const founderPitch = isPunchy
    ? `I've mapped out 2 architectural patterns that could eliminate edge cold-starts for ${company}'s offline-first cache.`
    : isMetric
    ? `Mapped out a zero-copy WASM buffer architecture that eliminates main-thread lockups during large graph updates.`
    : `Had a few specific ideas on how to eliminate edge cold-starts based on what we learned handling 14,000 peak writes/sec.`;

  const founderCta = isPunchy
    ? `Open to a 5-minute async Loom or a brief sync next Tuesday?`
    : isConversational
    ? `Would love to send over a 2-minute async Loom if you're curious — open to it?`
    : `Open to a 5-minute async demo or brief call Thursday morning?`;

  // Engineering Lead variation
  const engLeadSubject = `Question regarding ${company}'s event bus & distributed cache`;
  const engLeadIntro = `Was digging into ${company}'s engineering notes on local-first database replication. Appreciated how cleanly you handle optimistic UI rollbacks without cascading state thrash.`;
  const engLeadProof = `At my previous team, I led our migration to an event-driven architecture using Kafka & Go, reducing multi-region database replication lag by 68% while handling 14,000 peak writes/sec.`;
  const engLeadPitch = `Saw you're expanding the Core Infrastructure team for ${role}. I've spent the last 4 years solving exactly these edge synchronization and distributed consistency challenges.`;
  const engLeadCta = `Would love to share our benchmark learnings if you have 10 mins this week. Are you free Thursday morning?`;

  // Recruiter / Talent variation
  const recruiterSubject = `${candidateName} — Candidate for ${role} @ ${company}`;
  const recruiterIntro = `Hope your week is going well. Reaching out directly regarding the ${role} opening at ${company}.`;
  const recruiterProof = `Track record: Led backend infra scaling from Series A to B, cut p99 latency by 43% across 12M daily events, and built zero-jank WASM client pipelines. Strong match for ${company}'s tech stack (TypeScript, Go, PostgreSQL).`;
  const recruiterPitch = `I follow ${company}'s engineering philosophy closely and believe my background in high-throughput real-time systems aligns directly with your roadmap goals for this quarter.`;
  const recruiterCta = `Resume is attached. Do you have 15 minutes this week for an introductory conversation?`;

  // Follow-Up variation
  const followUpSubject = `Re: Quick thought on ${company}'s real-time sync`;
  const followUpIntro = `Know your inbox is packed with team priorities this week.`;
  const followUpProof = `Put together a 60-second Loom showing how we handled SQLite WASM worker threads with zero main-thread jank at my last role.`;
  const followUpPitch = `Here is the link: loom.com/share/alex-chen-wasm-demo`;
  const followUpCta = `No response needed if you're swamped — just thought your infra team might find the benchmark notes handy.`;

  return {
    founder: {
      id: "founder",
      tabLabel: "Founder Pitch",
      badge: "< 85 words",
      recipientTitle: "Founder / CEO",
      stats: {
        replyRate: "42%",
        wordCount: isUltra ? 54 : isDetailed ? 112 : 78,
        readTime: isUltra ? "12s" : isDetailed ? "26s" : "18s",
        spamScore: "0% trigger words",
      },
      subject: founderSubject,
      subjectAlternatives: [
        `Quick thought on ${company}'s real-time sync & latency`,
        `${candidateName} / ${company} — Staff engineer & latency reduction`,
        `Latency reduction pattern for ${company}'s offline-first cache`,
      ],
      greeting: founderGreeting,
      intro: founderIntro,
      bodyProof: founderProof,
      bodyPitch: founderPitch,
      cta: founderCta,
      signoff: founderSignoff,
      highlightNotes: "Direct, metric-backed hook built for 3-second founder triage.",
    },
    eng_lead: {
      id: "eng_lead",
      tabLabel: "Engineering Lead",
      badge: "Architecture & Metrics",
      recipientTitle: "VP of Engineering / Tech Lead",
      stats: {
        replyRate: "39%",
        wordCount: 94,
        readTime: "22s",
        spamScore: "0% trigger words",
      },
      subject: engLeadSubject,
      subjectAlternatives: [
        `Question regarding ${company}'s event bus & distributed cache`,
        `${company}'s local-first replication — quick question from an infra engineer`,
        `Notes on Kafka / Go event bus scaling for ${role}`,
      ],
      greeting: engLeadGreeting,
      intro: engLeadIntro,
      bodyProof: engLeadProof,
      bodyPitch: engLeadPitch,
      cta: engLeadCta,
      signoff: engLeadSignoff,
      highlightNotes: "Systems architecture depth proving immediate technical capability.",
    },
    recruiter: {
      id: "recruiter",
      tabLabel: "Talent & ATS",
      badge: "Role Fit & Track Record",
      recipientTitle: "Head of Talent / Senior Recruiter",
      stats: {
        replyRate: "35%",
        wordCount: 88,
        readTime: "20s",
        spamScore: "0% trigger words",
      },
      subject: recruiterSubject,
      subjectAlternatives: [
        `${candidateName} — Candidate for ${role} @ ${company}`,
        `Candidate track record: ${role} — ${candidateName}`,
        `Application & technical background: ${role} @ ${company}`,
      ],
      greeting: recruiterGreeting,
      intro: recruiterIntro,
      bodyProof: recruiterProof,
      bodyPitch: recruiterPitch,
      cta: recruiterCta,
      signoff: recruiterSignoff,
      highlightNotes: "Clear competencies and verified achievements aligned with ATS job specs.",
    },
    follow_up: {
      id: "follow_up",
      tabLabel: "Day 4 Follow-Up",
      badge: "Value-Add Touch",
      recipientTitle: "Multi-Touch Cadence",
      stats: {
        replyRate: "28%",
        wordCount: 56,
        readTime: "12s",
        spamScore: "0% trigger words",
      },
      subject: followUpSubject,
      subjectAlternatives: [
        `Re: Quick thought on ${company}'s real-time sync`,
        `60s demo: SQLite WASM worker threads for ${company}`,
        `Quick follow-up (no reply needed if busy)`,
      ],
      greeting: followUpGreeting,
      intro: followUpIntro,
      bodyProof: followUpProof,
      bodyPitch: followUpPitch,
      cta: followUpCta,
      signoff: followUpSignoff,
      highlightNotes: "Zero-pressure check-in offering immediate un-gated technical value.",
    },
  };
}
