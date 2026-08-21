import type { Metadata } from "next";
import {
  education,
  experience,
  profile,
  projects,
  skillGroups,
} from "../profile-data";

export const metadata: Metadata = {
  title: "Ahmed Salman CV | Backend Software Engineer",
  description:
    "Full CV preview for Ahmed Salman, mid-senior backend software engineer.",
};

export default function CvPage() {
  return (
    <main className="cvPage">
      <header className="cvHeader">
        <a className="backLink" href="/">
          Back to portfolio
        </a>
        <div className="cvHero">
          <p className="kicker">CV Preview</p>
          <h1>{profile.name}</h1>
          <p>{profile.role}</p>
          <div className="cvContact">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={`tel:${profile.phone.replaceAll(" ", "")}`}>{profile.phone}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </header>

      <section className="cvSection">
        <h2>Summary</h2>
        <p>{profile.summary}</p>
      </section>

      <section className="cvSection">
        <h2>Experience</h2>
        <div className="cvTimeline">
          {experience.map((item) => (
            <article key={`${item.company}-${item.period}`}>
              <div>
                <h3>{item.role}</h3>
                <p>
                  {item.company} - {item.location}
                </p>
              </div>
              <span>{item.period}</span>
              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="cvSection">
        <h2>Projects</h2>
        <div className="cvCards">
          {projects.map((project) => (
            <article key={project.title}>
              <span>{project.type}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cvSection">
        <h2>Technical Skills</h2>
        <div className="cvSkillGrid">
          {skillGroups.map((group) => (
            <article key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.skills.join(", ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cvSection">
        <h2>Education</h2>
        <article className="cvEducation">
          <h3>{education.degree}</h3>
          <p>
            {education.school} - {education.period}
          </p>
          <p>
            {education.gpa}. {education.project}.
          </p>
          <p>Relevant coursework: {education.coursework.join(", ")}.</p>
        </article>
      </section>
    </main>
  );
}
