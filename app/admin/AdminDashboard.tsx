"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import type { PortfolioContent } from "@/app/profile-data";

type Ticket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: number;
};

type Tab =
  | "content"
  | "projects"
  | "experience"
  | "skills"
  | "cv"
  | "tickets";

export default function AdminDashboard() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tab, setTab] = useState<Tab>("content");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void loadAll();
  }, []);

  const ticketCount = useMemo(
    () => tickets.filter((ticket) => ticket.status !== "closed").length,
    [tickets],
  );

  async function loadAll() {
    const [contentResponse, ticketResponse] = await Promise.all([
      fetch("/api/admin/content"),
      fetch("/api/admin/tickets"),
    ]);
    if (contentResponse.ok) {
      const payload = (await contentResponse.json()) as {
        content: PortfolioContent;
      };
      setContent(payload.content);
    }
    if (ticketResponse.ok) {
      const payload = (await ticketResponse.json()) as { tickets: Ticket[] };
      setTickets(payload.tickets);
    }
  }

  async function saveContent() {
    if (!content) return;
    setSaving(true);
    setStatus("");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    setStatus(response.ok ? "Saved. The public site now uses this content." : "Save failed.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  async function uploadCv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("");
    const form = new FormData();
    form.append("cv", file);
    const response = await fetch("/api/admin/cv", {
      method: "POST",
      body: form,
    });
    setUploading(false);
    setStatus(response.ok ? "CV PDF replaced." : "CV upload failed.");
    event.target.value = "";
  }

  async function updateTicket(id: string, ticketStatus: string) {
    await fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status: ticketStatus }),
    });
    await loadAll();
  }

  async function removeTicket(id: string) {
    await fetch("/api/admin/tickets", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadAll();
  }

  if (!content) {
    return (
      <section className="adminLoading">
        <p className="kicker">SaaS Admin</p>
        <h1>Loading dashboard...</h1>
      </section>
    );
  }

  return (
    <section className="adminShell">
      <header className="adminTopbar">
        <div>
          <p className="kicker">SaaS Admin</p>
          <h1>Portfolio Dashboard</h1>
          <p>Manage every public section, tickets, and your CV PDF.</p>
        </div>
        <div className="adminTopActions">
          <a className="buttonSecondary" href="/" target="_blank">
            View site
          </a>
          <a className="buttonSecondary" href="/cv" target="_blank">
            View CV
          </a>
          <button className="buttonSecondary" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <nav className="adminTabs" aria-label="Admin sections">
        <button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}>
          Content
        </button>
        <button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}>
          Projects
        </button>
        <button className={tab === "experience" ? "active" : ""} onClick={() => setTab("experience")}>
          Experience
        </button>
        <button className={tab === "skills" ? "active" : ""} onClick={() => setTab("skills")}>
          Skills
        </button>
        <button className={tab === "cv" ? "active" : ""} onClick={() => setTab("cv")}>
          CV PDF
        </button>
        <button className={tab === "tickets" ? "active" : ""} onClick={() => setTab("tickets")}>
          Tickets {ticketCount ? `(${ticketCount})` : ""}
        </button>
      </nav>

      {tab === "content" ? (
        <div className="adminGrid">
          <AdminPanel title="Profile">
            <Field label="Name" value={content.profile.name} onChange={(value) => setContent({ ...content, profile: { ...content.profile, name: value } })} />
            <Field label="Role" value={content.profile.role} onChange={(value) => setContent({ ...content, profile: { ...content.profile, role: value } })} />
            <Field label="Location" value={content.profile.location} onChange={(value) => setContent({ ...content, profile: { ...content.profile, location: value } })} />
            <Field label="Email" value={content.profile.email} onChange={(value) => setContent({ ...content, profile: { ...content.profile, email: value } })} />
            <Field label="Phone" value={content.profile.phone} onChange={(value) => setContent({ ...content, profile: { ...content.profile, phone: value } })} />
            <Field label="LinkedIn" value={content.profile.linkedin} onChange={(value) => setContent({ ...content, profile: { ...content.profile, linkedin: value } })} />
            <Field label="GitHub" value={content.profile.github} onChange={(value) => setContent({ ...content, profile: { ...content.profile, github: value } })} />
            <TextArea label="Summary" value={content.profile.summary} onChange={(value) => setContent({ ...content, profile: { ...content.profile, summary: value } })} />
          </AdminPanel>

          <AdminPanel title="Hero">
            <Field label="Kicker" value={content.hero.kicker} onChange={(value) => setContent({ ...content, hero: { ...content.hero, kicker: value } })} />
            <Field label="Title" value={content.hero.title} onChange={(value) => setContent({ ...content, hero: { ...content.hero, title: value } })} />
            <Field label="Highlighted line" value={content.hero.highlight} onChange={(value) => setContent({ ...content, hero: { ...content.hero, highlight: value } })} />
            <TextArea label="Lead" value={content.hero.lead} onChange={(value) => setContent({ ...content, hero: { ...content.hero, lead: value } })} />
            <TextArea label="Trusted companies, one per line" value={content.trusted.join("\n")} onChange={(value) => setContent({ ...content, trusted: toLines(value) })} />
            <TextArea label="Focus areas, one per line" value={content.focusAreas.join("\n")} onChange={(value) => setContent({ ...content, focusAreas: toLines(value) })} />
          </AdminPanel>

          <AdminPanel title="Stats">
            {content.stats.map((stat, index) => (
              <div className="repeatBlock" key={`${stat.label}-${index}`}>
                <Field label="Value" value={stat.value} onChange={(value) => updateStat(index, "value", value)} />
                <Field label="Label" value={stat.label} onChange={(value) => updateStat(index, "label", value)} />
                <button className="dangerButton" onClick={() => setContent({ ...content, stats: content.stats.filter((_, itemIndex) => itemIndex !== index) })}>
                  Remove stat
                </button>
              </div>
            ))}
            <button className="smallButton" onClick={() => setContent({ ...content, stats: [...content.stats, { value: "0+", label: "New metric" }] })}>
              Add stat
            </button>
          </AdminPanel>

          <AdminPanel title="Services & Process">
            {content.services.map((service, index) => (
              <div className="repeatBlock" key={`${service.title}-${index}`}>
                <Field label="Service title" value={service.title} onChange={(value) => updateService(index, "title", value)} />
                <TextArea label="Service description" value={service.description} onChange={(value) => updateService(index, "description", value)} />
                <button className="dangerButton" onClick={() => setContent({ ...content, services: content.services.filter((_, itemIndex) => itemIndex !== index) })}>
                  Remove service
                </button>
              </div>
            ))}
            <button className="smallButton" onClick={() => setContent({ ...content, services: [...content.services, { title: "New Service", description: "Describe this service." }] })}>
              Add service
            </button>
          </AdminPanel>
        </div>
      ) : null}

      {tab === "projects" ? (
        <AdminPanel title="Projects">
          {content.projects.map((project, index) => (
            <div className="repeatBlock" key={`${project.title}-${index}`}>
              <Field label="Title" value={project.title} onChange={(value) => updateProject(index, "title", value)} />
              <Field label="Type" value={project.type} onChange={(value) => updateProject(index, "type", value)} />
              <TextArea label="Description" value={project.description} onChange={(value) => updateProject(index, "description", value)} />
              <TextArea label="Tags, one per line" value={project.tags.join("\n")} onChange={(value) => updateProjectTags(index, value)} />
              <button className="dangerButton" onClick={() => setContent({ ...content, projects: content.projects.filter((_, itemIndex) => itemIndex !== index) })}>
                Remove project
              </button>
            </div>
          ))}
          <button className="smallButton" onClick={() => setContent({ ...content, projects: [...content.projects, { title: "New Project", type: "Project type", description: "Describe the project impact.", tags: ["Node.js"] }] })}>
            Add project
          </button>
        </AdminPanel>
      ) : null}

      {tab === "experience" ? (
        <AdminPanel title="Experience">
          {content.experience.map((item, index) => (
            <div className="repeatBlock" key={`${item.company}-${index}`}>
              <Field label="Role" value={item.role} onChange={(value) => updateExperience(index, "role", value)} />
              <Field label="Company" value={item.company} onChange={(value) => updateExperience(index, "company", value)} />
              <Field label="Location" value={item.location} onChange={(value) => updateExperience(index, "location", value)} />
              <Field label="Period" value={item.period} onChange={(value) => updateExperience(index, "period", value)} />
              <TextArea label="Bullets, one per line" value={item.bullets.join("\n")} onChange={(value) => updateExperienceBullets(index, value)} />
              <button className="dangerButton" onClick={() => setContent({ ...content, experience: content.experience.filter((_, itemIndex) => itemIndex !== index) })}>
                Remove experience
              </button>
            </div>
          ))}
          <button className="smallButton" onClick={() => setContent({ ...content, experience: [...content.experience, { role: "New Role", company: "Company", location: "Remote", period: "2026 - Present", bullets: ["Describe your impact."] }] })}>
            Add experience
          </button>
        </AdminPanel>
      ) : null}

      {tab === "skills" ? (
        <div className="adminGrid">
          <AdminPanel title="Skill Groups">
            {content.skillGroups.map((group, index) => (
              <div className="repeatBlock" key={`${group.title}-${index}`}>
                <Field label="Group title" value={group.title} onChange={(value) => updateSkillGroupTitle(index, value)} />
                <TextArea label="Skills, one per line" value={group.skills.join("\n")} onChange={(value) => updateSkillGroupSkills(index, value)} />
                <button className="dangerButton" onClick={() => setContent({ ...content, skillGroups: content.skillGroups.filter((_, itemIndex) => itemIndex !== index) })}>
                  Remove group
                </button>
              </div>
            ))}
            <button className="smallButton" onClick={() => setContent({ ...content, skillGroups: [...content.skillGroups, { title: "New Group", skills: ["Skill"] }] })}>
              Add skill group
            </button>
          </AdminPanel>

          <AdminPanel title="Education & Process">
            <Field label="Degree" value={content.education.degree} onChange={(value) => setContent({ ...content, education: { ...content.education, degree: value } })} />
            <Field label="School" value={content.education.school} onChange={(value) => setContent({ ...content, education: { ...content.education, school: value } })} />
            <Field label="Period" value={content.education.period} onChange={(value) => setContent({ ...content, education: { ...content.education, period: value } })} />
            <Field label="GPA" value={content.education.gpa} onChange={(value) => setContent({ ...content, education: { ...content.education, gpa: value } })} />
            <Field label="Project" value={content.education.project} onChange={(value) => setContent({ ...content, education: { ...content.education, project: value } })} />
            <TextArea label="Coursework, one per line" value={content.education.coursework.join("\n")} onChange={(value) => setContent({ ...content, education: { ...content.education, coursework: toLines(value) } })} />
            {content.process.map((step, index) => (
              <div className="repeatBlock" key={`${step.step}-${index}`}>
                <Field label="Process number" value={step.step} onChange={(value) => updateProcess(index, "step", value)} />
                <Field label="Process title" value={step.title} onChange={(value) => updateProcess(index, "title", value)} />
                <TextArea label="Process text" value={step.text} onChange={(value) => updateProcess(index, "text", value)} />
              </div>
            ))}
          </AdminPanel>
        </div>
      ) : null}

      {tab === "cv" ? (
        <AdminPanel title="CV PDF">
          <p className="adminNote">
            Upload a PDF to replace the CV shown at <a href="/cv" target="_blank">/cv</a>.
          </p>
          <input className="fileInput" type="file" accept="application/pdf,.pdf" onChange={uploadCv} disabled={uploading} />
          <p className="adminNote">{uploading ? "Uploading PDF..." : "Current fallback PDF is bundled with the site."}</p>
        </AdminPanel>
      ) : null}

      {tab === "tickets" ? (
        <AdminPanel title="Tickets">
          {tickets.length ? (
            <div className="ticketList">
              {tickets.map((ticket) => (
                <article key={ticket.id}>
                  <div>
                    <h3>{ticket.subject}</h3>
                    <p>{ticket.message}</p>
                    <span>{ticket.name} - {ticket.email}</span>
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="ticketActions">
                    <select value={ticket.status} onChange={(event) => updateTicket(ticket.id, event.target.value)}>
                      <option value="new">New</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button className="dangerButton" onClick={() => removeTicket(ticket.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="adminNote">No tickets yet.</p>
          )}
        </AdminPanel>
      ) : null}

      <div className="adminSaveBar">
        <span>{status}</span>
        <button className="buttonPrimary" disabled={saving} onClick={saveContent}>
          {saving ? "Saving..." : "Save site content"}
        </button>
      </div>
    </section>
  );

  function updateStat(index: number, key: "value" | "label", value: string) {
    setContent({
      ...content,
      stats: content.stats.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    });
  }

  function updateService(index: number, key: "title" | "description", value: string) {
    setContent({
      ...content,
      services: content.services.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    });
  }

  function updateProject(index: number, key: "title" | "type" | "description", value: string) {
    setContent({
      ...content,
      projects: content.projects.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    });
  }

  function updateProjectTags(index: number, value: string) {
    setContent({
      ...content,
      projects: content.projects.map((item, itemIndex) =>
        itemIndex === index ? { ...item, tags: toLines(value) } : item,
      ),
    });
  }

  function updateExperience(index: number, key: "company" | "location" | "role" | "period", value: string) {
    setContent({
      ...content,
      experience: content.experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    });
  }

  function updateExperienceBullets(index: number, value: string) {
    setContent({
      ...content,
      experience: content.experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, bullets: toLines(value) } : item,
      ),
    });
  }

  function updateSkillGroupTitle(index: number, value: string) {
    setContent({
      ...content,
      skillGroups: content.skillGroups.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title: value } : item,
      ),
    });
  }

  function updateSkillGroupSkills(index: number, value: string) {
    setContent({
      ...content,
      skillGroups: content.skillGroups.map((item, itemIndex) =>
        itemIndex === index ? { ...item, skills: toLines(value) } : item,
      ),
    });
  }

  function updateProcess(index: number, key: "step" | "title" | "text", value: string) {
    setContent({
      ...content,
      process: content.process.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    });
  }
}

function AdminPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="adminPanel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="adminField">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="adminField">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function toLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
