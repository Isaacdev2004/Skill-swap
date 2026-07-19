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

function mapUser(raw: Record<string, unknown>) {
  const avatarId = String(raw.avatarId ?? "indigo:U");
  const [avatarColor = "indigo", initials = "U"] = avatarId.split(":");

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
    joinedAt: String(raw.createdAt ?? raw.joinedAt ?? new Date().toISOString()),
  };
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
const put = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body) });
const patch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
const del = <T>(path: string) => request<T>(path, { method: "DELETE" });

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
      ).then((d) => ({ users: (d.items ?? []).map((u) => mapUser(u as Record<string, unknown>)) })),
    me: () => api.auth.me(),
    get: (id: string) =>
      get<{ user: Record<string, unknown> }>(`/users/${id}`).then((d) => ({
        user: mapUser(d.user),
      })),
    update: (body: Record<string, unknown>) =>
      patch<{ user: Record<string, unknown> }>(`/users/${body.id ?? "me"}`, body).then(
        (d) => ({ user: mapUser(d.user) })
      ),
  },
  matches: {
    list: () => get<{ matches: unknown[] }>("/matches"),
  },
  swapRequests: {
    list: () =>
      get<{ items: unknown[] }>("/swap-requests").then((d) => ({
        requests: d.items ?? [],
      })),
    create: (body: unknown) => post<{ swapRequest: unknown }>("/swap-requests", body),
    update: (id: string, body: unknown) =>
      patch<{ swapRequest: unknown }>(`/swap-requests/${id}`, body),
  },
  sessions: {
    list: (status?: string) =>
      get<{ items: unknown[] }>(
        `/sessions${status ? `?status=${status}` : ""}`
      ).then((d) => ({ sessions: d.items ?? [] })),
    create: (body: unknown) => post<{ session: unknown }>("/sessions", body),
    update: (id: string, body: unknown) =>
      patch<{ session: unknown }>(`/sessions/${id}`, body),
    cancel: (id: string) => patch(`/sessions/${id}/cancel`),
  },
  conversations: {
    list: () =>
      get<{ conversations: unknown[] }>("/chat/conversations"),
    getOrCreate: (participantId: string) =>
      post<{ conversation: { _id: string } }>("/chat/conversations", {
        participantId,
      }).then((d) => ({ conversationId: d.conversation._id })),
    messages: (id: string) =>
      get<{ items: unknown[] }>(`/chat/conversations/${id}/messages`).then((d) => ({
        messages: d.items ?? [],
      })),
    send: (id: string, text: string) =>
      post<{ message: unknown }>(`/chat/conversations/${id}/messages`, {
        content: text,
      }),
  },
  notifications: {
    list: () =>
      get<{ items: unknown[]; meta?: { unreadCount?: number } }>("/notifications").then(
        (d) => ({
          notifications: d.items ?? [],
          unreadCount: d.meta?.unreadCount ?? 0,
        })
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
    stats: () => get<{ stats: unknown }>("/admin/dashboard").then((d) => d.stats),
    users: (search?: string) =>
      get<{ items: unknown[] }>(
        `/admin/users${search ? `?search=${encodeURIComponent(search)}` : ""}`
      ).then((d) => ({ users: d.items ?? [] })),
    updateUser: (id: string, body: unknown) => patch(`/admin/users/${id}`, body),
    reports: () =>
      get<{ items: unknown[] }>("/admin/reports").then((d) => ({ reports: d.items ?? [] })),
    resolveReport: (id: string, resolution: string) =>
      patch(`/admin/reports/${id}/resolve`, { resolution }),
  },
  reports: {
    create: (body: unknown) => post("/reports", body),
  },
};
