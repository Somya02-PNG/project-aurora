import {
  Activity, BarChart3, Boxes, Compass, Cpu, FlaskConical, Gauge, GitBranch,
  Headphones, LayoutGrid, LineChart, Rocket, Search, ShieldCheck, Sparkles,
  TestTube2, Wand2, Workflow, Zap, Cloud, Server, Brain, Lightbulb, Smartphone,
  Globe2, Code2,
} from "lucide-react";
import type { ComponentType } from "react";

export interface Benefit {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

export interface ProcessStep {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface ServiceContent {
  tagline: string;
  overview: string[];
  benefits: Benefit[];
  process: ProcessStep[];
  technologies: string[];
  faqs: FAQ[];
  caseStudySlugs: string[];
  metaTitle: string;
  metaDescription: string;
}

const defaultProcess: ProcessStep[] = [
  { icon: Search, title: "Discovery", body: "Understand goals, users, constraints and success metrics." },
  { icon: Compass, title: "Planning", body: "Architecture, roadmap, scope and clear milestones." },
  { icon: Code2, title: "Development", body: "Iterative delivery with weekly demos and tight feedback." },
  { icon: TestTube2, title: "QA & Testing", body: "Automated tests, security review and performance hardening." },
  { icon: Rocket, title: "Launch & Support", body: "Production rollout, monitoring and ongoing optimisation." },
];

export const serviceContent: Record<string, ServiceContent> = {
  "software-development": {
    tagline: "Custom software engineered to grow with your business.",
    overview: [
      "We build enterprise-grade software that handles real-world load — from product MVPs to platforms serving millions of users. Our engineers act as a senior extension of your team, owning architecture, delivery and quality.",
      "Every system we ship is designed for change: clean domain boundaries, automated tests, observable infrastructure and documentation your future hires will actually use.",
    ],
    benefits: [
      { icon: Boxes, title: "Architected for scale", body: "Event-driven, modular systems that survive the next 10x of users and features." },
      { icon: ShieldCheck, title: "Security by default", body: "Threat modelling, secrets management and least-privilege access built in from day one." },
      { icon: Gauge, title: "Performance-first", body: "We profile before shipping. Sub-second responses are a target, not a hope." },
      { icon: Workflow, title: "Maintainable codebase", body: "Strong typing, code reviews and lived-in documentation keep velocity high long-term." },
      { icon: LineChart, title: "Measurable outcomes", body: "Every milestone tied to business KPIs — adoption, conversion, retention, cost." },
      { icon: Headphones, title: "Long-term partnership", body: "Optional managed support and SLAs after launch." },
    ],
    process: defaultProcess,
    technologies: ["TypeScript", "Go", "Rust", "Python", "Node.js", "PostgreSQL", "Kafka", "Redis"],
    faqs: [
      { q: "Do you take fixed-scope projects or staff augmentation?", a: "Both. Most engagements start as a fixed-scope discovery, then transition into a dedicated squad model once the roadmap is validated." },
      { q: "Who owns the code we build together?", a: "You do — 100%. We hand over a clean repository, infrastructure as code and full documentation on day one of every project." },
      { q: "How do you handle changing requirements mid-build?", a: "We work in two-week iterations with weekly demos. Scope changes are scored, sized and re-prioritised collaboratively rather than triggering change-orders." },
      { q: "What does a typical timeline look like?", a: "MVPs ship in 8–14 weeks; full enterprise builds 4–9 months. Discovery usually takes 1–3 weeks." },
    ],
    caseStudySlugs: ["nova-banking-platform", "skyline-logistics"],
    metaTitle: "Custom Software Development — DIMISI.tech",
    metaDescription: "Senior engineering team building custom enterprise software, microservices, APIs and platforms that scale. Discovery to launch.",
  },

  "web-development": {
    tagline: "High-performance web platforms that convert.",
    overview: [
      "From cinematic marketing sites to complex web applications and headless commerce, we ship modern web experiences engineered for speed, accessibility and conversion.",
      "Every site we build is measured on Core Web Vitals, SEO health and the metric you actually care about — leads, signups or revenue.",
    ],
    benefits: [
      { icon: Zap, title: "Sub-second load times", body: "Edge rendering, image optimisation and code-splitting baked in." },
      { icon: BarChart3, title: "Built for SEO", body: "Crawlable, semantic, structured data and proper meta from day one." },
      { icon: LayoutGrid, title: "Design-led", body: "Cinematic, brand-first interfaces with motion that means something." },
      { icon: ShieldCheck, title: "Secure & accessible", body: "WCAG 2.1 AA, HTTPS, CSP headers and audited dependencies." },
      { icon: Sparkles, title: "3D & WebGL where it counts", body: "Strategic immersive moments that lift dwell time without hurting performance." },
      { icon: Workflow, title: "Headless CMS ready", body: "Sanity, Contentful, Storyblok — your team owns the content." },
    ],
    process: defaultProcess,
    technologies: ["Next.js", "React", "TanStack Start", "TypeScript", "Tailwind", "Three.js", "Sanity", "Vercel"],
    faqs: [
      { q: "Can you redesign without rebuilding from scratch?", a: "Yes. We routinely re-skin existing sites in stages, shipping a new design system page-by-page with zero downtime." },
      { q: "Do you handle copywriting too?", a: "We collaborate with in-house teams or bring in vetted copy partners. We can write structural copy ourselves to keep momentum." },
      { q: "Will the site be easy for our marketing team to update?", a: "Always. We integrate a CMS so non-technical editors can publish without engineering involvement." },
      { q: "What about analytics and A/B testing?", a: "GA4, PostHog, server-side tracking and experimentation tooling are standard add-ons." },
    ],
    caseStudySlugs: ["orbit-commerce", "lumen-ai-copilot"],
    metaTitle: "Web Development — Cinematic, conversion-focused sites | DIMISI.tech",
    metaDescription: "Modern web platforms — marketing sites, web apps, headless commerce. Engineered for speed, SEO and conversion.",
  },

  "mobile-development": {
    tagline: "Native-feeling apps your users open every day.",
    overview: [
      "We build mobile apps that feel native, stay performant and ship reliably to both stores. Whether React Native for shared codebases or fully native Swift / Kotlin, we pick the right tool per project.",
      "Offline-first sync, push notifications, biometric auth, in-app purchases and app store submission are handled end-to-end.",
    ],
    benefits: [
      { icon: Smartphone, title: "iOS + Android parity", body: "One product, two stores, consistent UX across both." },
      { icon: Gauge, title: "60fps animations", body: "Battery-efficient, smooth interactions on mid-range devices too." },
      { icon: ShieldCheck, title: "Secure by design", body: "Encrypted storage, certificate pinning, biometric authentication." },
      { icon: Activity, title: "Offline-first sync", body: "Apps that work on the subway and reconcile cleanly when they reconnect." },
      { icon: Rocket, title: "App store strategy", body: "ASO, screenshots, review-process expertise — first submissions usually pass." },
      { icon: LineChart, title: "Analytics built in", body: "Funnel tracking, crash reporting and A/B testing wired from launch." },
    ],
    process: defaultProcess,
    technologies: ["React Native", "Expo", "Swift", "Kotlin", "Firebase", "Sentry", "RevenueCat"],
    faqs: [
      { q: "React Native vs fully native — how do you choose?", a: "If 80%+ of your features are shared and performance budgets are reasonable, React Native wins on time-to-market. We go native for heavy AR, complex audio, or platform-specific deep integrations." },
      { q: "Will you submit to the App Store and Play Store for us?", a: "Yes. We handle review submissions, screenshots, listings and policy compliance." },
      { q: "How long until a first build is in our hands?", a: "Internal TestFlight / Play Console builds within 2–3 weeks of project start." },
      { q: "Do you support apps after launch?", a: "Yes — bug fixes, OS updates, new features and managed releases on a retainer model." },
    ],
    caseStudySlugs: ["lumen-ai-copilot", "skyline-logistics"],
    metaTitle: "Mobile App Development — iOS, Android & Cross-platform | DIMISI.tech",
    metaDescription: "React Native, Swift and Kotlin apps with offline sync, push and store-submission handled. Built to feel native on every device.",
  },

  "cloud-services": {
    tagline: "Cloud-native infrastructure that scales without surprises.",
    overview: [
      "We design and operate cloud infrastructure on AWS, GCP and Azure — from greenfield serverless platforms to lift-and-shift migrations of legacy estates.",
      "Security, cost optimisation and observability aren't add-ons; they're how we architect from the first sketch.",
    ],
    benefits: [
      { icon: Cloud, title: "Multi-cloud expertise", body: "AWS, GCP, Azure — we pick the right stack for your workload and team." },
      { icon: BarChart3, title: "Cost optimisation", body: "Right-sizing, reserved capacity and FinOps practices that cut bills by 30–60%." },
      { icon: ShieldCheck, title: "Compliance ready", body: "HIPAA, SOC 2, PCI, GDPR — controls built into infra, not bolted on later." },
      { icon: Server, title: "Migration without downtime", body: "Strangler-fig patterns and blue/green cutovers keep your business running." },
      { icon: Activity, title: "Full observability", body: "Metrics, logs and traces unified — you'll know what broke before customers do." },
      { icon: Workflow, title: "IaC everything", body: "Terraform / Pulumi — every environment reproducible, every change reviewed." },
    ],
    process: defaultProcess,
    technologies: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Pulumi", "CloudFront", "Lambda"],
    faqs: [
      { q: "Can you reduce our existing cloud bill?", a: "Almost always. A typical FinOps audit identifies 30–50% in savings within the first 30 days through right-sizing, reservations and architectural changes." },
      { q: "We're regulated — can you support compliance?", a: "Yes. We've shipped HIPAA, SOC 2 and PCI-DSS environments and can prepare you for audits." },
      { q: "Do you provide 24/7 production support?", a: "Optional SRE retainers cover on-call, incident response and SLAs." },
      { q: "How long does a migration usually take?", a: "Small workloads in weeks. Enterprise estates run 6–18 months in phased waves." },
    ],
    caseStudySlugs: ["nova-banking-platform", "orbit-commerce"],
    metaTitle: "Cloud Services — AWS, GCP, Azure architecture & migration | DIMISI.tech",
    metaDescription: "Cloud-native platforms, migrations, FinOps and compliance — engineered by senior cloud architects.",
  },

  "devops": {
    tagline: "Ship faster, recover quicker, sleep better.",
    overview: [
      "We replace fragile, manual deploys with golden CI/CD pipelines, IaC and observability that scale across teams. The goal: any engineer can ship safely on day one.",
      "We also stand up internal developer platforms so your product squads stop reinventing pipelines and start shipping features.",
    ],
    benefits: [
      { icon: Zap, title: "10× deployment frequency", body: "Trunk-based development, automated tests and progressive delivery." },
      { icon: GitBranch, title: "Golden pipelines", body: "Reusable workflows for build, test, scan, deploy and rollback." },
      { icon: ShieldCheck, title: "Shift-left security", body: "SAST, SCA, secret scanning and policy-as-code in every pipeline." },
      { icon: Activity, title: "Observability that pays off", body: "SLOs, error budgets and dashboards your on-call team actually uses." },
      { icon: Workflow, title: "Platform engineering", body: "Internal developer platforms that let product teams self-serve." },
      { icon: Headphones, title: "On-call uplift", body: "Runbooks, incident drills and post-mortems that build a learning culture." },
    ],
    process: defaultProcess,
    technologies: ["GitHub Actions", "ArgoCD", "Terraform", "Kubernetes", "Datadog", "Grafana", "Prometheus", "PagerDuty"],
    faqs: [
      { q: "We don't have a platform team yet — can you build one?", a: "Yes. We design platforms with your engineers, then transfer ownership through documentation, training and hands-on shadowing." },
      { q: "How do you measure DevOps success?", a: "The DORA metrics: deployment frequency, lead time, change failure rate and MTTR. Baselines first, improvements second." },
      { q: "Can you integrate with our existing tooling?", a: "Almost always. We adapt to your stack — GitLab, Jenkins, CircleCI, Bitbucket — rather than forcing a rip-and-replace." },
      { q: "Do you run training for our internal teams?", a: "Yes — workshops, pair-programming weeks and async documentation." },
    ],
    caseStudySlugs: ["nova-banking-platform", "skyline-logistics"],
    metaTitle: "DevOps Services — CI/CD, IaC, SRE & platform engineering | DIMISI.tech",
    metaDescription: "Golden CI/CD pipelines, Terraform, Kubernetes and observability for high-velocity engineering teams.",
  },

  "ai-solutions": {
    tagline: "Production AI that actually ships.",
    overview: [
      "We build AI products end-to-end: LLM applications, RAG pipelines, agentic workflows and bespoke ML models. We focus on the unglamorous parts — evals, guardrails, latency, cost — that decide whether AI ships or stalls in a demo.",
      "Whether you need a clinical copilot, a customer-support agent or a vision pipeline, we deliver measurable business outcomes, not chat windows.",
    ],
    benefits: [
      { icon: Brain, title: "LLM apps & RAG", body: "Grounded, cited, evaluated retrieval systems on your private data." },
      { icon: Wand2, title: "Agentic workflows", body: "Multi-step agents with tool use, memory and human-in-the-loop." },
      { icon: FlaskConical, title: "Eval-driven", body: "Offline + online evals so quality regressions are caught in CI, not by users." },
      { icon: ShieldCheck, title: "Safety & guardrails", body: "PII redaction, jailbreak defence, output validation and audit logging." },
      { icon: Cpu, title: "Bespoke ML models", body: "Vision, forecasting, recommendation — trained on your data when off-the-shelf can't." },
      { icon: Gauge, title: "MLOps from day one", body: "Versioned datasets, reproducible training, monitored production models." },
    ],
    process: defaultProcess,
    technologies: ["OpenAI", "Anthropic", "LangChain", "PyTorch", "Pinecone", "Weaviate", "Hugging Face", "MLflow"],
    faqs: [
      { q: "Do you fine-tune your own models or just call APIs?", a: "Both, deliberately. We start with frontier APIs to validate the product, then fine-tune or distill smaller models for cost, latency or privacy reasons." },
      { q: "How do you measure AI quality?", a: "With eval suites — task-specific tests, LLM-as-judge, human review and live production scorecards." },
      { q: "Can the AI run on our own infrastructure?", a: "Yes. We've shipped self-hosted Llama, Mistral and Whisper deployments for regulated industries." },
      { q: "What about hallucinations and safety?", a: "We use retrieval grounding, citations, output validation and human-in-the-loop checkpoints. We won't ship something that lies confidently." },
    ],
    caseStudySlugs: ["lumen-ai-copilot", "skyline-logistics"],
    metaTitle: "AI Solutions — LLM apps, RAG & ML engineering | DIMISI.tech",
    metaDescription: "Production-grade AI: LLM applications, RAG, agents and bespoke ML models — built with evals, guardrails and MLOps.",
  },

  "consulting": {
    tagline: "Senior engineering strategy that ends in working software.",
    overview: [
      "Architecture reviews, technical due diligence, digital-transformation roadmaps and team augmentation — delivered by engineers who have built the systems they're advising on.",
      "We don't drop a slide deck and disappear. Every engagement ends with a prioritised, costed plan your team can execute, and we can stay to help execute it.",
    ],
    benefits: [
      { icon: Lightbulb, title: "Architecture reviews", body: "Independent assessment of scalability, security and maintainability." },
      { icon: Search, title: "Technical due diligence", body: "Pre-investment audits for VCs, PE and acquirers — code, team, infra, risk." },
      { icon: Compass, title: "Digital transformation", body: "Multi-year roadmaps tied to business outcomes, not technology fashions." },
      { icon: Workflow, title: "Team augmentation", body: "Senior engineers and tech leads embedded in your squads, time-boxed or open-ended." },
      { icon: Rocket, title: "Go-to-market strategy", body: "Pricing, packaging and launch sequencing for technical products." },
      { icon: ShieldCheck, title: "Vendor selection", body: "Independent evaluation of build vs buy, vendors and cloud providers." },
    ],
    process: defaultProcess,
    technologies: ["Discovery", "Workshops", "Audits", "Prototyping", "Roadmapping"],
    faqs: [
      { q: "How long is a typical consulting engagement?", a: "Audits and due diligence run 1–4 weeks. Transformation roadmaps 4–12 weeks. Team augmentation is open-ended." },
      { q: "Will you write code as part of the engagement?", a: "Often, yes — we ship reference implementations and PoCs alongside the strategy work." },
      { q: "Can you talk to our investors / board?", a: "Yes. We routinely present findings to boards, investment committees and exec teams." },
      { q: "Are recommendations vendor-neutral?", a: "Yes. We have no resale agreements with cloud or software vendors — recommendations are based on your needs only." },
    ],
    caseStudySlugs: ["nova-banking-platform", "orbit-commerce"],
    metaTitle: "Technology Consulting — Architecture, due diligence, roadmaps | DIMISI.tech",
    metaDescription: "Senior engineering consulting — architecture reviews, technical due diligence and transformation roadmaps that ship.",
  },
};

export function getServiceContent(slug: string): ServiceContent {
  return serviceContent[slug] ?? serviceContent["software-development"];
}
