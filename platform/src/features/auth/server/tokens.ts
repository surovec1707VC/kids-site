import { createHash, randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";
import { getEnv } from "@/lib/env";

export interface AccessPayload {
  sub: string;
  role: Role;
}

const encoder = new TextEncoder();

/** Короткоживущий access-токен (по умолчанию 15 минут). */
export async function signAccessToken(payload: AccessPayload): Promise<string> {
  const env = getEnv();
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(env.JWT_ACCESS_TTL)
    .sign(encoder.encode(env.JWT_ACCESS_SECRET));
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(getEnv().JWT_ACCESS_SECRET));
    if (typeof payload.sub !== "string") return null;
    return { sub: payload.sub, role: payload.role as Role };
  } catch {
    return null;
  }
}

/**
 * Refresh-токен — случайная строка, а не JWT: так его можно отозвать.
 * В БД (RefreshToken.tokenHash) хранится только хеш.
 */
export function createRefreshToken(): { token: string; tokenHash: string; expiresAt: Date } {
  const token = randomBytes(48).toString("base64url");
  const days = getEnv().JWT_REFRESH_TTL_DAYS;
  return {
    token,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
  };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
