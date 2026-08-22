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
      "CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at)",
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
