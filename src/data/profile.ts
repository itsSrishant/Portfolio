/**
 * Single source of truth for every piece of content on the site.
 *
 * Content rules for this file:
 *  - Nothing here is invented. No fabricated metrics, awards, hackathons or
 *    certificates.
 *  - Anything Srishant has not supplied yet is marked `TODO` and is rendered
 *    as a visible, honest placeholder rather than filled with a guess.
 *  - The PlatinumOne work is described at the level of architecture and
 *    responsibility only. No client names, no model/vendor names, no internal
 *    numbers.
 */

/* ---------------------------------------------------------------- *
 * Identity
 * ---------------------------------------------------------------- */

export const profile = {
  name: 'Srishant Kulkarni',
  firstName: 'Srishant',
  lastName: 'Kulkarni',
  initials: 'SK',
  roles: ['AI & Data Science Student', 'Software Engineer'],
  tagline: 'I build intelligent systems and software that solve real-world problems.',
  location: 'Mumbai, Maharashtra, India',
  email: 'imsrishant@gmail.com',

  github: 'https://github.com/itsSrishant',
  linkedin: 'https://www.linkedin.com/in/srishantkulkarni/',

  /**
   * To update the resume: don't edit anything in this file, and never
   * open the PDF itself in a text/code editor to "add" or change
   * content — a PDF is a binary format (starts with a `%PDF-1.4` header
   * and locates every object via exact byte offsets in a cross-reference
   * table), so editing it as text corrupts it immediately.
   *
   * Instead: drag the new resume into `public/`, name it exactly
   * `srishant-kulkarni-resume.pdf` (overwriting the old one), and stop —
   * this field already points at that filename, and both the Contact
   * section button and the nav icon read from it, so nothing else needs
   * to change.
   */
  resumeUrl: '/srishant-kulkarni-resume.pdf',

  education: {
    degree: 'B.Tech Artificial Intelligence & Data Science',
    institution: "Vivekanand Education Society's Institute of Technology",
    shortInstitution: 'VESIT, Mumbai',
    detail: 'CGPA 9.96 / 10.00',
    period: '2025 – 2029',
  },
} as const;

/** Set to false until the links above are filled in, so nothing ships broken. */
export const linksReady = {
  github: !profile.github.endsWith('github.com/'),
  linkedin: !profile.linkedin.endsWith('linkedin.com/'),
};

/* ---------------------------------------------------------------- *
 * About
 * ---------------------------------------------------------------- */

export const about = {
  paragraphs: [
    "I'm an AI & Data Science engineering student at VESIT, Mumbai, fascinated by what happens when ideas move from a blank screen to something people can actually use.",
    "I learn by building — not by collecting certificates. If I want to understand something, I'd rather write the code, break it, debug it, rebuild it, and see where it takes me.",
    "I recently completed an internship, where I built an AI Voice Bot from the ground up and got to experience what it takes to turn AI concepts into a real working system. From conversational AI and LLMs to RAG, speech-to-text, text-to-speech, real-time audio, APIs, authentication, and backend architecture — I got to work across the stack and solve problems that don't come with a neat tutorial.",
    'My toolkit includes React, TypeScript, Tailwind CSS, Vite, Python, FastAPI, Java, REST APIs, PostgreSQL, SQLite, Docker, Git, LLMs, RAG, and voice AI.',
    'What excites me most is the space between AI and software engineering — taking a model or an idea and building everything around it so it becomes reliable, useful, and actually worth using.',
  ],
} as const;

/* ---------------------------------------------------------------- *
 * Experience
 * ---------------------------------------------------------------- */

export const experience = [
  {
    company: 'PlatinumOne Business Services',
    role: 'Product Developer Intern — AI & Software',
    period: 'From June 1st, 2026 to July 31st, 2026',
    periodIsPlaceholder: false,
    summary:
      'Built an AI Voice Calling Platform end-to-end, developing an intelligent voice system capable of conducting real-time, conversational, and low-latency calls. Worked across the frontend, backend, AI pipeline, retrieval layer, and platform engineering required to turn the system into a reliable real-world application.',
    contributions: [
      {
        title: 'Real-Time Voice Pipeline',
        body: 'Built the browser-side voice loop and backend powering live conversations — from microphone capture and end-of-turn detection to streaming speech-to-text, LLM response generation, and text-to-speech. Focused heavily on latency, responsiveness, and natural turn-taking so conversations felt like actual human interactions rather than request-response exchanges.',
      },
      {
        title: 'Conversation Intelligence',
        body: "Managed conversation state and recovery across call sessions, so context carried naturally from one turn to the next instead of resetting with every exchange. Designed handling for uncertainty and unsupported questions — the system could acknowledge when it didn't have an answer rather than confidently inventing one.",
      },
      {
        title: 'RAG & Grounded Knowledge',
        body: 'Built the retrieval pipeline that enables the AI to answer using client-provided documents instead of relying solely on general model knowledge. Worked across document parsing, text extraction, chunking, indexing, semantic retrieval, and injecting relevant context into conversations.',
      },
      {
        title: 'Platform & Backend Engineering',
        body: 'Designed and integrated REST APIs, authentication and access control, rate limiting, usage controls, error handling, and security fixes. Worked across the application to improve reliability, protect sensitive data, and handle real-world failure scenarios.',
      },
      {
        title: 'Production & Reliability',
        body: "Implemented guardrails to keep responses within defined conversational boundaries, including handling for negative scenarios and human handoff when a question fell outside scope. Wrote the technical documentation and integration guides that made the system easier to understand and maintain, and worked through debugging, API limitations, provider failures, and edge cases that don't usually appear in classroom projects.",
      },
    ],
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Python',
      'FastAPI',
      'REST APIs',
      'SQLite',
      'PostgreSQL',
      'Docker',
      'Git',
      'LLMs',
      'RAG',
      'FAISS',
      'Speech-to-Text',
      'Text-to-Speech',
      'Real-Time Audio',
    ],
  },
] as const;

/* ---------------------------------------------------------------- *
 * Projects
 * ---------------------------------------------------------------- */

export const projects = [
  {
    slug: 'voice-ai-platform',
    title: 'AI Voice Assistant Platform',
    context: 'Internship project · PlatinumOne Business Services',
    year: '2026',
    status: 'Shipped internally',
    lede: 'A configurable voice assistant that holds a real spoken conversation — it listens, retrieves what it needs from a knowledge base, reasons, and answers out loud, fast enough to feel natural.',
    body: "The hard part of a voice assistant is not making it talk. It's making it talk quickly, stay factual, and behave predictably when something goes wrong. The system is domain-agnostic: the same codebase serves a new use case by swapping the uploaded knowledge base and the persona, never the code.",
    features: [
      {
        label: 'Streaming end to end',
        text: 'Speech, reasoning and playback all stream rather than waiting on complete responses, so the reply begins before it has finished being generated.',
      },
      {
        label: 'Retrieval-grounded replies',
        text: 'Uploaded documents are parsed, chunked and indexed; each turn pulls back only the passages relevant to the question and injects them as context.',
      },
      {
        label: 'Guardrail layer',
        text: 'A non-bypassable rule set constrains the assistant to what the knowledge base actually contains, and triggers a human handoff when it goes out of scope.',
      },
      {
        label: 'Post-call analysis',
        text: 'Each conversation is transcribed and analysed afterwards into structured fields, so calls become reviewable data instead of audio nobody listens to.',
      },
      {
        label: 'Configurable per deployment',
        text: 'Persona, tone and conversation flow are configuration, not forks — one platform, many use cases.',
      },
    ],
    stack: [
      'React',
      'JavaScript',
      'Python',
      'FastAPI',
      'LLMs',
      'STT',
      'TTS',
      'RAG',
      'SQLite',
      'REST APIs',
      'Docker',
    ],
    // Internal company product — source and deployment are not public.
    repo: null,
    demo: null,
    privateNote: 'Source is internal to the company and not publicly available.',
  },
  {
    slug: 'seooptimiz',
    title: 'SEOOptimiz',
    context: 'Independent project',
    year: '2026',
    status: 'Live',
    lede: 'A deterministic website analysis engine — paste a URL, and it scores the site across six dimensions using 60+ measurable signals instead of an LLM guessing whether the site is "good."',
    body: "Most audit tools are one of two extremes: hundreds of metrics with no way to tell what matters, or a single score with no way to see why. SEOOptimiz connects the two — every pillar score traces back to the concrete signals that produced it, and none of those signals come from a model deciding what looks right.",
    features: [
      {
        label: 'Six weighted pillars',
        text: 'SEO (25%), Responsiveness (20%), Accessibility (15%), Structure (15%), Trust (15%) and Conversion (10%) combine into one weighted overall score.',
      },
      {
        label: '60+ deterministic signals',
        text: 'Title metadata, heading hierarchy, alt text coverage, HTTPS and security headers, canonical configuration, ARIA usage, CTA clarity and more — each one a rule-based check, not a model judgment.',
      },
      {
        label: 'No LLM in the scoring path',
        text: 'The analysis engine evaluates concrete, measurable signals with deterministic rules, so the same URL produces the same score every time.',
      },
      {
        label: 'Exportable report',
        text: 'Results export to a structured PDF, so a scorecard is something a client or teammate can actually keep and act on.',
      },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'cheerio', 'GSAP', 'Lenis', 'Vercel'],
    repo: 'https://github.com/itsSrishant/SEOOptimiz',
    demo: 'https://seo-optimiz.vercel.app/',
    privateNote: null,
  },
] as const;

export type Project = (typeof projects)[number];

/* ---------------------------------------------------------------- *
 * Skills
 * ---------------------------------------------------------------- */

export const skills = [
  { group: 'Languages', items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL'] },
  { group: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS'] },
  { group: 'Backend', items: ['FastAPI', 'Spring Boot', 'REST APIs'] },
  {
    group: 'AI',
    items: ['LLMs', 'RAG', 'Embeddings', 'Speech-to-Text', 'Text-to-Speech'],
  },
  { group: 'Databases', items: ['PostgreSQL', 'SQLite'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'Docker', 'VS Code'] },
] as const;

/* ---------------------------------------------------------------- *
 * Navigation
 * ---------------------------------------------------------------- */

export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
] as const;
