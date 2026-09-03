import ContactForm from "./ContactForm";
import { getPortfolioContent } from "./lib/content-store";
import { absoluteUrl, allProfileAliases, seoProfile, SITE_URL } from "./seo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPortfolioContent();
  const {
    profile,
    hero,
    stats,
    trusted,
    projects,
    services,
    process,
    focusAreas,
    experience,
  } = content;
  const homeJsonLd = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: SITE_URL,
        name: "Ahmed Salman Portfolio",
        description: seoProfile.description,
        publisher: {
          "@id": absoluteUrl("/#ahmed-salman"),
        },
      },
      {
        "@type": "Person",
        "@id": absoluteUrl("/#ahmed-salman"),
        name: profile.name,
        alternateName: allProfileAliases,
        jobTitle: seoProfile.role,
        url: SITE_URL,
        sameAs: [profile.github, profile.linkedin, absoluteUrl("/links")],
        email: profile.email,
        description: seoProfile.description,
        knowsAbout: seoProfile.knowsAbout,
      },
    ],
  });

  return (
    <main className="siteShell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homeJsonLd }}
      />
      <section className="heroSurface" id="top" aria-labelledby="hero-title">
        <div className="ambient ambientOne" />
        <div className="ambient ambientTwo" />

        <header className="navPill" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label={`${profile.name} home`}>
            {profile.name.toUpperCase()}
          </a>
          <nav>
            <a href="#projects">Projects</a>
            <a href="#services">Services</a>
            <a href="/cv">My CV</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="navCta" href={`mailto:${profile.email}`}>
            Book a call
          </a>
        </header>

        <div className="heroGrid">
          <div className="heroCopy reveal">
            <p className="kicker">{hero.kicker}</p>
            <h1 id="hero-title">
              {hero.title} <span>{hero.highlight}</span>
            </h1>
            <p>{hero.lead}</p>
            <div className="heroActions">
              <a className="buttonPrimary" href={`mailto:${profile.email}`}>
                Let us connect
              </a>
              <a className="buttonSecondary" href="/cv">
                My CV
              </a>
            </div>
          </div>

          <div
            className="heroVisual reveal"
            aria-label={`${profile.name} engineering summary`}
          >
            <div className="orbitRing" />
            <div className="portraitCard">
              <div className="avatarMark">AS</div>
              <p>Backend Engineer</p>
              <span>Node.js / TypeScript / Cloud</span>
            </div>
            {stats.map((stat, index) => (
              <div className={`floatStat stat${index + 1}`} key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="trustedStrip reveal"
          aria-label="Experience across companies and products"
        >
          <span>Experience across</span>
          {trusted.map((item) => (
            <strong key={item}>{item}</strong>
          ))}
        </div>
      </section>

      <section className="section" id="projects" aria-labelledby="projects-title">
        <div className="sectionIntro reveal">
          <p className="kicker">Recent Projects</p>
          <h2 id="projects-title">Production systems with measurable impact.</h2>
          <p>
            A focused selection from marketplace, booking, realtime, and cloud
            microservice work.
          </p>
        </div>
        <div className="projectGrid">
          {projects.map((project) => (
            <article className="projectCard reveal" key={project.title}>
              <div className="projectPreview">
                <span>{project.type}</span>
                <strong>{project.title}</strong>
              </div>
              <div className="glassInfo">
                <span>{project.type}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tagRow">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="services" aria-labelledby="services-title">
        <div className="sectionIntro reveal">
          <p className="kicker">Services</p>
          <h2 id="services-title">Backend engineering from architecture to launch.</h2>
          <p>
            Practical, production-minded support for teams that need their
            software to stay fast, clear, and reliable.
          </p>
        </div>
        <div className="serviceGrid">
          {services.map((service) => (
            <article className="serviceCard reveal" key={service.title}>
              <div className="serviceIcon" aria-hidden="true">
                <span />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="statBand reveal" aria-label="Portfolio metrics">
        {stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section" aria-labelledby="process-title">
        <div className="sectionIntro reveal">
          <p className="kicker">Process</p>
          <h2 id="process-title">A clear workflow for complex backend work.</h2>
          <p>
            From early system decisions to production support, every step is
            designed to reduce ambiguity and keep delivery moving.
          </p>
        </div>
        <div className="processGrid">
          {process.map((item) => (
            <article className="processCard reveal" key={item.step}>
              <strong>{item.step}</strong>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section aboutPanel" id="about" aria-labelledby="about-title">
        <div className="sectionIntro reveal">
          <p className="kicker">About Me</p>
          <h2 id="about-title">Clean backend thinking, shipped into real products.</h2>
          <p>{profile.summary}</p>
        </div>
        <div className="aboutGrid">
          <aside className="profileCard reveal">
            <div className="profileImage">
              <span>AS</span>
            </div>
            <div className="availability">
              <span />
              Available for backend roles
            </div>
            <h3>{profile.name}</h3>
            <p>{profile.role}</p>
            <div className="socialRow">
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                in
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                gh
              </a>
              <a href={`mailto:${profile.email}`}>@</a>
            </div>
          </aside>

          <div className="aboutStack">
            <article className="glassPanel reveal">
              <h3>What I do</h3>
              <p>
                I specialize in Node.js, TypeScript, Nest.js, gRPC,
                event-driven architecture, database optimization, caching,
                search, and cloud deployment for production backend systems.
              </p>
            </article>
            <article className="glassPanel reveal">
              <h3>Tech Stack</h3>
              <div className="skillCloud">
                {focusAreas.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
            <article className="glassPanel reveal">
              <h3>Experience</h3>
              <div className="timelineList">
                {experience.map((item) => (
                  <div key={`${item.company}-${item.period}`}>
                    <span>{item.role}</span>
                    <strong>{item.company}</strong>
                    <em>{item.period}</em>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="ctaPanel reveal" id="contact" aria-labelledby="contact-title">
        <div>
          <p className="kicker">Contact</p>
          <h2 id="contact-title">
            Your backend platform deserves engineering that holds up.
          </h2>
          <p>
            Reach me for backend engineering, microservices, API platforms,
            cloud systems, and performance-focused delivery.
          </p>
        </div>
        <div className="ctaActions">
          <a className="buttonPrimary" href={`mailto:${profile.email}`}>
            Book a call
          </a>
          <a className="buttonSecondary" href="/cv">
            Preview CV
          </a>
        </div>
        <ContactForm />
      </section>

      <footer className="footer">
        <strong>{profile.name}</strong>
        <nav aria-label="Footer navigation">
          <a href="#top">Home</a>
          <a href="#projects">Projects</a>
          <a href="/cv">My CV</a>
          <a href={`mailto:${profile.email}`}>Contact</a>
        </nav>
        <p>(c) 2026 {profile.name}. Built for scalable backend work.</p>
      </footer>
    </main>
  );
}

function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
