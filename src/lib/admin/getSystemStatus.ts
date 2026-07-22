import { prisma } from "@/lib/prisma";

export type SystemState = "ok" | "degraded" | "down";

export interface SystemStatusRow {
  name: string;
  detail: string;
  state: SystemState;
}

export interface SystemStatus {
  allOperational: boolean;
  rows: SystemStatusRow[];
}

async function checkDatabase(): Promise<SystemStatusRow> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    return {
      name: "Base de datos",
      detail: `PostgreSQL · latencia ${latencyMs} ms`,
      state: "ok",
    };
  } catch {
    return {
      name: "Base de datos",
      detail: "No se pudo conectar",
      state: "down",
    };
  }
}

function checkDeployment(): SystemStatusRow {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  const env = process.env.VERCEL_ENV ?? "desarrollo";
  return {
    name: "Despliegue de la app",
    detail: sha ? `${env} · commit ${sha.slice(0, 7)}` : env,
    state: "ok",
  };
}

// no external WhatsApp Business API in v1 — links are built locally (ADR-0003), so this
// step has no network dependency that could fail at runtime
function checkWhatsAppLinkGeneration(): SystemStatusRow {
  return {
    name: "Envío de WhatsApp (enlaces)",
    detail: "Generación de enlaces wa.me",
    state: "ok",
  };
}

// no scheduled-job infrastructure exists yet in this MVP (ADR-0012) — surfaced here so the
// row set matches docs/flows/admin.md §5 rather than silently omitting it
function checkScheduledJobs(): SystemStatusRow {
  return {
    name: "Trabajos programados",
    detail: "Sin trabajos configurados en v1",
    state: "ok",
  };
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const rows = [
    await checkDatabase(),
    checkDeployment(),
    checkWhatsAppLinkGeneration(),
    checkScheduledJobs(),
  ];

  return {
    allOperational: rows.every((row) => row.state === "ok"),
    rows,
  };
}
