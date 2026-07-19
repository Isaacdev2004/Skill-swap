// Thin wrappers around react-query for SkillSwap API endpoints
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

/* ── Auth / current user ── */
export function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: () => api.auth.me().then((r) => r.user), retry: false, staleTime: 60_000 });
}

/* ── Marketplace users ── */
export function useUsers(q?: string, category?: string) {
  return useQuery({ queryKey: ["users", q, category], queryFn: () => api.users.list(q, category).then((r) => r.users), staleTime: 30_000 });
}

/* ── User profile ── */
export function useUser(id?: string) {
  return useQuery({ queryKey: ["user", id], queryFn: () => (id ? api.users.get(id) : api.users.me()).then((r) => r.user), enabled: !!id || id === undefined, staleTime: 30_000 });
}

/* ── Matches ── */
export function useMatches() {
  return useQuery({ queryKey: ["matches"], queryFn: () => api.matches.list().then((r) => r.matches), staleTime: 60_000 });
}

/* ── Swap requests ── */
export function useSwapRequests() {
  return useQuery({ queryKey: ["swap-requests"], queryFn: () => api.swapRequests.list().then((r) => r.requests), staleTime: 30_000 });
}

/* ── Sessions ── */
export function useSessions(status?: string) {
  return useQuery({ queryKey: ["sessions", status], queryFn: () => api.sessions.list(status).then((r) => r.sessions), staleTime: 30_000 });
}

/* ── Conversations ── */
export function useConversations() {
  return useQuery({ queryKey: ["conversations"], queryFn: () => api.conversations.list().then((r) => r.conversations), refetchInterval: 5_000 });
}

/* ── Messages (polling) ── */
export function useMessages(conversationId?: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => api.conversations.messages(conversationId!).then((r) => r.messages),
    enabled: !!conversationId,
    refetchInterval: 3_000,
  });
}

/* ── Notifications ── */
export function useNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: () => api.notifications.list(), refetchInterval: 15_000 });
}

/* ── Reviews ── */
export function useReviews(userId?: string) {
  return useQuery({ queryKey: ["reviews", userId], queryFn: () => api.reviews.list(userId).then((r) => r.reviews), staleTime: 30_000 });
}

/* ── Admin ── */
export function useAdminStats() {
  return useQuery({ queryKey: ["admin-stats"], queryFn: () => api.admin.stats(), staleTime: 30_000 });
}
export function useAdminUsers(q?: string, status?: string) {
  return useQuery({ queryKey: ["admin-users", q, status], queryFn: () => api.admin.users(q, status).then((r) => r.users), staleTime: 15_000 });
}
export function useAdminReports() {
  return useQuery({ queryKey: ["admin-reports"], queryFn: () => api.admin.reports().then((r) => r.reports), staleTime: 15_000 });
}

/* ── Send message mutation ── */
export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ text, type }: { text: string; type?: string }) => api.conversations.send(conversationId, text, type),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", conversationId] }),
  });
}

/* ── Update profile mutation ── */
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.users.update(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["me"] }); qc.invalidateQueries({ queryKey: ["user"] }); },
  });
}
