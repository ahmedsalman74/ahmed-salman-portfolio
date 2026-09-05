import {
  defaultPortfolioContent,
  type LinkPageItem,
  type LinkPageSocial,
  type PortfolioContent,
} from "../profile-data";
import { buildPlatformHref, getLinkPlatform, inferPlatformId } from "../link-platforms";
import { getRuntimeEnv } from "./runtime";

export type Ticket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: number;
  updatedAt: number;
};

export type AskQuestion = {
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

const CONTENT_ID = "main";
const CV_ID = "current";
export const CURRENT_CV_KEY = "cv/current.pdf";

let initialized = false;

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const db = getDb();
  await ensureDatabase();

  const row = await db
    .prepare("SELECT data FROM portfolio_content WHERE id = ?")
    .bind(CONTENT_ID)
    .first<{ data: string }>();

  if (!row?.data) return defaultPortfolioContent;

  try {
    return normalizeContent(JSON.parse(row.data));
  } catch {
    return defaultPortfolioContent;
  }
}

export async function savePortfolioContent(content: PortfolioContent) {
  const db = getDb();
  await ensureDatabase();
  const normalized = normalizeContent(content);
  await db
    .prepare(
      "UPDATE portfolio_content SET data = ?, updated_at = ? WHERE id = ?",
    )
    .bind(JSON.stringify(normalized), Date.now(), CONTENT_ID)
    .run();
  return normalized;
}

export async function createTicket(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const db = getDb();
  await ensureDatabase();
  const now = Date.now();
  const id = crypto.randomUUID();
  await db
    .prepare(
      "INSERT INTO tickets (id, name, email, subject, message, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      id,
      cleanText(input.name, 120),
      cleanText(input.email, 180),
      cleanText(input.subject, 180),
      cleanText(input.message, 3000),
      "new",
      now,
      now,
    )
    .run();
  return id;
}

export async function listTickets(): Promise<Ticket[]> {
  const db = getDb();
  await ensureDatabase();
  const result = await db
    .prepare(
      "SELECT id, name, email, subject, message, status, created_at AS createdAt, updated_at AS updatedAt FROM tickets ORDER BY created_at DESC",
    )
    .all<Ticket>();
  return result.results ?? [];
}

export async function updateTicketStatus(id: string, status: string) {
  const db = getDb();
  await ensureDatabase();
  const safeStatus = ["new", "reviewing", "closed"].includes(status)
    ? status
    : "new";
  await db
    .prepare("UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?")
    .bind(safeStatus, Date.now(), id)
    .run();
}

export async function deleteTicket(id: string) {
  const db = getDb();
  await ensureDatabase();
  await db.prepare("DELETE FROM tickets WHERE id = ?").bind(id).run();
}

export async function createAskQuestion(input: { question: string }) {
  const db = getDb();
  await ensureDatabase();
  const now = Date.now();
  const id = crypto.randomUUID();
  await db
    .prepare(
      "INSERT INTO ask_questions (id, question, answer, status, show_on_ask, show_on_profile, created_at, updated_at, answered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(id, cleanText(input.question, 1200), "", "new", 0, 0, now, now, null)
    .run();
  return id;
}

export async function listAskQuestions(): Promise<AskQuestion[]> {
  const db = getDb();
  await ensureDatabase();
  const result = await db
    .prepare(
      "SELECT id, question, answer, status, show_on_ask AS showOnAsk, show_on_profile AS showOnProfile, created_at AS createdAt, updated_at AS updatedAt, answered_at AS answeredAt FROM ask_questions ORDER BY created_at DESC",
    )
    .all<AskQuestionRow>();
  return (result.results ?? []).map(normalizeAskQuestion);
}

export async function listPublicAskQuestions(options?: {
  profileOnly?: boolean;
}): Promise<AskQuestion[]> {
  const db = getDb();
  await ensureDatabase();
  const visibleColumn = options?.profileOnly ? "show_on_profile" : "show_on_ask";
  const result = await db
    .prepare(
      `SELECT id, question, answer, status, show_on_ask AS showOnAsk, show_on_profile AS showOnProfile, created_at AS createdAt, updated_at AS updatedAt, answered_at AS answeredAt FROM ask_questions WHERE status = 'answered' AND answer != '' AND ${visibleColumn} = 1 ORDER BY answered_at DESC, updated_at DESC`,
    )
    .all<AskQuestionRow>();
  return (result.results ?? []).map(normalizeAskQuestion);
}

export async function getPublicAskQuestion(id: string): Promise<AskQuestion | null> {
  const db = getDb();
  await ensureDatabase();
  const row = await db
    .prepare(
      "SELECT id, question, answer, status, show_on_ask AS showOnAsk, show_on_profile AS showOnProfile, created_at AS createdAt, updated_at AS updatedAt, answered_at AS answeredAt FROM ask_questions WHERE id = ? AND status = 'answered' AND answer != '' AND (show_on_ask = 1 OR show_on_profile = 1)",
    )
    .bind(id)
    .first<AskQuestionRow>();
  return row ? normalizeAskQuestion(row) : null;
}

export async function updateAskQuestion(input: {
  id: string;
  answer: string;
  status: string;
  showOnAsk: boolean;
  showOnProfile: boolean;
}) {
  const db = getDb();
  await ensureDatabase();
  const answer = cleanText(input.answer, 5000);
  const requestedStatus = ["new", "answered", "archived"].includes(input.status)
    ? input.status
    : "new";
  const status = requestedStatus === "archived" ? "archived" : answer ? "answered" : "new";
  const existing = await db
    .prepare("SELECT answered_at AS answeredAt FROM ask_questions WHERE id = ?")
    .bind(input.id)
    .first<{ answeredAt: number | null }>();
  const answeredAt = status === "answered" ? existing?.answeredAt ?? Date.now() : null;
  const canPublish = status === "answered" && Boolean(answer);

  await db
    .prepare(
      "UPDATE ask_questions SET answer = ?, status = ?, show_on_ask = ?, show_on_profile = ?, updated_at = ?, answered_at = ? WHERE id = ?",
    )
    .bind(
      answer,
      status,
      canPublish && input.showOnAsk ? 1 : 0,
      canPublish && input.showOnProfile ? 1 : 0,
      Date.now(),
      answeredAt,
      input.id,
    )
    .run();
}

export async function deleteAskQuestion(id: string) {
  const db = getDb();
  await ensureDatabase();
  await db.batch([
    db.prepare("DELETE FROM ask_share_images WHERE id = ?").bind(id),
    db.prepare("DELETE FROM ask_questions WHERE id = ?").bind(id),
  ]);
}

export async function saveAskShareImage(id: string, revision: number, image: string) {
  const db = getDb();
  await ensureDatabase();
  const result = await db.prepare(
    "INSERT INTO ask_share_images (id, revision, image) SELECT id, updated_at, ? FROM ask_questions WHERE id = ? AND updated_at = ? AND status = 'answered' AND answer != '' ON CONFLICT(id) DO UPDATE SET revision = excluded.revision, image = excluded.image",
  ).bind(image, id, revision).run();
  return result.meta.changes > 0;
}

export async function getPublicAskShareImage(id: string) {
  const db = getDb();
  await ensureDatabase();
  return db.prepare(
    "SELECT i.image FROM ask_share_images i JOIN ask_questions q ON q.id = i.id AND q.updated_at = i.revision WHERE q.id = ? AND q.status = 'answered' AND q.answer != '' AND (q.show_on_ask = 1 OR q.show_on_profile = 1)",
  ).bind(id).first<{ image: string }>();
}

export async function saveCvMetadata(input: {
  filename: string;
  contentType: string;
  size: number;
}) {
  const db = getDb();
  await ensureDatabase();
  await db
    .prepare(
      "INSERT INTO cv_files (id, filename, content_type, size, object_key, uploaded_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET filename = excluded.filename, content_type = excluded.content_type, size = excluded.size, object_key = excluded.object_key, uploaded_at = excluded.uploaded_at",
    )
    .bind(
      CV_ID,
      cleanText(input.filename, 240),
      input.contentType,
      input.size,
      CURRENT_CV_KEY,
      Date.now(),
    )
    .run();
}

async function ensureDatabase() {
  if (initialized) return;
  const db = getDb();
  await db.batch([
    db.prepare(
      "CREATE TABLE IF NOT EXISTS portfolio_content (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL, updated_at INTEGER NOT NULL)",
    ),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, status TEXT DEFAULT 'new' NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)",
    ),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS cv_files (id TEXT PRIMARY KEY NOT NULL, filename TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL, object_key TEXT NOT NULL, uploaded_at INTEGER NOT NULL)",
    ),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS ask_questions (id TEXT PRIMARY KEY NOT NULL, question TEXT NOT NULL, answer TEXT DEFAULT '' NOT NULL, status TEXT DEFAULT 'new' NOT NULL, show_on_ask INTEGER DEFAULT 0 NOT NULL, show_on_profile INTEGER DEFAULT 0 NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, answered_at INTEGER)",
    ),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS ask_share_images (id TEXT PRIMARY KEY NOT NULL, revision INTEGER NOT NULL, image TEXT NOT NULL)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_ask_questions_created_at ON ask_questions(created_at)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_ask_questions_show_on_ask ON ask_questions(show_on_ask)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_ask_questions_show_on_profile ON ask_questions(show_on_profile)",
    ),
    db.prepare("PRAGMA optimize"),
  ]);

  await db
    .prepare(
      "INSERT OR IGNORE INTO portfolio_content (id, data, updated_at) VALUES (?, ?, ?)",
    )
    .bind(CONTENT_ID, JSON.stringify(defaultPortfolioContent), Date.now())
    .run();

  initialized = true;
}

function getDb(): D1Database {
  const db = getRuntimeEnv().DB;
  if (!db) {
    throw new Error("D1 binding DB is unavailable.");
  }
  return db;
}

function normalizeContent(value: unknown): PortfolioContent {
  const input = isRecord(value) ? value : {};
  return {
    ...defaultPortfolioContent,
    ...input,
    profile: {
      ...defaultPortfolioContent.profile,
      ...(isRecord(input.profile) ? input.profile : {}),
    },
    hero: {
      ...defaultPortfolioContent.hero,
      ...(isRecord(input.hero) ? input.hero : {}),
    },
    education: {
      ...defaultPortfolioContent.education,
      ...(isRecord(input.education) ? input.education : {}),
    },
    linkPage: {
      ...defaultPortfolioContent.linkPage,
      ...(isRecord(input.linkPage) ? input.linkPage : {}),
      socials: normalizeLinkPageSocials(
        isRecord(input.linkPage) ? input.linkPage.socials : undefined,
      ),
      links: normalizeLinkPageItems(
        isRecord(input.linkPage) ? input.linkPage.links : undefined,
      ),
    },
    stats: arrayOrDefault(input.stats, defaultPortfolioContent.stats),
    focusAreas: arrayOrDefault(
      input.focusAreas,
      defaultPortfolioContent.focusAreas,
    ),
    trusted: arrayOrDefault(input.trusted, defaultPortfolioContent.trusted),
    services: arrayOrDefault(input.services, defaultPortfolioContent.services),
    projects: arrayOrDefault(input.projects, defaultPortfolioContent.projects),
    experience: arrayOrDefault(
      input.experience,
      defaultPortfolioContent.experience,
    ),
    skillGroups: arrayOrDefault(
      input.skillGroups,
      defaultPortfolioContent.skillGroups,
    ),
    process: arrayOrDefault(input.process, defaultPortfolioContent.process),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function arrayOrDefault<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function normalizeLinkPageSocials(value: unknown): LinkPageSocial[] {
  if (!Array.isArray(value)) return defaultPortfolioContent.linkPage.socials;

  return value.map((item, index) => {
    const base =
      defaultPortfolioContent.linkPage.socials[index] ??
      ({
        label: "Custom",
        url: "",
        platform: "custom",
        username: "",
        icon: "LN",
        enabled: true,
      } satisfies LinkPageSocial);
    const input = isRecord(item) ? item : {};
    const platform = inferPlatformId({
      platform: readString(input.platform, base.platform),
      label: readString(input.label, base.label),
      icon: readString(input.icon, base.icon),
      url: readString(input.url, base.url),
    });
    const platformData = getLinkPlatform(platform);
    const username = readString(input.username, base.username);
    const url = readString(input.url, base.url) || buildPlatformHref(platform, username);

    return {
      label: readString(input.label, base.label || platformData.name),
      url,
      platform,
      username,
      icon: readString(input.icon, base.icon || platformData.iconLabel),
      enabled: readBoolean(input.enabled, base.enabled),
    };
  });
}

function normalizeLinkPageItems(value: unknown): LinkPageItem[] {
  if (!Array.isArray(value)) return defaultPortfolioContent.linkPage.links;

  return value.map((item, index) => {
    const base =
      defaultPortfolioContent.linkPage.links[index] ??
      ({
        title: "New Link",
        url: "",
        platform: "custom",
        username: "",
        description: "",
        category: "Links",
        icon: "LN",
        enabled: true,
        featured: false,
      } satisfies LinkPageItem);
    const input = isRecord(item) ? item : {};
    const platform = inferPlatformId({
      platform: readString(input.platform, base.platform),
      title: readString(input.title, base.title),
      icon: readString(input.icon, base.icon),
      url: readString(input.url, base.url),
    });
    const platformData = getLinkPlatform(platform);
    const username = readString(input.username, base.username);
    const url = readString(input.url, base.url) || buildPlatformHref(platform, username);

    return {
      title: readString(input.title, base.title || platformData.name),
      url,
      platform,
      username,
      description: readString(input.description, base.description),
      category: readString(input.category, base.category),
      icon: readString(input.icon, base.icon || platformData.iconLabel),
      enabled: readBoolean(input.enabled, base.enabled),
      featured: readBoolean(input.featured, base.featured),
    };
  });
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function cleanText(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

type AskQuestionRow = Omit<AskQuestion, "showOnAsk" | "showOnProfile"> & {
  showOnAsk: boolean | number;
  showOnProfile: boolean | number;
};

function normalizeAskQuestion(row: AskQuestionRow): AskQuestion {
  return {
    ...row,
    showOnAsk: Boolean(row.showOnAsk),
    showOnProfile: Boolean(row.showOnProfile),
    answeredAt: row.answeredAt ?? null,
  };
}
