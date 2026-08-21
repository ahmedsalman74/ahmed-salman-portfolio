const strengths = [
  "Node.js & TypeScript",
  "Nest.js microservices",
  "gRPC & REST APIs",
  "PostgreSQL & MongoDB",
  "Redis & Elasticsearch",
  "AWS, GCP & Kubernetes",
];

const metrics = [
  { value: "500+", label: "merchants served" },
  { value: "10k+", label: "daily reservations" },
  { value: "1M+", label: "daily active users" },
  { value: "99.9%", label: "payment success rate" },
];

const projects = [
  {
    title: "Panda KSA",
    type: "E-commerce backend",
    description:
      "Architected a scalable marketplace backend with Elasticsearch-driven search, Stripe-secured payments, and support for 100+ stores.",
    tags: ["Elasticsearch", "Stripe", "Marketplace"],
  },
  {
    title: "Harmony",
    type: "Cloud operations",
    description:
      "Engineered backend services for a cloud-based housekeeping management system using Firebase, reducing scheduling conflicts by 30%.",
    tags: ["Firebase", "Scheduling", "Workflows"],
  },
  {
    title: "Women First Ride-Hailing",
    type: "Realtime systems",
    description:
      "Built a realtime backend tracking system using WebSockets and Mapbox APIs, decreasing ETA mismatches by 25%.",
    tags: ["WebSockets", "Mapbox", "Realtime"],
  },
  {
    title: "Loyalty Management Service",
    type: "Microservices",
    description:
      "Developed a microservices-based backend on Google Cloud, handling 100k+ daily requests and improving user engagement by 35%.",
    tags: ["GCP", "Microservices", "Scale"],
  },
];

const experience = [
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
];

const skillGroups = [
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
      "Event-driven systems",
    ],
  },
  {
    title: "Data",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
  },
  {
    title: "Cloud & DevOps",
    skills: ["AWS EC2", "AWS S3", "AWS Lambda", "GCP", "Docker", "Kubernetes"],
  },
  {
    title: "Delivery",
    skills: ["Git", "Jenkins", "GitHub Actions", "Jest", "Mocha", "Swagger", "Nx Monorepo"],
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="heroOverlay" />
        <header className="siteHeader" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Ahmed Salman home">
            <span className="brandMark">AS</span>
            <span>Ahmed Salman</span>
          </a>
          <nav>
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <div className="heroContent">
          <p className="eyebrow">Mid-Senior Backend Software Engineer</p>
          <h1 id="hero-title">Ahmed Salman</h1>
          <p className="heroLead">
            I design scalable distributed systems, microservices, and production
            backend platforms with Node.js, TypeScript, cloud infrastructure,
            and performance-first engineering.
          </p>
          <div className="heroActions" aria-label="Primary actions">
            <a className="primaryAction" href="mailto:ahmedsapry486@gmail.com">
              Start a conversation
            </a>
            <a className="secondaryAction" href="#work">
              View selected work
            </a>
          </div>
          <div className="strengthList" aria-label="Engineering focus areas">
            {strengths.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="heroStatus" aria-label="Current professional summary">
          <p>
            Building reliable backend infrastructure for high-traffic,
            production-scale applications across SaaS, booking, media, and
            marketplace products.
          </p>
        </div>
      </section>

      <section className="section metricsBand" aria-label="Portfolio highlights">
        <div className="contentGrid metricsGrid">
          {metrics.map((metric) => (
            <article className="metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section aboutSection" aria-labelledby="about-title">
        <div className="contentGrid twoColumn">
          <div>
            <p className="sectionKicker">Profile</p>
            <h2 id="about-title">Backend engineering for systems that need to scale.</h2>
          </div>
          <div className="bodyCopy">
            <p>
              I am a mid-senior backend software engineer specialized in
              scalable distributed systems, microservices architecture, API
              design, database optimization, performance tuning, and
              event-driven systems.
            </p>
            <p>
              My recent work includes multi-tenant SaaS e-commerce platforms,
              booking systems with automated payments, realtime order
              management, video processing infrastructure, and cloud-based
              loyalty services handling production traffic at scale.
            </p>
          </div>
        </div>
      </section>

      <section className="section workSection" id="work" aria-labelledby="work-title">
        <div className="sectionIntro">
          <p className="sectionKicker">Selected Work</p>
          <h2 id="work-title">Production systems with measurable impact.</h2>
        </div>
        <div className="projectGrid">
          {projects.map((project) => (
            <article className="projectCard" key={project.title}>
              <div className="cardTopline">{project.type}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tagRow" aria-label={`${project.title} skills`}>
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section experienceSection"
        id="experience"
        aria-labelledby="experience-title"
      >
        <div className="contentGrid twoColumn">
          <div>
            <p className="sectionKicker">Experience</p>
            <h2 id="experience-title">Backend delivery across SaaS, cloud, and media platforms.</h2>
          </div>
          <div className="experienceList">
            {experience.map((item) => (
              <article className="experienceItem" key={`${item.company}-${item.role}`}>
                <div className="experienceHeader">
                  <div>
                    <h3>{item.role}</h3>
                    <p>{item.company}</p>
                  </div>
                  <div className="experienceMeta">
                    <span>{item.period}</span>
                    <span>{item.location}</span>
                  </div>
                </div>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section skillsSection" id="skills" aria-labelledby="skills-title">
        <div className="sectionIntro compactIntro">
          <p className="sectionKicker">Toolbox</p>
          <h2 id="skills-title">The stack I use to ship reliable backend systems.</h2>
        </div>
        <div className="skillGroupGrid" aria-label="Technical skills">
          {skillGroups.map((group) => (
            <article className="skillGroup" key={group.title}>
              <h3>{group.title}</h3>
              <div className="skillsGrid">
                {group.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section educationSection" aria-labelledby="education-title">
        <div className="contentGrid twoColumn">
          <div>
            <p className="sectionKicker">Education</p>
            <h2 id="education-title">Computer Science & AI foundation.</h2>
          </div>
          <div className="educationCard">
            <h3>Bachelor of Science in Computer Science & AI</h3>
            <p>Benha University, 2019 - 2023</p>
            <p>GPA: 3.4/4.0. Graduation Project: A+.</p>
            <p>
              Relevant coursework includes Data Structures & Algorithms, System
              Design, Distributed Systems, and Cloud Computing.
            </p>
          </div>
        </div>
      </section>

      <section className="contactSection" id="contact" aria-labelledby="contact-title">
        <div className="contactInner">
          <div>
            <p className="sectionKicker">Contact</p>
            <h2 id="contact-title">Let us build reliable backend systems.</h2>
          </div>
          <div>
            <p>
              Reach Ahmed Salman for backend engineering, microservices,
              distributed systems, cloud platforms, and technical delivery.
            </p>
            <div className="contactActions">
              <a href="mailto:ahmedsapry486@gmail.com">Email Ahmed</a>
              <a href="tel:+201006419351">Call</a>
              <a href="https://github.com/ahmedsalman74" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/ahmed-salman74" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
