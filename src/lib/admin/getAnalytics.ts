import { prisma } from "@/lib/prisma";

export interface AnalyticsStat {
  label: string;
  value: string;
  delta: string;
  tone: "positive" | "neutral";
}

export interface AnalyticsChartBar {
  label: string;
  value: number;
  highlighted: boolean;
}

export interface Analytics {
  stats: AnalyticsStat[];
  chart: AnalyticsChartBar[];
}

const MONTH_LABELS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
const CHART_MONTHS = 6;
const ATTENDANCE_WINDOW_DAYS = 30;

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-BO").format(value);
}

async function getPracticesOnboardedByMonth(
  now: Date,
): Promise<AnalyticsChartBar[]> {
  const rangeStart = startOfMonth(
    new Date(now.getFullYear(), now.getMonth() - (CHART_MONTHS - 1), 1),
  );
  const doctors = await prisma.doctor.findMany({
    where: { onboardedAt: { gte: rangeStart } },
    select: { onboardedAt: true },
  });

  const counts = new Map<string, number>();
  for (const { onboardedAt } of doctors) {
    if (!onboardedAt) continue;
    const key = `${onboardedAt.getFullYear()}-${onboardedAt.getMonth()}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const bars: AnalyticsChartBar[] = [];
  for (let i = CHART_MONTHS - 1; i >= 0; i -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
    bars.push({
      label: MONTH_LABELS[monthDate.getMonth()],
      value: counts.get(key) ?? 0,
      highlighted: i === 0,
    });
  }
  return bars;
}

export async function getAnalytics(): Promise<Analytics> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const attendanceWindowStart = new Date(
    now.getTime() - ATTENDANCE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );

  const [
    activePractices,
    practicesThisMonth,
    totalAppointments,
    appointmentsThisMonth,
    attendedRecent,
    noShowRecent,
    assistantCount,
    chart,
  ] = await Promise.all([
    prisma.doctor.count({ where: { user: { active: true } } }),
    prisma.doctor.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.appointment.count({
      where: { status: "ATTENDED", updatedAt: { gte: attendanceWindowStart } },
    }),
    prisma.appointment.count({
      where: { status: "NO_SHOW", updatedAt: { gte: attendanceWindowStart } },
    }),
    prisma.assistant.count(),
    getPracticesOnboardedByMonth(now),
  ]);

  const attendanceTotal = attendedRecent + noShowRecent;
  const attendanceRate =
    attendanceTotal === 0
      ? 0
      : Math.round((attendedRecent / attendanceTotal) * 100);

  return {
    stats: [
      {
        label: "Consultas activas",
        value: formatNumber(activePractices),
        delta: `+${practicesThisMonth} este mes`,
        tone: "positive",
      },
      {
        label: "Citas reservadas",
        value: formatNumber(totalAppointments),
        delta: `+${appointmentsThisMonth} este mes`,
        tone: "positive",
      },
      {
        label: "Tasa de asistencia",
        value: `${attendanceRate}%`,
        delta: "últimos 30 días",
        tone: "neutral",
      },
      {
        label: "Asistentes",
        value: formatNumber(assistantCount),
        delta: "en la plataforma",
        tone: "neutral",
      },
    ],
    chart,
  };
}
