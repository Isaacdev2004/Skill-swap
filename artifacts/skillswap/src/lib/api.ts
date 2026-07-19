const BASE = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  const data = await res.json().catch(() => ({ message: res.statusText }));
  if (!res.ok) throw new ApiError(res.status, data?.message ?? "Request failed");
  return data as T;
}

const get  = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) });
const put  = <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) });
const del  = <T>(path: string) => request<T>(path, { method: "DELETE" });

export const api = {
  auth: {
    me:       ()          => get<{ user: any }>("/auth/me"),
    login:    (b: any)    => post<{ user: any }>("/auth/login", b),
    register: (b: any)    => post<{ user: any }>("/auth/register", b),
    logout:   ()          => post("/auth/logout"),
  },
  users: {
    list:     (q?: string, category?: string) => get<{ users: any[] }>(`/users${q || category ? `?${new URLSearchParams({ ...(q ? { q } : {}), ...(category ? { category } : {}) })}` : ""}`),
    me:       ()          => get<{ user: any }>("/users/me"),
    get:      (id: string) => get<{ user: any }>(`/users/${id}`),
    update:   (b: any)    => put<{ user: any }>("/users/me", b),
  },
  matches: {
    list: () => get<{ matches: any[] }>("/matches"),
  },
  swapRequests: {
    list:   ()        => get<{ requests: any[] }>("/swap-requests"),
    create: (b: any)  => post<{ request: any }>("/swap-requests", b),
    update: (id: string, b: any) => put<{ request: any }>(`/swap-requests/${id}`, b),
  },
  sessions: {
    list:   (status?: string) => get<{ sessions: any[] }>(`/sessions${status ? `?status=${status}` : ""}`),
    create: (b: any)  => post<{ session: any }>("/sessions", b),
    update: (id: string, b: any) => put<{ session: any }>(`/sessions/${id}`, b),
    cancel: (id: string) => del(`/sessions/${id}`),
  },
  conversations: {
    list:         ()           => get<{ conversations: any[] }>("/conversations"),
    getOrCreate:  (userId: string) => post<{ conversationId: string }>("/conversations", { userId }),
    messages:     (id: string, since?: string) => get<{ messages: any[] }>(`/conversations/${id}/messages${since ? `?since=${encodeURIComponent(since)}` : ""}`),
    send:         (id: string, text: string, type?: string) => post<{ message: any }>(`/conversations/${id}/messages`, { text, type }),
  },
  notifications: {
    list:    ()        => get<{ notifications: any[]; unreadCount: number }>("/notifications"),
    markRead:(id: string) => put(`/notifications/${id}/read`),
    markAll: ()        => put("/notifications/read-all"),
  },
  reviews: {
    list:   (userId?: string) => get<{ reviews: any[] }>(`/reviews${userId ? `?userId=${userId}` : ""}`),
    create: (b: any)  => post<{ review: any }>("/reviews", b),
  },
  admin: {
    stats:   ()       => get<any>("/admin/stats"),
    users:   (q?: string, status?: string) => get<{ users: any[] }>(`/admin/users${q || status ? `?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}) })}` : ""}`),
    updateUser: (id: string, b: any) => put(`/admin/users/${id}`, b),
    reports: ()       => get<{ reports: any[] }>("/admin/reports"),
    resolveReport: (id: string, status: string) => post(`/admin/reports/${id}/resolve`, { status }),
  },
  reports: {
    create: (b: any) => post("/reports", b),
  },
  seed: () => post("/seed"),
};
