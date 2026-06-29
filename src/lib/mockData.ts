import { Code as Code2, Globe as Globe2, Smartphone, Cloud, GitBranch, Brain, Lightbulb, Rocket, ShieldCheck, Sparkles, Cpu, Database, Layers, Workflow } from "lucide-react";

export const services = [
  {
    slug: "software-development",
    title: "Software Development",
    short: "Custom enterprise software engineered for scale.",
    icon: Code2,
    color: "#0088FF",
    description:
      "End-to-end product engineering — from architecture to production. We build resilient, maintainable systems that scale with your business.",
    capabilities: [
      "Enterprise SaaS platforms",
      "Microservices & event-driven systems",
      "API design & developer platforms",
      "Legacy modernization",
      "Performance engineering",
    ],
    stack: ["TypeScript", "Go", "Rust", "Python", "PostgreSQL", "Kafka"],
  },
  {
    slug: "web-development",
    title: "Web Development",
    short: "Cinematic, conversion-focused web experiences.",
    icon: Globe2,
    color: "#06B6D4",
    description:
      "Next-generation web platforms built with the modern stack — fast, accessible, and unforgettable.",
    capabilities: [
      "Marketing & brand sites",
      "Headless commerce",
      "Web apps & dashboards",
      "Edge-rendered platforms",
      "3D & WebGL experiences",
    ],
    stack: ["Next.js", "React", "Three.js", "Tailwind", "Vercel", "Sanity"],
  },
  {
    slug: "mobile-development",
    title: "Mobile Development",
    short: "Native-feeling apps for iOS, Android & cross-platform.",
    icon: Smartphone,
    color: "#00D4FF",
    description:
      "Apps users love opening. Strong design language, deep native integrations, and battery-efficient code.",
    capabilities: ["React Native", "Swift / Kotlin", "Offline-first sync", "Push & notifications", "App store strategy"],
    stack: ["React Native", "Expo", "Swift", "Kotlin", "Firebase"],
  },
  {
    slug: "cloud-services",
    title: "Cloud Services",
    short: "Multi-cloud architecture & migration.",
    icon: Cloud,
    color: "#0088FF",
    description:
      "Cloud-native platforms on AWS, GCP and Azure with cost optimization, security and observability baked in.",
    capabilities: ["Cloud migration", "Kubernetes platforms", "Serverless", "Cost optimization", "FinOps"],
    stack: ["AWS", "GCP", "Azure", "Kubernetes", "Terraform"],
  },
  {
    slug: "devops",
    title: "DevOps",
    short: "Ship faster, safer, more often.",
    icon: GitBranch,
    color: "#06B6D4",
    description:
      "Modern CI/CD, infrastructure-as-code, observability and platform engineering for high-velocity teams.",
    capabilities: ["CI/CD pipelines", "IaC with Terraform", "Observability", "SRE & on-call", "Platform engineering"],
    stack: ["GitHub Actions", "ArgoCD", "Datadog", "Grafana", "Pulumi"],
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    short: "Production-grade AI, RAG & agents.",
    icon: Brain,
    color: "#00D4FF",
    description:
      "From LLM apps to bespoke ML models — we deliver AI products that actually ship and create measurable value.",
    capabilities: ["LLM applications", "RAG pipelines", "Agentic workflows", "Computer vision", "MLOps"],
    stack: ["OpenAI", "Anthropic", "LangChain", "PyTorch", "Vector DBs"],
  },
  {
    slug: "consulting",
    title: "Technology Consulting",
    short: "Strategy that translates to working software.",
    icon: Lightbulb,
    color: "#0088FF",
    description:
      "Architecture reviews, technical due diligence and digital transformation roadmaps — delivered by senior engineers.",
    capabilities: ["Architecture audits", "Tech due diligence", "Team augmentation", "Roadmap & strategy"],
    stack: ["Discovery", "Workshops", "Prototyping", "Audits"],
  },
] as const;

export const technologies = [
  { name: "TypeScript", category: "Language" },
  { name: "Rust", category: "Language" },
  { name: "Go", category: "Language" },
  { name: "Python", category: "Language" },
  { name: "React", category: "Framework" },
  { name: "Next.js", category: "Framework" },
  { name: "Three.js", category: "3D" },
  { name: "Node.js", category: "Runtime" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "Kafka", category: "Streaming" },
  { name: "AWS", category: "Cloud" },
  { name: "GCP", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "Kubernetes", category: "Infra" },
  { name: "Docker", category: "Infra" },
  { name: "Terraform", category: "Infra" },
  { name: "OpenAI", category: "AI" },
  { name: "LangChain", category: "AI" },
  { name: "PyTorch", category: "AI" },
  { name: "Pinecone", category: "AI" },
] as const;

export const industries = [
  { name: "Financial Services", icon: ShieldCheck, blurb: "Trading platforms, neobanks, RegTech." },
  { name: "Healthcare", icon: Sparkles, blurb: "HIPAA-grade platforms, telemedicine, MedTech." },
  { name: "E-commerce & Retail", icon: Rocket, blurb: "Headless commerce, OMS, personalization." },
  { name: "Logistics & Supply Chain", icon: Workflow, blurb: "Tracking, optimization, IoT fleets." },
  { name: "SaaS & Tech Startups", icon: Cpu, blurb: "MVPs to Series-C platforms." },
  { name: "Energy & Utilities", icon: Layers, blurb: "Smart grids, IoT telemetry, ESG analytics." },
  { name: "EdTech", icon: Database, blurb: "Learning platforms, assessments, AI tutors." },
  { name: "Media & Entertainment", icon: Globe2, blurb: "Streaming, content ops, immersive web." },
] as const;

export const caseStudies = [
  {
    slug: "nova-banking-platform",
    client: "Nova Financial",
    title: "Re-platforming a digital bank for 10x growth",
    industry: "Financial Services",
    services: ["Software Development", "Cloud Services", "DevOps"],
    summary:
      "Migrated a monolithic core to an event-driven microservices platform on Kubernetes, cutting transaction latency by 78%.",
    metrics: [
      { label: "Latency reduction", value: "78%" },
      { label: "Deploys / week", value: "120+" },
      { label: "Uptime", value: "99.99%" },
    ],
    cover: "linear-gradient(135deg,#00D4FF,#0050A0)",
    year: 2025,
  },
  {
    slug: "lumen-ai-copilot",
    client: "Lumen Health",
    title: "An AI copilot for clinicians",
    industry: "Healthcare",
    services: ["AI Solutions", "Web Development"],
    summary:
      "Designed a RAG-powered clinical assistant grounded in patient records and medical literature, saving 4 hours per clinician per week.",
    metrics: [
      { label: "Hours saved / wk", value: "4h" },
      { label: "Doctor NPS", value: "+62" },
      { label: "Citations accuracy", value: "97%" },
    ],
    cover: "linear-gradient(135deg,#0094CC,#00D4FF)",
    year: 2025,
  },
  {
    slug: "orbit-commerce",
    client: "Orbit Retail",
    title: "Headless commerce for a global DTC brand",
    industry: "E-commerce & Retail",
    services: ["Web Development", "Cloud Services"],
    summary:
      "Replatformed onto a headless stack with edge rendering across 47 markets. Conversions jumped 34% on first launch.",
    metrics: [
      { label: "Conversion lift", value: "+34%" },
      { label: "LCP", value: "1.1s" },
      { label: "Markets", value: "47" },
    ],
    cover: "linear-gradient(135deg,#0050A0,#0094CC)",
    year: 2024,
  },
  {
    slug: "skyline-logistics",
    client: "Skyline Logistics",
    title: "Real-time fleet intelligence platform",
    industry: "Logistics",
    services: ["Software Development", "AI Solutions"],
    summary:
      "Built a real-time telemetry & ML routing platform over 12,000 vehicles, reducing fuel costs by 19%.",
    metrics: [
      { label: "Fuel cost", value: "-19%" },
      { label: "Vehicles", value: "12k" },
      { label: "Events / sec", value: "85k" },
    ],
    cover: "linear-gradient(135deg,#00D4FF,#0094CC)",
    year: 2024,
  },
] as const;

export const testimonials = [
  {
    quote:
      "DIMISI rebuilt our core platform in 9 months. We now ship 12x more often and our SREs sleep through the night.",
    name: "Aarav Mehta",
    title: "CTO, Nova Financial",
  },
  {
    quote:
      "Their AI team felt like an extension of our own. The copilot they shipped is now the most-loved tool at Lumen.",
    name: "Dr. Priya Shah",
    title: "Chief Medical Officer, Lumen Health",
  },
  {
    quote:
      "The most senior team we've worked with. They challenged our roadmap and made it 10x better.",
    name: "Marcus Lee",
    title: "VP Engineering, Orbit Retail",
  },
] as const;

export const stats = [
  { label: "Projects delivered", value: 240, suffix: "+" },
  { label: "Industries served", value: 18, suffix: "" },
  { label: "Years engineering", value: 12, suffix: "+" },
  { label: "Client satisfaction", value: 98, suffix: "%" },
] as const;

export type Service = (typeof services)[number];
export type CaseStudy = (typeof caseStudies)[number];
