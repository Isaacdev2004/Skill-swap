const BASE = import.meta.env.VITE_API_URL ?? "/api/v1";

const TOKEN_KEY = "skillswap_access_token";

let accessToken: string | null =
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

interface ApiEnvelope<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  statusCode?: number;
}

export function getAccessToken() {
  return accessToken;
}

export function getSocketUrl() {
  return BASE.replace(/\/api\/v\d+\/?$/, "");
}

function parseAvatar(avatarId?: string) {
  const value = String(avatarId ?? "indigo:U");
  const [color = "indigo", initials = "U"] = value.split(":");
  return { initials, avatarColor: `bg-${color}-500` };
}

export function mapUser(raw: Record<string, unknown>) {
  const { initials, avatarColor } = parseAvatar(String(raw.avatarId ?? ""));

  return {
    id: String(raw.id ?? raw._id ?? ""),
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    initials,
    avatarColor,
    bio: String(raw.bio ?? ""),
    languages: Array.isArray(raw.languages) ? raw.languages : ["English"],
    availability: raw.availability ?? { days: [], timeSlot: "" },
    skillsTeach: raw.skillsTeach ?? [],
    skillsLearn: raw.skillsLearn ?? [],
    badges: raw.badges ?? [],
    rating: Number(raw.rating ?? 0),
    reviewCount: Number(raw.reviewCount ?? 0),
    verified: Boolean(raw.verified),
    isAdmin: ["admin", "super_admin", "moderator"].includes(String(raw.role ?? "")),
    role: String(raw.role ?? "user"),
    status: String(raw.status ?? "active"),
    joinedAt: String(raw.createdAt ?? raw.joinedAt ?? new Date().toISOString()),
  };
}

export function mapMatch(raw: Record<string, unknown>) {
  const { initials, avatarColor } = parseAvatar(String(raw.avatarId ?? ""));
  const mutual = (raw.mutualSkills ?? {}) as {
    youTeachTheyLearn?: string[];
    theyTeachYouLearn?: string[];
  };

  return {
    id: String(raw.userId ?? raw.id ?? ""),
    compatibilityScore: Number(raw.matchPercentage ?? 0),
    user: {
      id: String(raw.userId ?? ""),
      name: String(raw.name ?? ""),
      email: "",
      initials,
      avatarColor,
      bio: "",
      rating: Number(raw.rating ?? 0),
      reviewCount: Number(raw.reviewCount ?? 0),
      verified: Boolean(raw.verified),
      isAdmin: false,
      languages: [],
      availability: { days: [], timeSlot: "" },
      skillsTeach: [],
      skillsLearn: [],
      badges: [],
      joinedAt: new Date().toISOString(),
    },
    theyWant: (mutual.youTeachTheyLearn ?? []).map((name, i) => ({
      id: `want-${i}`,
      name,
      category: "Technology" as const,
      level: "Intermediate" as const,
    })),
    theyTeach: (mutual.theyTeachYouLearn ?? []).map((name, i) => ({
      id: `teach-${i}`,
      name,
      category: "Technology" as const,
      level: "Intermediate" as const,
    })),
    mutualSkills: [
      ...(mutual.youTeachTheyLearn ?? []),
      ...(mutual.theyTeachYouLearn ?? []),
    ],
    status: "pending" as const,
  };
}

export function mapSession(raw: Record<string, unknown>, currentUserId?: string) {
  const host = raw.host as Record<string, unknown> | undefined;
  const participant = raw.participant as Record<string, unknown> | undefined;
  const withUserRaw =
    String(host?._id ?? host?.id) === currentUserId ? participant : host;
  const withUser = mapUser((withUserRaw ?? {}) as Record<string, unknown>);
  const scheduledAt = String(raw.scheduledAt ?? new Date().toISOString());

  return {
    id: String(raw._id ?? raw.id ?? ""),
    withUser,
    skill: {
      id: "session-skill",
      name: String(raw.title ?? "Skill session"),
      category: "Technology" as const,
      level: "Intermediate" as const,
    },
    date: scheduledAt,
    time: new Date(scheduledAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    duration: Number(raw.durationMinutes ?? 60),
    status: String(raw.status ?? "upcoming") as "upcoming" | "completed" | "cancelled",
  };
}

export function mapNotification(raw: Record<string, unknown>) {
  const typeMap: Record<string, string> = {
    new_match: "match",
    new_message: "message",
    session_reminder: "session",
    review_received: "review",
    swap_accepted: "request",
    swap_rejected: "request",
    admin: "request",
  };

  return {
    id: String(raw._id ?? raw.id ?? ""),
    type: typeMap[String(raw.type ?? "")] ?? "request",
    title: String(raw.title ?? ""),
    body: String(raw.message ?? ""),
    isRead: Boolean(raw.read),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  };
}

export function mapMarketplaceTeacher(items: Record<string, unknown>[]) {
  const grouped = new Map<string, ReturnType<typeof mapUser> & { skillsTeach: any[] }>();

  for (const item of items) {
    const teacher = item.teacher as Record<string, unknown>;
    const skill = item.skill as Record<string, unknown>;
    const teacherId = String(teacher?.id ?? teacher?._id ?? "");
    if (!teacherId) continue;

    if (!grouped.has(teacherId)) {
      grouped.set(teacherId, {
        ...mapUser(teacher),
        skillsTeach: [],
        skillsLearn: [],
      });
    }

    grouped.get(teacherId)!.skillsTeach.push({
      id: String(skill?.id ?? skill?._id ?? ""),
      name: String(skill?.name ?? ""),
      category: "Technology",
      level: String(item.level ?? "Intermediate"),
    });
  }

  return Array.from(grouped.values());
}

function saveAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function unwrap<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) ?? {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers,
    ...init,
  });

  const payload = await res.json().catch(() => ({ message: res.statusText }));

  if (!res.ok) {
    const message =
      (payload as ApiEnvelope)?.message ??
      (payload as { message?: string })?.message ??
      "Request failed";
    throw new ApiError(res.status, message);
  }

  return unwrap<T>(payload);
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });
const patch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body: JSON.stringify(body) });

export const api = {
  auth: {
    me: async () => {
      const data = await get<{ user: Record<string, unknown> }>("/auth/me");
      return { user: mapUser(data.user) };
    },
    login: async (body: { email: string; password: string }) => {
      const data = await post<{
        user: Record<string, unknown>;
        tokens: { accessToken: string };
      }>("/auth/login", body);
      saveAccessToken(data.tokens.accessToken);
      return { user: mapUser(data.user) };
    },
    register: async (body: { name: string; email: string; password: string }) => {
      const data = await post<{
        user: Record<string, unknown>;
        tokens: { accessToken: string };
      }>("/auth/register", body);
      saveAccessToken(data.tokens.accessToken);
      return { user: mapUser(data.user) };
    },
    logout: async () => {
      try {
        await post("/auth/logout");
      } finally {
        saveAccessToken(null);
      }
    },
  },
  users: {
    list: (search?: string) =>
      get<{ items: unknown[] }>(
        `/users${search ? `?search=${encodeURIComponent(search)}` : ""}`
      ).then((d) => ({
        users: (d.items ?? []).map((u) => mapUser(u as Record<string, unknown>)),
      })),
    get: (id: string) =>
      get<{ user: Record<string, unknown> }>(`/users/${id}`).then((d) => ({
        user: mapUser(d.user),
      })),
    skills: (id: string) =>
      get<{ skills: Record<string, unknown>[] }>(`/users/${id}/skills`).then(
        (d) => d.skills ?? []
      ),
  },
  marketplace: {
    browse: (search?: string) =>
      get<{ items: Record<string, unknown>[] }>(
        `/marketplace/browse${search ? `?search=${encodeURIComponent(search)}` : ""}`
      ).then((d) => ({ teachers: mapMarketplaceTeacher(d.items ?? []) })),
  },
  matches: {
    list: () =>
      get<{ matches: Record<string, unknown>[] }>("/matches").then((d) => ({
        matches: (d.matches ?? []).map((m) => mapMatch(m)),
      })),
  },
  swapRequests: {
    list: (status?: string) =>
      get<{ items: unknown[] }>(
        `/swap-requests${status ? `?status=${status}` : ""}`
      ).then((d) => ({ requests: d.items ?? [] })),
    create: (body: unknown) => post<{ swapRequest: unknown }>("/swap-requests", body),
  },
  sessions: {
    list: (status?: string) =>
      get<{ items: Record<string, unknown>[] }>(
        `/sessions${status ? `?status=${status}` : ""}`
      ).then(async (d) => {
        const me = await api.auth.me().catch(() => null);
        return {
          sessions: (d.items ?? []).map((s) =>
            mapSession(s, me?.user.id)
          ),
        };
      }),
  },
  conversations: {
    list: () => get<{ conversations: Record<string, unknown>[] }>("/chat/conversations"),
    getOrCreate: (participantId: string) =>
      post<{ conversation: { _id: string } }>("/chat/conversations", {
        participantId,
      }).then((d) => ({ conversationId: String(d.conversation._id) })),
    messages: (id: string) =>
      get<{ items: Record<string, unknown>[] }>(
        `/chat/conversations/${id}/messages`
      ).then((d) => ({ messages: d.items ?? [] })),
    send: (id: string, text: string) =>
      post<{ message: Record<string, unknown> }>(
        `/chat/conversations/${id}/messages`,
        { content: text }
      ),
    markRead: (id: string) => patch(`/chat/conversations/${id}/read`),
  },
  notifications: {
    list: () =>
      get<{ items: Record<string, unknown>[] }>("/notifications").then((d) => ({
        notifications: (d.items ?? []).map((n) => mapNotification(n)),
      })),
    unreadCount: () =>
      get<{ unreadCount: number }>("/notifications/unread-count").then(
        (d) => d.unreadCount ?? 0
      ),
    markRead: (id: string) => patch(`/notifications/${id}/read`),
    markAll: () => patch("/notifications/read-all"),
  },
  reviews: {
    list: (userId?: string) =>
      get<{ items: unknown[] }>(
        userId ? `/reviews/user/${userId}` : "/reviews/user/me"
      ).then((d) => ({ reviews: d.items ?? [] })),
    create: (body: unknown) => post<{ review: unknown }>("/reviews", body),
  },
  admin: {
    stats: () =>
      get<{
        stats: {
          users: number;
          skills: number;
          sessions: number;
          swapRequests: number;
          reviews: number;
          openReports: number;
        };
      }>("/admin/dashboard").then((d) => d.stats),
    users: (search?: string) =>
      get<{ items: Record<string, unknown>[] }>(
        `/admin/users${search ? `?search=${encodeURIComponent(search)}` : ""}`
      ).then((d) => ({
        users: (d.items ?? []).map((u) => mapUser(u)),
      })),
    updateUserStatus: (id: string, status: string) =>
      patch(`/admin/users/${id}/status`, { status }),
    updateUserRole: (id: string, role: string) =>
      patch(`/admin/users/${id}/role`, { role }),
    reports: () =>
      get<{ items: unknown[] }>("/admin/reports").then((d) => ({
        reports: d.items ?? [],
      })),
    resolveReport: (id: string, resolution: string) =>
      patch(`/admin/reports/${id}/resolve`, { resolution }),
  },
  reports: {
    create: (body: unknown) => post("/reports", body),
  },
};
