export type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
};

export type HeroContent = {
  kicker: string;
  title: string;
  highlight: string;
  lead: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type ServiceItem = {
  title: string;
  description: string;
};

export type ProjectItem = {
  title: string;
  type: string;
  description: string;
  tags: string[];
};

export type ExperienceItem = {
  company: string;
  location: string;
  role: string;
  period: string;
  bullets: string[];
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

export type Education = {
  degree: string;
  school: string;
  period: string;
  gpa: string;
  project: string;
  coursework: string[];
};

export type ProcessItem = {
  step: string;
  title: string;
  text: string;
};

export type LinkPageSocial = {
  label: string;
  url: string;
  platform: string;
  username: string;
  icon: string;
  enabled: boolean;
};

export type LinkPageItem = {
  title: string;
  url: string;
  platform: string;
  username: string;
  description: string;
  category: string;
  icon: string;
  enabled: boolean;
  featured: boolean;
};

export type LinkPage = {
  enabled: boolean;
  handle: string;
  headline: string;
  bio: string;
  highlightText: string;
  avatarText: string;
  avatarImage: string;
  status: string;
  location: string;
  theme: string;
  accent: string;
  background: string;
  layout: string;
  showVerifiedBadge: boolean;
  showShareButton: boolean;
  socials: LinkPageSocial[];
  links: LinkPageItem[];
};

export type PortfolioContent = {
  profile: Profile;
  hero: HeroContent;
  stats: StatItem[];
  focusAreas: string[];
  trusted: string[];
  services: ServiceItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  skillGroups: SkillGroup[];
  education: Education;
  process: ProcessItem[];
  linkPage: LinkPage;
};

export const defaultPortfolioContent: PortfolioContent = {
  profile: {
    name: "Ahmed Salman",
    role: "Mid-Senior Backend Software Engineer",
    location: "Dammam, KSA / Remote",
    email: "ahmedsapry486@gmail.com",
    phone: "+20 01006419351",
    linkedin: "https://www.linkedin.com/in/ahmed-salman74",
    github: "https://github.com/ahmedsalman74",
    summary:
      "Mid-senior backend software engineer with strong experience building scalable distributed systems and microservices architectures. Specialized in Node.js, TypeScript, and cloud platforms with deep expertise in API design, database optimization, performance tuning, and event-driven systems.",
  },
  hero: {
    kicker: "Mid-Senior Backend Software Engineer",
    title: "Hi, I am Ahmed, building",
    highlight: "backend systems that scale.",
    lead:
      "I turn complex product requirements into fast, reliable APIs, microservices, and distributed systems for high-traffic products.",
  },
  stats: [
    { value: "500+", label: "Merchants served" },
    { value: "10k+", label: "Daily reservations" },
    { value: "1M+", label: "Daily active users" },
    { value: "99.9%", label: "Payment success rate" },
  ],
  focusAreas: [
    "Node.js",
    "TypeScript",
    "Nest.js",
    "Microservices",
    "gRPC",
    "Redis",
    "Elasticsearch",
    "AWS",
    "GCP",
    "Kubernetes",
  ],
  trusted: ["V For Technology", "Zetaton", "CustEx", "Panda KSA", "Harmony"],
  services: [
    {
      title: "Backend Architecture",
      description:
        "Design scalable services, domain boundaries, APIs, data models, and infrastructure foundations for production systems.",
    },
    {
      title: "Microservices & APIs",
      description:
        "Build modular Node.js and Nest.js services with REST, gRPC, event-driven flows, and clean integration contracts.",
    },
    {
      title: "Performance & Reliability",
      description:
        "Optimize databases, caching, search, load balancing, testing, and cloud delivery so systems stay fast under traffic.",
    },
  ],
  projects: [
    {
      title: "Panda KSA",
      type: "E-commerce marketplace",
      description:
        "Architected a scalable marketplace backend with Elasticsearch-driven search, Stripe-secured payments, and support for 100+ stores.",
      tags: ["Elasticsearch", "Stripe", "Marketplace"],
    },
    {
      title: "Harmony",
      type: "Housekeeping platform",
      description:
        "Engineered backend services for a cloud-based housekeeping management system using Firebase, reducing scheduling conflicts by 30%.",
      tags: ["Firebase", "Scheduling", "Automation"],
    },
    {
      title: "Women First Ride-Hailing",
      type: "Realtime tracking",
      description:
        "Built a realtime backend tracking system using WebSockets and Mapbox APIs, decreasing ETA mismatches by 25%.",
      tags: ["WebSockets", "Mapbox", "Realtime"],
    },
    {
      title: "Loyalty Management Service",
      type: "Cloud microservices",
      description:
        "Developed a microservices-based backend on Google Cloud, handling 100k+ daily requests and improving user engagement by 35%.",
      tags: ["GCP", "Microservices", "Scale"],
    },
  ],
  experience: [
    {
      company: "V For Technology",
      location: "Dammam, KSA",
      role: "Mid-Senior Software Engineer",
      period: "May 2025 - Present",
      bullets: [
        "Led the catalog service for a multi-tenant SaaS e-commerce platform serving 500+ merchants.",
        "Architected 8 scalable microservices using Nest.js, Nx monorepo, and gRPC for catalog and inventory management.",
        "Improved search performance by 40% with Redis caching and Elasticsearch optimization.",
        "Reduced API response time from 800ms to 200ms through query optimization and load balancing.",
      ],
    },
    {
      company: "Zetaton",
      location: "Milwaukee, US - Remote",
      role: "Backend Developer",
      period: "Apr 2024 - May 2025",
      bullets: [
        "Built a scalable booking system handling 10k+ daily reservations with automated payment processing.",
        "Designed event-driven architecture with Firebase, GCP Pub/Sub, and Stripe API integration.",
        "Implemented realtime order management with automated workflows and error handling.",
        "Reached a 99.9% payment success rate and reduced booking processing time by 60%.",
      ],
    },
    {
      company: "CustEx",
      location: "Remote",
      role: "Backend Developer",
      period: "Jun 2023 - Feb 2024",
      bullets: [
        "Optimized a video transcoding pipeline for a platform serving 1M+ daily active users.",
        "Redesigned load balancing logic and implemented a comprehensive Jest testing strategy.",
        "Reached 85% code coverage across unit and integration tests.",
        "Increased video processing throughput by 40% and reduced production bugs by 70%.",
      ],
    },
  ],
  skillGroups: [
    {
      title: "Programming",
      skills: ["JavaScript", "TypeScript", "Python", "C++", "SQL"],
    },
    {
      title: "Backend",
      skills: [
        "Node.js",
        "Express.js",
        "Nest.js",
        "Fastify",
        "REST APIs",
        "gRPC",
        "Microservices",
        "Event-driven Architecture",
      ],
    },
    {
      title: "Database",
      skills: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    },
    {
      title: "Cloud & DevOps",
      skills: ["AWS EC2", "AWS S3", "AWS Lambda", "GCP", "Docker", "Kubernetes"],
    },
    {
      title: "Tools",
      skills: ["Git", "Jenkins", "GitHub Actions", "Jest", "Mocha", "Swagger", "Nx Monorepo"],
    },
  ],
  education: {
    degree: "Bachelor of Science in Computer Science & AI",
    school: "Benha University",
    period: "2019 - 2023",
    gpa: "GPA: 3.4/4.0",
    project: "Graduation Project: A+",
    coursework: [
      "Data Structures & Algorithms",
      "System Design",
      "Distributed Systems",
      "Cloud Computing",
    ],
  },
  process: [
    {
      step: "01",
      title: "Define & Architect",
      text:
        "Map the product flow, service boundaries, data model, and delivery risks before code starts.",
    },
    {
      step: "02",
      title: "Build & Optimize",
      text:
        "Ship modular backend services with clean APIs, database tuning, caching, and strong test coverage.",
    },
    {
      step: "03",
      title: "Deploy & Support",
      text:
        "Move confidently into production with cloud infrastructure, monitoring, and practical reliability work.",
    },
  ],
  linkPage: {
    enabled: true,
    handle: "ahmedsalman74",
    headline: "Ahmed Salman",
    bio:
      "Senior backend software engineer, passionate gamer, and game streamer exploring new games, developer tools, Twitch, Kick, TikTok, X/Twitter, and emerging technologies.",
    highlightText:
      "Senior backend software engineer, passionate gamer, and game streamer exploring Twitch, Kick, TikTok, X/Twitter, new games, and new technologies.",
    avatarText: "AS",
    avatarImage: "",
    status: "Available for backend roles and consulting",
    location: "Dammam, KSA / Remote",
    theme: "midnight",
    accent: "#37e0ff",
    background: "#05070b",
    layout: "stack",
    showVerifiedBadge: true,
    showShareButton: true,
    socials: [
      {
        label: "GitHub",
        url: "https://github.com/ahmedsalman74",
        platform: "github",
        username: "ahmedsalman74",
        icon: "GH",
        enabled: true,
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/ahmed-salman74",
        platform: "linkedin",
        username: "ahmed-salman74",
        icon: "IN",
        enabled: true,
      },
      {
        label: "Email",
        url: "mailto:ahmedsapry486@gmail.com",
        platform: "email",
        username: "ahmedsapry486@gmail.com",
        icon: "@",
        enabled: true,
      },
      {
        label: "Twitch",
        url: "https://www.twitch.tv/kingsalman74",
        platform: "twitch",
        username: "kingsalman74",
        icon: "TW",
        enabled: true,
      },
      {
        label: "TikTok",
        url: "https://www.tiktok.com/@salman74_",
        platform: "tiktok",
        username: "salman74_",
        icon: "TT",
        enabled: true,
      },
      {
        label: "Kick",
        url: "https://kick.com/kingsalman74",
        platform: "kick",
        username: "kingsalman74",
        icon: "KI",
        enabled: true,
      },
      {
        label: "X / Twitter",
        url: "https://x.com/ahmedsalman74_",
        platform: "x",
        username: "ahmedsalman74_",
        icon: "X",
        enabled: true,
      },
    ],
    links: [
      {
        title: "Portfolio",
        url: "/",
        platform: "portfolio",
        username: "/",
        description: "Explore my projects, experience, and backend services.",
        category: "Featured",
        icon: "PF",
        enabled: true,
        featured: true,
      },
      {
        title: "Preview CV",
        url: "/cv",
        platform: "portfolio",
        username: "/cv",
        description: "Open my CV as a PDF page.",
        category: "Featured",
        icon: "CV",
        enabled: true,
        featured: true,
      },
      {
        title: "Ask me anonymously",
        url: "/ask",
        platform: "ask",
        username: "/ask",
        description: "Send an anonymous question or read my public answers.",
        category: "Featured",
        icon: "?",
        enabled: true,
        featured: true,
      },
      {
        title: "GitHub",
        url: "https://github.com/ahmedsalman74",
        platform: "github",
        username: "ahmedsalman74",
        description: "Source code, repositories, and engineering work.",
        category: "Social",
        icon: "GH",
        enabled: true,
        featured: false,
      },
      {
        title: "LinkedIn",
        url: "https://www.linkedin.com/in/ahmed-salman74",
        platform: "linkedin",
        username: "ahmed-salman74",
        description: "Professional profile and experience.",
        category: "Social",
        icon: "IN",
        enabled: true,
        featured: false,
      },
      {
        title: "Book a call",
        url: "mailto:ahmedsapry486@gmail.com",
        platform: "email",
        username: "ahmedsapry486@gmail.com",
        description: "Reach me for backend roles, architecture, or consulting.",
        category: "Contact",
        icon: "@",
        enabled: true,
        featured: false,
      },
      {
        title: "Twitch",
        url: "https://www.twitch.tv/kingsalman74",
        platform: "twitch",
        username: "kingsalman74",
        description: "Follow Salman Twitch streams and gaming content.",
        category: "Streaming",
        icon: "TW",
        enabled: true,
        featured: true,
      },
      {
        title: "Kick",
        url: "https://kick.com/kingsalman74",
        platform: "kick",
        username: "kingsalman74",
        description: "Watch Salman Kick streams and live gaming sessions.",
        category: "Streaming",
        icon: "KI",
        enabled: true,
        featured: true,
      },
      {
        title: "TikTok",
        url: "https://www.tiktok.com/@salman74_",
        platform: "tiktok",
        username: "salman74_",
        description: "Short gaming clips and new technology content from Salman TikTok.",
        category: "Social",
        icon: "TT",
        enabled: true,
        featured: false,
      },
      {
        title: "X / Twitter",
        url: "https://x.com/ahmedsalman74_",
        platform: "x",
        username: "ahmedsalman74_",
        description: "Ahmed Salman Twitter and X updates for software engineering and gaming.",
        category: "Social",
        icon: "X",
        enabled: true,
        featured: false,
      },
    ],
  },
};

export const profile = defaultPortfolioContent.profile;
export const heroStats = defaultPortfolioContent.stats;
export const focusAreas = defaultPortfolioContent.focusAreas;
export const services = defaultPortfolioContent.services;
export const projects = defaultPortfolioContent.projects;
export const experience = defaultPortfolioContent.experience;
export const skillGroups = defaultPortfolioContent.skillGroups;
export const education = defaultPortfolioContent.education;
