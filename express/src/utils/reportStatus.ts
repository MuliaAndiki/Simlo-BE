import { reportType } from "@prisma/client";

const VALID_STATUSES = new Set<string>(Object.values(reportType));

const STATUS_ALIASES: Record<string, reportType> = {
  pending: reportType.isPending,
  is_pending: reportType.isPending,
  inprogress: reportType.inProgress,
  in_progress: reportType.inProgress,
  progress: reportType.inProgress,
  done: reportType.done,
  completed: reportType.done,
  complete: reportType.done,
  rejected: reportType.rejected,
  reject: reportType.rejected,
};

export function parseReportStatus(value: unknown): reportType | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const trimmed = value.trim();

  if (VALID_STATUSES.has(trimmed)) {
    return trimmed as reportType;
  }

  return STATUS_ALIASES[trimmed.toLowerCase()] ?? null;
}

export function getReportStatusOptions(): reportType[] {
  return Object.values(reportType);
}
