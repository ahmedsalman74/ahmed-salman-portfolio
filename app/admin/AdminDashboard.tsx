"use client";

import { ChangeEvent, useEffect, useMemo, useState, type CSSProperties } from "react";
import PlatformIcon from "@/app/PlatformIcon";
import {
  buildPlatformHref,
  getLinkPlatform,
  inferPlatformId,
  LINK_PLATFORM_CATEGORIES,
  LINK_PLATFORMS,
} from "@/app/link-platforms";
import type { PortfolioContent } from "@/app/profile-data";
import { absoluteUrl } from "@/app/seo";

type Ticket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: number;
};

type AskQuestion = {
  id: string;
  question: string;
  answer: string;
  status: string;
  showOnAsk: boolean;
  showOnProfile: boolean;
  createdAt: number;
  updatedAt: number;
  answeredAt: number | null;
};

type Tab =
  | "content"
  | "projects"
  | "experience"
  | "skills"
  | "links"
  | "ask"
  | "cv"
  | "tickets";

export default function AdminDashboard() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [questions, setQuestions] = useState<AskQuestion[]>([]);
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
  const questionCount = useMemo(
    () => questions.filter((question) => question.status === "new").length,
    [questions],
  );

  async function loadAll() {
    const [contentResponse, ticketResponse, askResponse] = await Promise.all([
      fetch("/api/admin/content"),
      fetch("/api/admin/tickets"),
      fetch("/api/admin/ask"),
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
    if (askResponse.ok) {
      const payload = (await askResponse.json()) as { questions: AskQuestion[] };
      setQuestions(payload.questions);
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

  async function saveQuestion(question: AskQuestion) {
    const response = await fetch("/api/admin/ask", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(question),
    });
    setStatus(response.ok ? "Question reply saved." : "Question update failed.");
    if (response.ok) {
      const payload = (await response.json()) as { questions: AskQuestion[] };
      setQuestions(payload.questions);
    }
  }

  async function removeQuestion(id: string) {
    const response = await fetch("/api/admin/ask", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setStatus(response.ok ? "Question deleted." : "Question delete failed.");
    if (response.ok) {
      const payload = (await response.json()) as { questions: AskQuestion[] };
      setQuestions(payload.questions);
    }
  }

  function updateQuestionFields(id: string, patch: Partial<AskQuestion>) {
    setQuestions((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
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
          <a className="buttonSecondary" href="/links" target="_blank">
            View links
          </a>
          <a className="buttonSecondary" href="/ask" target="_blank">
            View ask
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
        <button className={tab === "links" ? "active" : ""} onClick={() => setTab("links")}>
          Links
        </button>
        <button className={tab === "ask" ? "active" : ""} onClick={() => setTab("ask")}>
          Ask {questionCount ? `(${questionCount})` : ""}
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

      {tab === "links" ? (
        <div className="adminGrid">
          <AdminPanel title="Links Profile">
            <Checkbox label="Enable links page" checked={content.linkPage.enabled} onChange={(value) => updateLinkPage("enabled", value)} />
            <Field label="Handle" value={content.linkPage.handle} onChange={(value) => updateLinkPage("handle", value)} />
            <Field label="Headline" value={content.linkPage.headline} onChange={(value) => updateLinkPage("headline", value)} />
            <TextArea label="Intro text (leave empty to hide)" value={content.linkPage.bio} onChange={(value) => updateLinkPage("bio", value)} />
            <TextArea label="Highlighted title (leave empty to hide)" value={content.linkPage.highlightText} onChange={(value) => updateLinkPage("highlightText", value)} />
            <Field label="Avatar initials" value={content.linkPage.avatarText} onChange={(value) => updateLinkPage("avatarText", value)} />
            <Field label="Avatar image URL" value={content.linkPage.avatarImage} onChange={(value) => updateLinkPage("avatarImage", value)} />
            <Field label="Status text" value={content.linkPage.status} onChange={(value) => updateLinkPage("status", value)} />
            <Field label="Location" value={content.linkPage.location} onChange={(value) => updateLinkPage("location", value)} />
            <Checkbox label="Show verified badge" checked={content.linkPage.showVerifiedBadge} onChange={(value) => updateLinkPage("showVerifiedBadge", value)} />
            <Checkbox label="Show share button" checked={content.linkPage.showShareButton} onChange={(value) => updateLinkPage("showShareButton", value)} />
          </AdminPanel>

          <AdminPanel title="Links Appearance">
            <Select label="Theme" value={content.linkPage.theme} options={["midnight", "aurora", "minimal", "carbon"]} onChange={(value) => updateLinkPage("theme", value)} />
            <Select label="Layout" value={content.linkPage.layout} options={["stack", "cards"]} onChange={(value) => updateLinkPage("layout", value)} />
            <Field label="Accent color" value={content.linkPage.accent} onChange={(value) => updateLinkPage("accent", value)} />
            <Field label="Background color" value={content.linkPage.background} onChange={(value) => updateLinkPage("background", value)} />
            <p className="adminNote">
              Use hex colors like #37e0ff. The links profile stays available only by its direct URL.
            </p>
          </AdminPanel>

          <AdminPanel title="Social Icons">
            {content.linkPage.socials.map((social, index) => {
              const platformId = inferPlatformId(social);
              const platform = getLinkPlatform(platformId);

              return (
                <div className="repeatBlock" key={`${social.label}-${index}`}>
                  <div className="adminInlineActions">
                    <Checkbox label="Enabled" checked={social.enabled} onChange={(value) => updateSocial(index, "enabled", value)} />
                    <PlatformPreview platformId={platformId} fallback={social.icon} />
                  </div>
                  <PlatformSelect label="Platform" value={platformId} onChange={(value) => updateSocialPlatform(index, value)} />
                  <Field label="Label shown to visitors" value={social.label} onChange={(value) => updateSocial(index, "label", value)} />
                  <Field
                    label="Username or full URL"
                    value={social.username || social.url}
                    placeholder={platform.placeholder}
                    onChange={(value) => updateSocialDestination(index, value)}
                  />
                  <p className="adminNote compactNote">
                    Generated link: {social.url || "Add a username or URL"}
                  </p>
                  <button className="dangerButton" onClick={() => setContent({ ...content, linkPage: { ...content.linkPage, socials: content.linkPage.socials.filter((_, itemIndex) => itemIndex !== index) } })}>
                    Remove social
                  </button>
                </div>
              );
            })}
            <button className="smallButton" onClick={addSocial}>
              Add social
            </button>
          </AdminPanel>

          <AdminPanel title="Profile Links">
            {content.linkPage.links.map((link, index) => {
              const platformId = inferPlatformId(link);
              const platform = getLinkPlatform(platformId);

              return (
                <div className="repeatBlock" key={`${link.title}-${index}`}>
                  <div className="adminInlineActions">
                    <Checkbox label="Enabled" checked={link.enabled} onChange={(value) => updateLink(index, "enabled", value)} />
                    <Checkbox label="Featured" checked={link.featured} onChange={(value) => updateLink(index, "featured", value)} />
                    <PlatformPreview platformId={platformId} fallback={link.icon} />
                  </div>
                  <PlatformSelect label="Platform" value={platformId} onChange={(value) => updateLinkPlatform(index, value)} />
                  <Field label="Label / button text" value={link.title} onChange={(value) => updateLink(index, "title", value)} />
                  <Field
                    label="Username or full URL"
                    value={link.username || link.url}
                    placeholder={platform.placeholder}
                    onChange={(value) => updateLinkDestination(index, value)}
                  />
                  <Field label="Category" value={link.category} onChange={(value) => updateLink(index, "category", value)} />
                  <TextArea label="Description" value={link.description} onChange={(value) => updateLink(index, "description", value)} />
                  <p className="adminNote compactNote">
                    Generated link: {link.url || "Add a username or URL"}
                  </p>
                  <div className="adminInlineActions">
                    <button className="smallButton" disabled={index === 0} onClick={() => moveLink(index, -1)}>
                      Move up
                    </button>
                    <button className="smallButton" disabled={index === content.linkPage.links.length - 1} onClick={() => moveLink(index, 1)}>
                      Move down
                    </button>
                    <button className="dangerButton" onClick={() => setContent({ ...content, linkPage: { ...content.linkPage, links: content.linkPage.links.filter((_, itemIndex) => itemIndex !== index) } })}>
                      Remove link
                    </button>
                  </div>
                </div>
              );
            })}
            <button className="smallButton" onClick={addProfileLink}>
              Add link
            </button>
          </AdminPanel>
        </div>
      ) : null}

      {tab === "ask" ? (
        <AdminPanel title="Anonymous Questions">
          <p className="adminNote">
            Reply privately until you choose where the answer appears. Published answers can show on /ask, and selected answers can also appear on the links profile.
          </p>
          {questions.length ? (
            <div className="askAdminList">
              {questions.map((question) => {
                const shareUrl = absoluteUrl(`/ask/${question.id}`);
                const canShare = question.status === "answered" && Boolean(question.answer.trim());

                return (
                  <article className="askAdminItem" key={question.id}>
                    <div className="askAdminQuestion">
                      <span>{question.status}</span>
                      <time dateTime={new Date(question.createdAt).toISOString()}>
                        {new Date(question.createdAt).toLocaleString()}
                      </time>
                      <p>{question.question}</p>
                    </div>
                    <TextArea
                      label="Reply"
                      value={question.answer}
                      onChange={(value) => updateQuestionFields(question.id, { answer: value })}
                    />
                    <div className="adminInlineActions askAdminControls">
                      <Select
                        label="Status"
                        value={question.status}
                        options={["new", "answered", "archived"]}
                        onChange={(value) => updateQuestionFields(question.id, { status: value })}
                      />
                      <Checkbox
                        label="Show on /ask"
                        checked={question.showOnAsk}
                        onChange={(value) => updateQuestionFields(question.id, { showOnAsk: value })}
                      />
                      <Checkbox
                        label="Feature on links profile"
                        checked={question.showOnProfile}
                        onChange={(value) => updateQuestionFields(question.id, { showOnProfile: value })}
                      />
                    </div>
                    {canShare ? (
                      <AdminQuestionShareActions
                        answer={question.answer}
                        question={question.question}
                        url={shareUrl}
                      />
                    ) : (
                      <p className="adminNote compactNote">
                        Add a reply and set the status to answered before sharing.
                      </p>
                    )}
                    <div className="adminInlineActions">
                      <button className="smallButton" onClick={() => saveQuestion(question)}>
                        Save reply
                      </button>
                      <button
                        className="smallButton"
                        onClick={() => saveQuestion({ ...question, status: "archived", showOnAsk: false, showOnProfile: false })}
                      >
                        Archive
                      </button>
                      <button className="dangerButton" onClick={() => removeQuestion(question.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="adminNote">No anonymous questions yet.</p>
          )}
        </AdminPanel>
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

  function updateLinkPage<K extends keyof PortfolioContent["linkPage"]>(
    key: K,
    value: PortfolioContent["linkPage"][K],
  ) {
    setContent({
      ...content,
      linkPage: {
        ...content.linkPage,
        [key]: value,
      },
    });
  }

  function updateSocial<K extends keyof PortfolioContent["linkPage"]["socials"][number]>(
    index: number,
    key: K,
    value: PortfolioContent["linkPage"]["socials"][number][K],
  ) {
    setContent({
      ...content,
      linkPage: {
        ...content.linkPage,
        socials: content.linkPage.socials.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    });
  }

  function updateSocialFields(
    index: number,
    patch: Partial<PortfolioContent["linkPage"]["socials"][number]>,
  ) {
    setContent({
      ...content,
      linkPage: {
        ...content.linkPage,
        socials: content.linkPage.socials.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      },
    });
  }

  function updateSocialPlatform(index: number, platformId: string) {
    const current = content.linkPage.socials[index];
    const oldPlatform = getLinkPlatform(inferPlatformId(current));
    const platform = getLinkPlatform(platformId);
    const username = current.username || "";

    updateSocialFields(index, {
      platform: platform.id,
      username,
      icon: platform.iconLabel,
      label: shouldReplaceLabel(current.label, oldPlatform.name, "New Social")
        ? platform.name
        : current.label,
      url: username ? buildPlatformHref(platform.id, username) : current.url,
    });
  }

  function updateSocialDestination(index: number, value: string) {
    const current = content.linkPage.socials[index];
    const platformId = inferPlatformId(current);
    updateSocialFields(index, {
      username: value,
      url: buildPlatformHref(platformId, value),
    });
  }

  function updateLink<K extends keyof PortfolioContent["linkPage"]["links"][number]>(
    index: number,
    key: K,
    value: PortfolioContent["linkPage"]["links"][number][K],
  ) {
    setContent({
      ...content,
      linkPage: {
        ...content.linkPage,
        links: content.linkPage.links.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    });
  }

  function updateLinkFields(
    index: number,
    patch: Partial<PortfolioContent["linkPage"]["links"][number]>,
  ) {
    setContent({
      ...content,
      linkPage: {
        ...content.linkPage,
        links: content.linkPage.links.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      },
    });
  }

  function updateLinkPlatform(index: number, platformId: string) {
    const current = content.linkPage.links[index];
    const oldPlatform = getLinkPlatform(inferPlatformId(current));
    const platform = getLinkPlatform(platformId);
    const username = current.username || "";

    updateLinkFields(index, {
      platform: platform.id,
      username,
      icon: platform.iconLabel,
      title: shouldReplaceLabel(current.title, oldPlatform.name, "New Link")
        ? platform.name
        : current.title,
      category: current.category || platform.category,
      url: username ? buildPlatformHref(platform.id, username) : current.url,
    });
  }

  function updateLinkDestination(index: number, value: string) {
    const current = content.linkPage.links[index];
    const platformId = inferPlatformId(current);
    updateLinkFields(index, {
      username: value,
      url: buildPlatformHref(platformId, value),
    });
  }

  function addSocial() {
    const platform = getLinkPlatform("x");
    setContent({
      ...content,
      linkPage: {
        ...content.linkPage,
        socials: [
          ...content.linkPage.socials,
          {
            label: platform.name,
            url: "",
            platform: platform.id,
            username: "",
            icon: platform.iconLabel,
            enabled: true,
          },
        ],
      },
    });
  }

  function addProfileLink() {
    const platform = getLinkPlatform("website");
    setContent({
      ...content,
      linkPage: {
        ...content.linkPage,
        links: [
          ...content.linkPage.links,
          {
            title: platform.name,
            url: "",
            platform: platform.id,
            username: "",
            description: "Describe this link.",
            category: platform.category,
            icon: platform.iconLabel,
            enabled: true,
            featured: false,
          },
        ],
      },
    });
  }

  function moveLink(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= content.linkPage.links.length) return;
    const links = [...content.linkPage.links];
    const [item] = links.splice(index, 1);
    links.splice(nextIndex, 0, item);
    setContent({
      ...content,
      linkPage: {
        ...content.linkPage,
        links,
      },
    });
  }

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

  function shouldReplaceLabel(value: string, oldPlatformName: string, emptyLabel: string) {
    return !value || value === emptyLabel || value === oldPlatformName || value === "Custom";
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
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="adminField">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
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

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="adminField">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PlatformSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = LINK_PLATFORMS.some((platform) => platform.id === value)
    ? value
    : "custom";

  return (
    <label className="adminField">
      {label}
      <select value={selected} onChange={(event) => onChange(event.target.value)}>
        {LINK_PLATFORM_CATEGORIES.map((category) => (
          <optgroup label={category} key={category}>
            {LINK_PLATFORMS.filter((platform) => platform.category === category).map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function PlatformPreview({
  platformId,
  fallback,
}: {
  platformId: string;
  fallback?: string;
}) {
  const platform = getLinkPlatform(platformId);
  const style = { "--platform-color": platform.brandColor } as CSSProperties;

  return (
    <span className="platformPreview">
      <span className="platformPreviewIcon" style={style}>
        <PlatformIcon platformId={platformId} fallback={fallback} />
      </span>
      <span>{platform.name}</span>
    </span>
  );
}

function AdminQuestionShareActions({
  question,
  answer,
  url,
}: {
  question: string;
  answer: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const storyText = `Anonymous question:\n${question}\n\nAhmed Salman:\n${answer}\n\n${url}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncateShareText(`${question}\n\n${answer}`, 230))}&url=${encodeURIComponent(url)}`;
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(storyText)}`;

  async function copyStoryText() {
    await navigator.clipboard?.writeText(storyText).catch(() => null);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareStory() {
    if (navigator.share) {
      await navigator.share({
        title: "Ahmed Salman answer",
        text: storyText,
        url,
      }).catch(() => null);
      return;
    }

    await copyStoryText();
  }

  return (
    <div className="askAdminShare">
      <a href={url} rel="noreferrer" target="_blank">
        Open card
      </a>
      <a href={xUrl} rel="noreferrer" target="_blank">
        X embed
      </a>
      <a href={whatsAppUrl} rel="noreferrer" target="_blank">
        WhatsApp
      </a>
      <button type="button" onClick={shareStory}>
        Story share
      </button>
      <button type="button" onClick={copyStoryText}>
        {copied ? "Copied" : "Copy story text"}
      </button>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="adminCheck">
      <input
        checked={checked}
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function toLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function truncateShareText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}
