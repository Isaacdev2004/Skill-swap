import { PAGINATION } from "@/config/constants";

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export function parsePagination(options: PaginationOptions = {}) {
  const page = Math.max(options.page ?? PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(options.limit ?? PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildSort(sortBy?: string, sortOrder?: "asc" | "desc") {
  const field = sortBy ?? "createdAt";
  const order = sortOrder === "asc" ? 1 : -1;
  return { [field]: order } as Record<string, 1 | -1>;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function isValidObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}

export function getRouteParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] ?? "" : value;
}

export function parseDurationToMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}
