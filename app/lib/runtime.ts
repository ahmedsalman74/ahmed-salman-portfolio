import { env } from "cloudflare:workers";

export type RuntimeEnv = {
  DB?: D1Database;
  CV_BUCKET?: R2Bucket;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_PASSWORD_SALT?: string;
  ADMIN_SESSION_SECRET?: string;
};

export function getRuntimeEnv(): RuntimeEnv {
  const runtime = env as unknown as RuntimeEnv;
  return {
    ...runtime,
    ADMIN_USERNAME: runtime.ADMIN_USERNAME ?? process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD_HASH:
      runtime.ADMIN_PASSWORD_HASH ?? process.env.ADMIN_PASSWORD_HASH,
    ADMIN_PASSWORD_SALT:
      runtime.ADMIN_PASSWORD_SALT ?? process.env.ADMIN_PASSWORD_SALT,
    ADMIN_SESSION_SECRET:
      runtime.ADMIN_SESSION_SECRET ?? process.env.ADMIN_SESSION_SECRET,
  };
}
