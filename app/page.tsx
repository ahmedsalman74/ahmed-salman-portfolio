const strengths = [
  "System design",
  "Full-stack delivery",
  "Cloud-ready architecture",
  "API platforms",
  "Performance tuning",
  "Team leadership",
];

const metrics = [
  { value: "Senior", label: "software engineer" },
  { value: "Full-stack", label: "product delivery" },
  { value: "Cloud", label: "architecture mindset" },
  { value: "Clean", label: "engineering standards" },
];

const projects = [
  {
    title: "Product Engineering Platforms",
    type: "Architecture",
    description:
      "Designing dependable application foundations with clear service boundaries, practical observability, and maintainable delivery workflows.",
    tags: ["Architecture", "APIs", "Reliability"],
  },
  {
    title: "Modern Web Experiences",
    type: "Frontend",
    description:
      "Building fast, polished interfaces that keep complex product workflows readable, responsive, and accessible across devices.",
    tags: ["React", "TypeScript", "UX"],
  },
  {
    title: "Backend Systems And Integrations",
    type: "Backend",
    description:
      "Shipping secure backend services, integrations, and data flows that support real product usage without unnecessary complexity.",
    tags: ["Services", "Databases", "Security"],
  },
];

const experience = [
  {
    title: "Senior Software Engineer",
    text:
      "Owns complex features from planning through release, balances product speed with engineering quality, and keeps systems easy to reason about.",
  },
  {
    title: "Technical Delivery",
    text:
      "Turns ambiguous requirements into scoped implementation plans, reviews tradeoffs clearly, and supports teammates through code review and architecture decisions.",
  },
  {
    title: "Product Mindset",
    text:
      "Focuses on business value, user workflows, reliability, and maintainability instead of building technology for its own sake.",
  },
];

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "REST APIs",
  "SQL",
  "Cloud platforms",
  "CI/CD",
  "Testing",
  "System design",
  "Code review",
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
          <p className="eyebrow">Senior Software Engineer</p>
          <h1 id="hero-title">Ahmed Salman</h1>
          <p className="heroLead">
            I build reliable software products, scalable web platforms, and
            engineering systems that stay clean as teams and requirements grow.
          </p>
          <div className="heroActions" aria-label="Primary actions">
            <a className="primaryAction" href="mailto:hello@ahmedsalman74.dev">
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
          <p>Available for senior engineering roles, product engineering, and technical leadership.</p>
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
            <h2 id="about-title">Engineering leadership with product taste.</h2>
          </div>
          <div className="bodyCopy">
            <p>
              I am a senior software engineer who works across frontend,
              backend, architecture, and delivery. My best work happens where
              product clarity, practical engineering, and maintainable systems
              meet.
            </p>
            <p>
              This portfolio is designed as a polished base for your public
              profile. Add your CV details and it can immediately reflect exact
              employers, dates, shipped projects, metrics, and contact channels.
            </p>
          </div>
        </div>
      </section>

      <section className="section workSection" id="work" aria-labelledby="work-title">
        <div className="sectionIntro">
          <p className="sectionKicker">Selected Work</p>
          <h2 id="work-title">The kind of software I build.</h2>
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
            <h2 id="experience-title">Built for senior-level delivery.</h2>
          </div>
          <div className="experienceList">
            {experience.map((item) => (
              <article className="experienceItem" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section skillsSection" id="skills" aria-labelledby="skills-title">
        <div className="sectionIntro compactIntro">
          <p className="sectionKicker">Toolbox</p>
          <h2 id="skills-title">Practical skills for modern teams.</h2>
        </div>
        <div className="skillsGrid" aria-label="Technical skills">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="contactSection" id="contact" aria-labelledby="contact-title">
        <div className="contactInner">
          <p className="sectionKicker">Contact</p>
          <h2 id="contact-title">Let us build something reliable.</h2>
          <p>
            Reach Ahmed Salman for senior software engineering, architecture,
            product engineering, and technical leadership opportunities.
          </p>
          <div className="contactActions">
            <a href="mailto:hello@ahmedsalman74.dev">Email Ahmed</a>
            <a href="https://github.com/ahmedsalman74" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/ahmedsalman74" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
