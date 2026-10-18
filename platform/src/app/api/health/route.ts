import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Проверка живости приложения и соединения с БД. */
export async function GET() {
  let database: "up" | "down" = "up";
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
  } catch {
    database = "down";
  }
  return NextResponse.json(
    { status: database === "up" ? "ok" : "degraded", database },
    { status: database === "up" ? 200 : 503 },
  );
}
