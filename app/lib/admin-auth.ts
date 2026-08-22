import { cookies, headers } from "next/headers";
import { getRuntimeEnv } from "./runtime";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const PASSWORD_ITERATIONS = 210000;

export async function verifyAdminCredentials(
  username: string,
  password: string,
) {
  const runtime = getRuntimeEnv();
  if (
    !runtime.ADMIN_USERNAME ||
    !runtime.ADMIN_PASSWORD_HASH ||
    !runtime.ADMIN_PASSWORD_SALT
  ) {
    return false;
  }

  if (username.trim() !== runtime.ADMIN_USERNAME) return false;

  const actual = await hashPassword(password, runtime.ADMIN_PASSWORD_SALT);
  return timingSafeEqual(actual, runtime.ADMIN_PASSWORD_HASH);
}

export async function createAdminSession(username: string) {
  const runtime = getRuntimeEnv();
  if (!runtime.ADMIN_SESSION_SECRET) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  const payload = base64UrlEncode(
    JSON.stringify({
      username,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
      nonce: crypto.randomUUID(),
    }),
  );
  const signature = await hmac(payload, runtime.ADMIN_SESSION_SECRET);
  return `${payload}.${signature}`;
}

export async function isAdminRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  return verifySession(readCookie(cookie, COOKIE_NAME));
}

export async function isAdminPageRequest() {
  const requestHeaders = await headers();
  return verifySession(readCookie(requestHeaders.get("cookie") ?? "", COOKIE_NAME));
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function adminCookieName() {
  return COOKIE_NAME;
}

export function adminCookieMaxAge() {
  return SESSION_TTL_SECONDS;
}

async function verifySession(token: string | null) {
  if (!token) return false;
  const runtime = getRuntimeEnv();
  if (!runtime.ADMIN_SESSION_SECRET) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await hmac(payload, runtime.ADMIN_SESSION_SECRET);
  if (!timingSafeEqual(signature, expected)) return false;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as {
      username?: string;
      exp?: number;
    };
    return (
      parsed.username === runtime.ADMIN_USERNAME &&
      typeof parsed.exp === "number" &&
      parsed.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export async function hashPassword(password: string, salt: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      iterations: PASSWORD_ITERATIONS,
      salt: encoder.encode(salt),
    },
    key,
    256,
  );
  return toHex(bits);
}

async function hmac(payload: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64UrlEncodeBytes(signature);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

function readCookie(header: string, name: string) {
  const prefix = `${name}=`;
  return (
    header
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix))
      ?.slice(prefix.length) ?? null
  );
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function base64UrlEncode(value: string) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlEncodeBytes(value: ArrayBuffer | Uint8Array) {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return atob(padded);
}
