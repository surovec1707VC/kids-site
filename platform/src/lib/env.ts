import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET: минимум 32 символа"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET: минимум 32 символа"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().int().positive().default(30),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

/** Переменные окружения проверяются при первом обращении, а не при сборке. */
export function getEnv(): Env {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.path.join(".") + ": " + i.message);
      throw new Error("Неверные переменные окружения:\n" + issues.join("\n"));
    }
    cached = parsed.data;
  }
  return cached;
}
